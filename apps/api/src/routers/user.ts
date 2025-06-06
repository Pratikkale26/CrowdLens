import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { prismaClient } from "db/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware";
import { createTaskSchema } from "../types";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    },
    region: "blr1",
    endpoint: "https://blr1.digitaloceanspaces.com",
});

router.get("/task", authMiddleware, async (req, res) => {
    const taskId = req.query.taskId;
    const userId = req.userId;

    const taskDetails = await prismaClient.task.findFirst({
        where: {
            user_id: Number(userId),
            id: Number(taskId)
        },
        include: {
            options: true
        }
    })

    if(!taskDetails) {
        res.status(411).json({
            msg: "you don't have access to this task"
        })
        return
    }

    const responses = await prismaClient.submission.findMany({
        where:{
            task_id:Number(taskId)
        },
        include: {
            option: true
        }
    })

    const result: Record<string, {
        count: number,
        option: {
            imageUrl: string
        }
    }> = {};

    taskDetails.options.forEach(option => {
        result[option.id] = {
            count: 0,
            option: {
                imageUrl: option.image_url
            }
        }
    })

    responses.forEach(r => {
        result[r.option_id].count++;
    })

    res.json({
        result
    })
})

router.post("/task", authMiddleware, async (req, res) => {
    const userId = req.userId;
    // validate inputs
    const body = req.body;

    const parsedBody = createTaskSchema.safeParse(body);
    
    if(!parsedBody.success) {
        res.status(411).json({
            message: "You have sent invalid inputs",
            errors: parsedBody.error.errors
        })
        return;
    }

    const taskResult = await prismaClient.$transaction(async (tx) => {
        const task = await tx.task.create({
            data: {
                title: parsedBody.data.title,
                user_id: Number(userId),
                signature: parsedBody.data.signature,
                amount: 0.1 * LAMPORTS_PER_SOL,
            }
        })

        await tx.option.createMany({
            data: parsedBody.data.options.map(x => ({
                image_url: x.imageUrl,
                task_id: task.id
            }))
        })
        return task
    })
    res.json({
        id: taskResult.id
    })
});


router.get("/presigned-url", authMiddleware, async (req, res) => {
    try {
      const userId = req.userId;
      const key = `user/${userId}/${uuidv4()}/image.jpg`;
  
      const { url, fields } = await createPresignedPost(s3Client, {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Conditions: [
          ['content-length-range', 0, 5 * 1024 * 1024], // Max 5MB
          ['starts-with', '$key', `user/${userId}/`],
          { acl: 'public-read' }, // Ensure object is publicly accessible
        ],
        Fields: {
          acl: 'public-read', // Required to actually set it
        },
        Expires: 3600,
      });
  
      res.json({ preSignedUrl: url, fields });
    } catch (err) {
      console.error("Presigned URL generation error:", err);
      res.status(500).json({ error: "Failed to generate presigned URL" });
    }
  });
  

// signin with wallet address
router.post("/signin", async (req, res) => {
    const hardcoded_address = "B7KCQ5Fekn8Xa42oRTT5rtNBjSHsFgCm3Yc2QeVUbhwj";

    const user = await prismaClient.user.findUnique({
        where: {
            address: hardcoded_address
        }
    });

    if(user) {
        const token = jwt.sign({
            address: hardcoded_address,
            id: user?.id
        }, process.env.JWT_SECRET!);

        res.json({ token });
    } else {
        const newUser = await prismaClient.user.create({
            data: { address: hardcoded_address }
        });

        const token = jwt.sign({
            address: hardcoded_address,
            id: newUser?.id
        }, process.env.JWT_SECRET!);

        res.json({ token });
    }
});

export default router;