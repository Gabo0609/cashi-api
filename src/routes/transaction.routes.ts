import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import {
  createTransaction,
  deleteTransaction,
  getBalance,
  getTransactions,
  getTransactionById,
  updateTransaction,
  uploadReceipt,
} from "../controllers/transaction.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

export const transactionRoutes = new Hono();

transactionRoutes.get("/balance", getBalance);
transactionRoutes.post(
  "/upload",
  async (c, next) => {
    await new Promise<void>((resolve, reject) => {
      upload.single("receipt")(
        c.req.raw as any,
        {} as any,
        (err: any) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    await next();
  },
  uploadReceipt
);

transactionRoutes.get("/", getTransactions);
transactionRoutes.get("/:id", getTransactionById);
transactionRoutes.post("/", createTransaction);
transactionRoutes.patch("/:id", updateTransaction);
transactionRoutes.delete("/:id", deleteTransaction);