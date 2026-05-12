import { Hono } from "hono";
import {
  createTransaction,
  deleteTransaction,
  getBalance,
  getTransactions,
  getTransactionById,
  updateTransaction,
} from "../controllers/transaction.controller.js";

export const transactionRoutes = new Hono();

transactionRoutes.get("/balance", getBalance);
transactionRoutes.get("/", getTransactions);
transactionRoutes.get("/:id", getTransactionById);
transactionRoutes.post("/", createTransaction);
transactionRoutes.patch("/:id", updateTransaction);
transactionRoutes.delete("/:id", deleteTransaction);