import { prisma } from "../lib/prisma.js";

export const transactionRepository = {
  findAll: () => {
    return prisma.transaction.findMany({
      include: {
        category: true,
      },
    });
  },

  findById: (id: number) => {
    return prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  },

  create: (data: any) => {
    return prisma.transaction.create({
      data: {
        amount: data.amount,
        type: data.type,
        description: data.description,
        date: new Date(data.date),
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      },
    });
  },

  update: (id: number, data: any) => {
    const updateData: any = {
      amount: data.amount,
      type: data.type,
      description: data.description,
      categoryId: data.categoryId,
    };

    if (data.date) {
      updateData.date = new Date(data.date);
    }

    return prisma.transaction.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });
  },

  delete: (id: number) => {
    return prisma.transaction.delete({
      where: { id },
    });
  },
};