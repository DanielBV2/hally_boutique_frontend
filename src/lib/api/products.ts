import type { ProductListItem, ProductDetail } from "@/types/product";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { message: string };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) {
    throw new Error(json.error?.message ?? "Error en la petición");
  }
  return json.data;
}

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}): Promise<{ items: ProductListItem[]; total: number; page: number }> {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const res = await fetch(`/api/products${query ? `?${query}` : ""}`);
  return handleResponse(res);
}

export async function getProductBySlug(slug: string): Promise<ProductDetail> {
  const res = await fetch(`/api/products/${slug}`);
  return handleResponse(res);
}
