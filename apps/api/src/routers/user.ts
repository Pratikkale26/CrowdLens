import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { prismaClient } from "db/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `user/${userId}/${Date.now()}/image.png`,
        ContentType: "image/png"
    })

    const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600
    })

    res.json({ presignedUrl });
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