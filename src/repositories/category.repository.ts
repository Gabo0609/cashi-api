import { prisma } from "../lib/prisma.js";

export const categoryRepository = {
  findAll: () => {
    return prisma.category.findMany();
  },

  findById: (id: number) => {
    return prisma.category.findUnique({
      where: { id },
    });
  },

  create: (name: string) => {
    return prisma.category.create({
      data: { name },
    });
  },

  update: (id: number, name: string) => {
    return prisma.category.update({
      where: { id },
      data: { name },
    });
  },

  delete: (id: number) => {
    return prisma.category.delete({
      where: { id },
    });
  },
};