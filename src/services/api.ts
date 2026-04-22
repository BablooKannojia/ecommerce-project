import type { Category, Product } from "../types";

const BASE_URL = "https://api.escuelajs.co/api/v1";

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error("Failed");
    return res.json();
  } catch {
    return [];
  }
};

export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) throw new Error("Failed");
    return res.json();
  } catch {
    return [];
  }
};

export const fetchProductsByCategory = async (
  categoryId: number
): Promise<Product[]> => {
  try {
    const res = await fetch(`${BASE_URL}/products?categoryId=${categoryId}`);
    if (!res.ok) throw new Error("Failed");
    return res.json();
  } catch {
    return [];
  }
};

export const fetchProductById = async (
  id: string
): Promise<Product | null> => {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error("Failed");
    return res.json();
  } catch {
    return null;
  }
};
