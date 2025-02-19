import { z } from "zod";
import { formatNumberWithDecimal } from "../utils/utils";

const Price = (field: string) =>
  z
    .coerce
    .number()
    .refine(
      (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
      `${field} must have exactly two decimal places (e.g., 49.99)`
    );

export const OrderItemInputSchema = z.object({
  clientId: z.string().min(1, "clientId is required"),
  product: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z
    .number()
    .int()
    .nonnegative("Quantity must be a non-negative number"),
  countInStock: z
    .number()
    .int()
    .nonnegative("Quantity must be a non-negative number"),
  image: z.string().min(1, "Image is required"),
  price: Price("Price"),
  size: z.string().optional(),
  color: z.string().optional(),
});
