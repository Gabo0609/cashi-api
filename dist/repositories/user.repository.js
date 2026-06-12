import { prisma } from "../lib/prisma.js";
export const userRepository = {
    findByEmail: (email) => {
        return prisma.user.findUnique({
            where: { email },
        });
    },
    create: (email, passwordHash) => {
        return prisma.user.create({
            data: {
                email,
                passwordHash,
            },
        });
    },
};
//# sourceMappingURL=user.repository.js.map