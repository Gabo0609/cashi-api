import { prisma } from "../lib/prisma.js";

export const userRepository = {
  findByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  create: (email: string, passwordHash: string) => {
    return prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });
  },
};