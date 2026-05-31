import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { categoryRoutes } from "./routes/category.routes.js";
import { transactionRoutes } from "./routes/transaction.routes.js";
import { authRoutes } from "./routes/auth.routes.js";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "Cashi API funcionando",
  });
});

app.route("/categories", categoryRoutes);
app.route("/transactions", transactionRoutes);
app.route("/auth", authRoutes);
serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("Servidor corriendo en http://localhost:3000");