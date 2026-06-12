import crypto from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createTransactionSchema, updateTransactionSchema, } from "../schemas/transaction.schema.js";
import { transactionRepository } from "../repositories/transaction.repository.js";
import { r2 } from "../lib/r2.js";
export const getTransactions = async (c) => {
    const user = c.get("user");
    const transactions = await transactionRepository.findAllByUserId(Number(user.id));
    return c.json(transactions);
};
export const getTransactionById = async (c) => {
    const user = c.get("user");
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
export const createTransaction = async (c) => {
    const user = c.get("user");
    const body = await c.req.json();
    const result = createTransactionSchema.safeParse(body);
    if (!result.success) {
        return c.json(result.error, 400);
    }
    const transaction = await transactionRepository.create(result.data, Number(user.id));
    return c.json(transaction, 201);
};
export const updateTransaction = async (c) => {
    const user = c.get("user");
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
    const updatedTransaction = await transactionRepository.update(id, result.data);
    return c.json(updatedTransaction);
};
export const deleteTransaction = async (c) => {
    const user = c.get("user");
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
export const getBalance = async (c) => {
    const user = c.get("user");
    const transactions = await transactionRepository.findAllByUserId(Number(user.id));
    const totalIncome = transactions
        .filter((transaction) => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0);
    const totalExpense = transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.amount, 0);
    const balance = totalIncome - totalExpense;
    return c.json({
        totalIncome,
        totalExpense,
        balance,
    });
};
const getRequiredEnv = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} no está configurada`);
    }
    return value;
};
export const uploadReceipt = async (c) => {
    const formData = await c.req.raw.formData();
    const file = formData.get("receipt");
    if (!file || typeof file === "string") {
        return c.json({ message: "Receipt file is required" }, 400);
    }
    const originalName = file.name.toLowerCase();
    const mimeType = file.type.toLowerCase();
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const hasValidMimeType = validMimeTypes.includes(mimeType);
    const hasValidExtension = validExtensions.some((extension) => originalName.endsWith(extension));
    if (!hasValidMimeType && !hasValidExtension) {
        return c.json({ message: "Only JPEG, PNG or WebP files are allowed" }, 400);
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        return c.json({ message: "File size must be less than 5 MB" }, 400);
    }
    let extension = originalName.split(".").pop() || "";
    if (!extension) {
        if (mimeType === "image/jpeg")
            extension = "jpg";
        if (mimeType === "image/png")
            extension = "png";
        if (mimeType === "image/webp")
            extension = "webp";
    }
    if (extension === "jpeg") {
        extension = "jpg";
    }
    const filename = `${crypto.randomUUID()}.${extension}`;
    const key = `receipts/${filename}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await r2.send(new PutObjectCommand({
        Bucket: getRequiredEnv("R2_BUCKET_NAME"),
        Key: key,
        Body: buffer,
        ContentType: mimeType,
    }));
    const publicUrl = getRequiredEnv("R2_PUBLIC_URL");
    return c.json({
        receiptUrl: `${publicUrl}/${key}`,
    });
};
//# sourceMappingURL=transaction.controller.js.map