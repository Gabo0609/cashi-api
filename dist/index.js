import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { categoryRoutes } from "./routes/category.routes.js";
import { transactionRoutes } from "./routes/transaction.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
const app = new Hono();
app.get("/", (c) => {
    return c.json({
        status: "ok",
        message: "Cashi API funcionando",
    });
});
app.get("/health", (c) => {
    return c.json({
        status: "healthy",
    });
});
app.use("/categories", authMiddleware);
app.use("/categories/*", authMiddleware);
app.use("/transactions", authMiddleware);
app.use("/transactions/*", authMiddleware);
app.route("/categories", categoryRoutes);
app.route("/transactions", transactionRoutes);
app.route("/auth", authRoutes);
const port = Number(process.env.PORT) || 3000;
serve({
    fetch: app.fetch,
    port,
});
console.log(`Servidor corriendo en puerto ${port}`);
//# sourceMappingURL=index.js.map