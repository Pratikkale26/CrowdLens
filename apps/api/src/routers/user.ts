import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { prismaClient } from "db/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware";
import { createTaskSchema } from "../types";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { v4 as uuidv4 } from "uuid";
import nacl from "tweetnacl";
import { PARENT_WALLET_ADDRESS } from "../../utils/solana";

const router = Router();

const connection = new Connection(process.env.RPC_URL!);

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    },
    region: "blr1",
    endpoint: "https://blr1.digitaloceanspaces.com",
});

interface Option {
    id: number;
    image_url: string;
    task_id: number;
}

interface Response {
    option_id: number;
    option: Option;
}

interface Transaction {
    meta?: {
        postBalances: number[];
        preBalances: number[];
    };
    transaction: {
        message: {
            getAccountKeys: () => {
                get: (index: number) => PublicKey | undefined;
            };
        };
    };
}

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

    taskDetails.options.forEach((option: Option) => {
        result[option.id] = {
            count: 0,
            option: {
                imageUrl: option.image_url
            }
        }
    })

    responses.forEach((r: Response) => {
        result[r.option_id].count++;
    })

    res.json({
        result,
        taskDetails: {
            title: taskDetails.title
        }
    })
})

router.post("/task", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const user = await prismaClient.user.findUnique({
        where: {
            id: Number(userId)
        }
    })
    
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

    const transaction = await connection.getTransaction(parsedBody.data.signature, {
        maxSupportedTransactionVersion: 1,
        commitment: "confirmed"
    }) as Transaction | null;
    
    // check if the transaction is valid
    if ((transaction?.meta?.postBalances[1] ?? 0) -
        (transaction?.meta?.preBalances[1] ?? 0) !== 100000000 ) {
      res.status(411).json({ message: "Incorrect transaction amount" });
      return;
    }
  
    // check if the transaction is sent to the correct address
    if (transaction?.transaction.message.getAccountKeys().get(1)?.toString() !== PARENT_WALLET_ADDRESS ) {
      res.status(411).json({ message: "Sent to wrong address" });
      return;
    }
  
    // check if the transaction is sent from the correct address
    if (transaction?.transaction.message.getAccountKeys().get(0)?.toString() !== user?.address ) {
      res.status(411).json({ message: "Sent from wrong address"});
      return;
    }

    const taskResult = await prismaClient.$transaction(async (tx: any) => {
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
    const { signature, publicKey } = req.body;
    const message = new TextEncoder().encode("Sign in into Crowdlens");

    const result = nacl.sign.detached.verify(
        message,
        new Uint8Array(signature.data),
        new PublicKey(publicKey).toBytes()
    );

    if(!result) {
        res.status(401).json({ error: "Invalid signature" });
        return;
    }

    const user = await prismaClient.user.findUnique({
        where: {
            address: publicKey
        }
    });

    if(user) {
        const token = jwt.sign({
            address: publicKey,
            id: user?.id
        }, process.env.JWT_SECRET!);

        res.json({ token });
    } else {
        const newUser = await prismaClient.user.create({
            data: { address: publicKey }
        });

        const token = jwt.sign({
            address: publicKey,
            id: newUser?.id
        }, process.env.JWT_SECRET!);

        res.json({ token });
    }
});

export default router;