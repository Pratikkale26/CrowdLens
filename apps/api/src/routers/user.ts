import { prismaClient } from "db/client";
import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

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