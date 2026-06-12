import jwt from "jsonwebtoken";
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET no está configurado");
    }
    return secret;
};
export const authMiddleware = async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
        return c.json({ message: "Token required" }, 401);
    }
    if (!authHeader.startsWith("Bearer ")) {
        return c.json({ message: "Invalid authorization format" }, 401);
    }
    const token = authHeader.replace("Bearer ", "");
    try {
        const payload = jwt.verify(token, getJwtSecret());
        c.set("user", payload);
        await next();
    }
    catch {
        return c.json({ message: "Invalid token" }, 401);
    }
};
//# sourceMappingURL=auth.middleware.js.map