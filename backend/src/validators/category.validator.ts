import { z } from "zod";

// Schema for creating a new category
export const CategoryInputSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Category name must be at least 2 characters" })
    .max(50, { message: "Category name cannot exceed 50 characters" }),
  slug: z
    .string()
    .min(2, { message: "Slug must be at least 2 characters" })
    .max(50, { message: "Slug cannot exceed 50 characters" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
  description: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  parentCategory: z.string().optional(),
});

// Schema for updating an existing category
export const CategoryUpdateSchema = CategoryInputSchema.partial();

// Schema for category ID validation
export const CategoryIdSchema = z.object({
  id: z.string().min(1, { message: "Category ID is required" }),
});

// Schema for querying categories
export const CategoryQuerySchema = z.object({
  isActive: z.boolean().optional(),
  parentCategory: z.string().optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().optional(),
  page: z.number().int().positive().optional(),
}); 