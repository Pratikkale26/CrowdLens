import { z } from "zod";

export const createTaskSchema = z.object({
    options: z.array(z.object({
        imageUrl: z.string(),
    })),
    title: z.string().optional(),
    signature: z.string(),
})

export const createSubmissionInput = z.object({
    taskId: z.string(),
    selection: z.string(),
});