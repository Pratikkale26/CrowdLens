import { prismaClient } from "db/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { workerAuthMiddleware } from "../middleware";
import { getNextTask } from "../db";

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
        }, process.env.WORKER_JWT_SECRET!);

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
        }, process.env.WORKER_JWT_SECRET!);

        res.json({ token });
    }
});

router.get("/nextTask", workerAuthMiddleware, async (req, res) => {
    const userId = req.userId;

    const task = await getNextTask(Number(userId));

    if (!task) {
        res.status(411).json({   
            message: "No more tasks left for you to review"
        })
    } else {
        res.json({   
            task
        })
    }
})

export default router;
