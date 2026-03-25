"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormData, productSchema } from "@/lib/schemas";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Category } from "@/types";

interface ProductFormProps {
  categories: Category[];
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

export function ProductForm({ categories, initialData, onSubmit, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      categoryId: "",
      description: "",
      price: 0,
    },
  });

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Product Name"
        placeholder="e.g. iPhone 15 Pro"
        {...register("name")}
        error={errors.name?.message}
      />
      
      <Select
        label="Category"
        options={categoryOptions}
        {...register("categoryId")}
        error={errors.categoryId?.message}
      />

      <Input
        label="Description"
        placeholder="e.g. A high-end smartphone..."
        {...register("description")}
        error={errors.description?.message}
      />

      <Input
        label="Price ($)"
        type="number"
        step="0.01"
        placeholder="0.00"
        {...register("price")}
        error={errors.price?.message}
      />

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {initialData ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}
