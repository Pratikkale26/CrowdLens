import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        //@ts-ignore
        if(decoded.id) {
            //@ts-ignore
            req.userId = decoded.id;
            return next();
        }else {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

}

export const workerAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.WORKER_JWT_SECRET!);
        //@ts-ignore
        if(decoded.id) {
            //@ts-ignore
            req.userId = decoded.id;
            return next();
        }else {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

}
