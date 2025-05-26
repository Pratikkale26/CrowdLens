import { prismaClient } from "db/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { workerAuthMiddleware } from "../middleware";
import { getNextTask } from "../db";
import { createSubmissionInput } from "../types";

const router = Router();

const TOTAL_SUBMISSIONS = 100;

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

router.post("/submission", workerAuthMiddleware, async (req, res) => {
    const userId = req.userId;
    const body = req.body;
    const parsedBody = createSubmissionInput.safeParse(body);

    if (parsedBody.success) {
        const task = await getNextTask(Number(userId));
        if (!task || task?.id !== Number(parsedBody.data.taskId)) {
            res.status(411).json({
                message: "Incorrect task id"
            })
            return;
        }

        const amount = (Number(task.amount) / TOTAL_SUBMISSIONS).toString();

        const submission = await prismaClient.$transaction(async tx => {
            const submission = await tx.submission.create({
                data: {
                    option_id: Number(parsedBody.data.selection),
                    worker_id: Number(userId),
                    task_id: Number(parsedBody.data.taskId),
                    amount: Number(amount)
                }
            })

            await tx.worker.update({
                where: {
                    id: Number(userId),
                },
                data: {
                    pending_amount: {
                        increment: Number(amount)
                    }
                }
            })

            return submission;
        })

        const nextTask = await getNextTask(Number(userId));
        res.json({
            nextTask,
            amount
        })
        

    } else {
        res.status(411).json({
            message: "Incorrect inputs"
        })
            
    }

})


export default router;
