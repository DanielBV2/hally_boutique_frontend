import { apiClient } from "./client";
import type { ProductListItem, ProductDetail } from "@/types/product";

export function getProducts(params?: {
  page?: number;
  categoryId?: string;
  search?: string;
}) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return apiClient<{ items: ProductListItem[]; total: number; page: number }>(
    `/products${query ? `?${query}` : ""}`,
  );
}

export function getProductBySlug(slug: string) {
  return apiClient<ProductDetail>(`/products/${slug}`);
}
