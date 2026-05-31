import { Hono } from "hono";
import {
  createTransaction,
  deleteTransaction,
  getBalance,
  getTransactions,
  getTransactionById,
  updateTransaction,
  uploadReceipt,
} from "../controllers/transaction.controller.js";

export const transactionRoutes = new Hono();

transactionRoutes.get("/balance", getBalance);
transactionRoutes.post("/upload", uploadReceipt);
transactionRoutes.get("/", getTransactions);
transactionRoutes.get("/:id", getTransactionById);
transactionRoutes.post("/", createTransaction);
transactionRoutes.patch("/:id", updateTransaction);
transactionRoutes.delete("/:id", deleteTransaction);