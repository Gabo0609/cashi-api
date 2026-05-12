import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["income", "expense"]),
  description: z.string().optional(),
  date: z.string(),
  categoryId: z.number().int().positive(),
});

export const updateTransactionSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.enum(["income", "expense"]).optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  categoryId: z.number().int().positive().optional(),
});