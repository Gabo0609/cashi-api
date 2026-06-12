import { prisma } from "../lib/prisma.js";
export const transactionRepository = {
    findAllByUserId: (userId) => {
        return prisma.transaction.findMany({
            where: { userId },
            include: {
                category: true,
            },
        });
    },
    findById: (id) => {
        return prisma.transaction.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });
    },
    create: (data, userId) => {
        return prisma.transaction.create({
            data: {
                amount: data.amount,
                type: data.type,
                description: data.description,
                date: new Date(data.date),
                categoryId: data.categoryId,
                userId,
                receiptUrl: data.receiptUrl,
                latitude: data.latitude,
                longitude: data.longitude,
            },
            include: {
                category: true,
            },
        });
    },
    update: (id, data) => {
        const updateData = {};
        if (data.amount !== undefined)
            updateData.amount = data.amount;
        if (data.type !== undefined)
            updateData.type = data.type;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.categoryId !== undefined)
            updateData.categoryId = data.categoryId;
        if (data.date !== undefined)
            updateData.date = new Date(data.date);
        if (data.receiptUrl !== undefined)
            updateData.receiptUrl = data.receiptUrl;
        if (data.latitude !== undefined)
            updateData.latitude = data.latitude;
        if (data.longitude !== undefined)
            updateData.longitude = data.longitude;
        return prisma.transaction.update({
            where: { id },
            data: updateData,
            include: {
                category: true,
            },
        });
    },
    delete: (id) => {
        return prisma.transaction.delete({
            where: { id },
        });
    },
};
//# sourceMappingURL=transaction.repository.js.map