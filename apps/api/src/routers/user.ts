import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { prismaClient } from "db/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware";

const router = Router();

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    },
    region: process.env.AWS_REGION!
});

router.get("/presigned-url", authMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;

    const { url, fields } = await createPresignedPost(s3Client, {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `user/${userId}/${Math.random()}/image.jpg`,
        Conditions: [
          ['content-length-range', 0, 5 * 1024 * 1024] // 5 MB max
        ],
        Expires: 3600
    })

    res.json({
        preSignedUrl: url,
        fields
    })
})

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