export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export type ProductWithCategory = Product & {
  categoryName?: string;
};
