import { z } from "zod";
export const createTransactionSchema = z.object({
    amount: z.number().positive(),
    type: z.enum(["income", "expense"]),
    description: z.string().optional(),
    date: z.string(),
    categoryId: z.number().int().positive(),
    receiptUrl: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});
export const updateTransactionSchema = z.object({
    amount: z.number().positive().optional(),
    type: z.enum(["income", "expense"]).optional(),
    description: z.string().optional(),
    date: z.string().optional(),
    categoryId: z.number().int().positive().optional(),
    receiptUrl: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});
//# sourceMappingURL=transaction.schema.js.map