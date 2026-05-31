import type { Context } from "hono";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
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
    .reduce((total: number, transaction: any) => total + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction: any) => transaction.type === "expense")
    .reduce((total: number, transaction: any) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpense;

  return c.json({
    totalIncome,
    totalExpense,
    balance,
  });
};

export const uploadReceipt = async (c: Context) => {
  const formData = await c.req.raw.formData();
  const file = formData.get("receipt");

  if (!file || typeof file === "string") {
    return c.json({ message: "Receipt file is required" }, 400);
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return c.json({ message: "Only JPEG, PNG or WebP files are allowed" }, 400);
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    return c.json({ message: "File size must be less than 5 MB" }, 400);
  }

  await mkdir("uploads", { recursive: true });

  const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `${crypto.randomUUID()}.${extension}`;
  const filepath = path.join("uploads", filename);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await writeFile(filepath, buffer);

  return c.json({
    receiptUrl: `/uploads/${filename}`,
  });
};