import { Hono } from "hono";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";

export const categoryRoutes = new Hono();

categoryRoutes.get("/", getCategories);
categoryRoutes.get("/:id", getCategoryById);
categoryRoutes.post("/", createCategory);
categoryRoutes.patch("/:id", updateCategory);
categoryRoutes.delete("/:id", deleteCategory);