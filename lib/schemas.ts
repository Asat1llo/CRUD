import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name too long"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100, "Name too long"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  price: z.coerce
    .number({
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be a positive number"),
});

export type ProductFormData = z.infer<typeof productSchema>;
