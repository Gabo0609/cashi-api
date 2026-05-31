import type { Context } from "hono";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../schemas/transaction.schema.js";
import { transactionRepository } from "../repositories/transaction.repository.js";

export const getTransactions = async (c: Context) => {
  const user = c.get("user") as any;

  const transactions = await transactionRepository.findAllByUserId(
    Number(user.id)
  );

  return c.json(transactions);
};

export const getTransactionById = async (c: Context) => {
  const user = c.get("user") as any;
  const id = Number(c.req.param("id"));

  const transaction = await transactionRepository.findById(id);

  if (!transaction) {
    return c.json({ message: "Transaction not found" }, 404);
  }

  if (transaction.userId !== Number(user.id)) {
    return c.json({ message: "Forbidden" }, 403);
  }

  return c.json(transaction);
};

export const createTransaction = async (c: Context) => {
  const user = c.get("user") as any;
  const body = await c.req.json();

  const result = createTransactionSchema.safeParse(body);

  if (!result.success) {
    return c.json(result.error, 400);
  }

  const transaction = await transactionRepository.create(
    result.data,
    Number(user.id)
  );

  return c.json(transaction, 201);
};

export const updateTransaction = async (c: Context) => {
  const user = c.get("user") as any;
  const id = Number(c.req.param("id"));
  const body = await c.req.json();

  const result = updateTransactionSchema.safeParse(body);

  if (!result.success) {
    return c.json(result.error, 400);
  }

  const transaction = await transactionRepository.findById(id);

  if (!transaction) {
    return c.json({ message: "Transaction not found" }, 404);
  }

  if (transaction.userId !== Number(user.id)) {
    return c.json({ message: "Forbidden" }, 403);
  }

  const updatedTransaction = await transactionRepository.update(
    id,
    result.data
  );

  return c.json(updatedTransaction);
};

export const deleteTransaction = async (c: Context) => {
  const user = c.get("user") as any;
  const id = Number(c.req.param("id"));

  const transaction = await transactionRepository.findById(id);

  if (!transaction) {
    return c.json({ message: "Transaction not found" }, 404);
  }

  if (transaction.userId !== Number(user.id)) {
    return c.json({ message: "Forbidden" }, 403);
  }

  await transactionRepository.delete(id);

  return c.json({
    message: "Transaction deleted",
  });
};

export const getBalance = async (c: Context) => {
  const user = c.get("user") as any;

  const transactions = await transactionRepository.findAllByUserId(
    Number(user.id)
  );

  const totalIncome = transactions
    .filter((transaction: any) => transaction.type === "income")
    .reduce(
      (total: number, transaction: any) => total + transaction.amount,
      0
    );

  const totalExpense = transactions
    .filter((transaction: any) => transaction.type === "expense")
    .reduce(
      (total: number, transaction: any) => total + transaction.amount,
      0
    );

  const balance = totalIncome - totalExpense;

  return c.json({
    totalIncome,
    totalExpense,
    balance,
  });
};