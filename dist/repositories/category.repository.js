import { prisma } from "../lib/prisma.js";
export const categoryRepository = {
    findAll: () => {
        return prisma.category.findMany();
    },
    findById: (id) => {
        return prisma.category.findUnique({
            where: { id },
        });
    },
    create: (name) => {
        return prisma.category.create({
            data: { name },
        });
    },
    update: (id, name) => {
        return prisma.category.update({
            where: { id },
            data: { name },
        });
    },
    delete: (id) => {
        return prisma.category.delete({
            where: { id },
        });
    },
};
//# sourceMappingURL=category.repository.js.map