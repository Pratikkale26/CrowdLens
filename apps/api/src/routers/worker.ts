import { prismaClient } from "db/client";
import { Router } from "express";

const router = Router();

router.post("/signin", async (req, res) => {
    const { address } = req.body;
    const worker = await prismaClient.worker.create({
        data: { address, pending_amount: 0, locked_amount: 0 }
    });
    res.json(worker);
});

export default router;
