import type { Context } from "hono";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { userRepository } from "../repositories/user.repository.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const register = async (c: Context) => {
  const body = await c.req.json();

  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return c.json(result.error, 400);
  }

  const existingUser = await userRepository.findByEmail(result.data.email);

  if (existingUser) {
    return c.json({ message: "Email already registered" }, 409);
  }

  const passwordHash = await bcrypt.hash(result.data.password, 10);

  const user = await userRepository.create(result.data.email, passwordHash);

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return c.json(
    {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    },
    201
  );
};

export const login = async (c: Context) => {
  const body = await c.req.json();

  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return c.json(result.error, 400);
  }

  const user = await userRepository.findByEmail(result.data.email);

  if (!user) {
    return c.json({ message: "Invalid credentials" }, 401);
  }

  const passwordIsValid = await bcrypt.compare(
    result.data.password,
    user.passwordHash
  );

  if (!passwordIsValid) {
    return c.json({ message: "Invalid credentials" }, 401);
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return c.json({
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  });
};