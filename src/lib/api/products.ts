import { apiFetch } from "@/lib/api/client";
import type { ProductListItem, ProductDetail } from "@/types/product";

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}): Promise<{ items: ProductListItem[]; total: number; page: number }> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params?.search) searchParams.set("search", params.search);
  const query = searchParams.toString();
  return apiFetch(`/api/products${query ? `?${query}` : ""}`);
}

export async function getProductBySlug(slug: string): Promise<ProductDetail> {
  return apiFetch(`/api/products/${slug}`);
}
