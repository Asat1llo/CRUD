"use client";

import { useCallback, useMemo } from "react";
import { nanoid } from "nanoid";
import { useLocalStorage } from "./useLocalStorage";
import { Product } from "@/types";

const PRODUCTS_KEY = "product-app-products-v2";

export function useProducts() {
  const [products, setProducts] = useLocalStorage<Product[]>(PRODUCTS_KEY, []);

  const addProduct = useCallback((data: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...data,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    };
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  }, [setProducts]);

  const updateProduct = useCallback((id: string, data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) => {
    const now = new Date().toISOString();
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: now } : p
      )
    );
  }, [setProducts]);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, [setProducts]);

  return useMemo(() => ({
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  }), [products, addProduct, updateProduct, deleteProduct]);
}
