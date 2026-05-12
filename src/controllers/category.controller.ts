import type { Context } from "hono";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema.js";
import { categoryRepository } from "../repositories/category.repository.js";

export const getCategories = async (c: Context) => {
  const categories = await categoryRepository.findAll();
  return c.json(categories);
};

export const getCategoryById = async (c: Context) => {
  const id = Number(c.req.param("id"));

  const category = await categoryRepository.findById(id);

  if (!category) {
    return c.json({ message: "Category not found" }, 404);
  }

  return c.json(category);
};

export const createCategory = async (c: Context) => {
  const body = await c.req.json();

  const result = createCategorySchema.safeParse(body);

  if (!result.success) {
    return c.json(result.error, 400);
  }

  const category = await categoryRepository.create(result.data.name);

  return c.json(category, 201);
};

export const updateCategory = async (c: Context) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();

  const result = updateCategorySchema.safeParse(body);

  if (!result.success) {
    return c.json(result.error, 400);
  }

  const category = await categoryRepository.findById(id);

  if (!category) {
    return c.json({ message: "Category not found" }, 404);
  }

  const updatedCategory = await categoryRepository.update(
    id,
    result.data.name ?? category.name
  );

  return c.json(updatedCategory);
};

export const deleteCategory = async (c: Context) => {
  const id = Number(c.req.param("id"));

  const category = await categoryRepository.findById(id);

  if (!category) {
    return c.json({ message: "Category not found" }, 404);
  }

  await categoryRepository.delete(id);

  return c.json({
    message: "Category deleted",
  });
};