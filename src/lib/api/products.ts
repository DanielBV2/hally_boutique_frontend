import type { ProductListItem, ProductDetail } from "@/types/product";
import { ApiError } from "@/lib/api/errors";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { code?: string; message: string };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) {
    throw new ApiError(
      json.error?.message ?? "Error en la petición",
      res.status,
      json.error?.code,
    );
  }
  return json.data;
}

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
  const res = await fetch(`/api/products${query ? `?${query}` : ""}`);
  return handleResponse(res);
}

export async function getProductBySlug(slug: string): Promise<ProductDetail> {
  const res = await fetch(`/api/products/${slug}`);
  return handleResponse(res);
}
