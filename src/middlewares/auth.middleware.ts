import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    return c.json({ message: "Token required" }, 401);
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    c.set("user", payload);

    await next();
  } catch {
    return c.json({ message: "Invalid token" }, 401);
  }
};