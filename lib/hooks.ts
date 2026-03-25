"use client";

import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Category, Product } from "@/types";

const CATEGORIES_KEY = "product-app-categories";
const PRODUCTS_KEY = "product-app-products";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CATEGORIES_KEY);
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      // Default categories if none exist
      const defaultCategories = [
        { id: nanoid(), name: "Electronics" },
        { id: nanoid(), name: "Clothing" },
        { id: nanoid(), name: "Home & Garden" },
      ];
      setCategories(defaultCategories);
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
    }
    setIsLoaded(true);
  }, []);

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories));
  };

  const addCategory = (name: string) => {
    const newCategory: Category = { id: nanoid(), name };
    saveCategories([...categories, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, name: string) => {
    saveCategories(
      categories.map((c) => (c.id === id ? { ...c, name } : c))
    );
  };

  const deleteCategory = (id: string) => {
    saveCategories(categories.filter((c) => c.id !== id));
  };

  return { categories, addCategory, updateCategory, deleteCategory, isLoaded };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      setProducts([]);
    }
    setIsLoaded(true);
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(newProducts));
  };

  const addProduct = (data: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...data,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    };
    saveProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string, data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) => {
    const now = new Date().toISOString();
    saveProducts(
      products.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: now } : p
      )
    );
  };

  const deleteProduct = (id: string) => {
    saveProducts(products.filter((p) => p.id !== id));
  };

  return { products, addProduct, updateProduct, deleteProduct, isLoaded };
}
