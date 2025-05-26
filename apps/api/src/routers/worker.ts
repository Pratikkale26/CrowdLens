import { prismaClient } from "db/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
export const WORKER_JWT_SECRET = process.env.JWT_SECRET + "worker";

const router = Router();

router.post("/signin", async (req, res) => {
    const hardcoded_address = "GHA6AVEZAXqW1Sq5u2ymSJsjUzbBFp7R2hRbtHJBr1kP";

    const user = await prismaClient.worker.findUnique({
        where: {
            address: hardcoded_address
        }
    });

    if(user) {
        const token = jwt.sign({
            address: hardcoded_address,
            id: user?.id
        }, WORKER_JWT_SECRET);

        res.json({ token });
    } else {
        const newUser = await prismaClient.worker.create({
            data: {
                address: hardcoded_address,
                pending_amount: 0,
                locked_amount: 0
            }
        });

        const token = jwt.sign({
            address: hardcoded_address,
            id: newUser?.id
        }, WORKER_JWT_SECRET);

        res.json({ token });
    }
});

export default router;
