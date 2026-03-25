"use client";

import { useCallback, useMemo } from "react";
import { nanoid } from "nanoid";
import { useLocalStorage } from "./useLocalStorage";
import { Category } from "@/types";

const CATEGORIES_KEY = "product-app-categories-v2";

export function useCategories() {
  const [categories, setCategories] = useLocalStorage<Category[]>(CATEGORIES_KEY, []);

  const addCategory = useCallback((name: string) => {
    const newCategory: Category = { id: nanoid(), name };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  }, [setCategories]);

  const updateCategory = useCallback((id: string, name: string) => {
    setCategories((prev) => 
      prev.map((c) => (c.id === id ? { ...c, name } : c))
    );
  }, [setCategories]);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, [setCategories]);

  return useMemo(() => ({
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  }), [categories, addCategory, updateCategory, deleteCategory]);
}
