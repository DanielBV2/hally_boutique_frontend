import { apiFetch } from "@/lib/api/client";
import type {
  AdminVariant,
  PaginatedProducts,
  ProductDetail,
  ProductInput,
  ProductListItem,
  VariantInput,
} from "@/types/product";

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

export interface AdminProductsParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  categoryId?: string;
}

export async function getAdminProducts(
  params: AdminProductsParams = {},
): Promise<PaginatedProducts> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.isActive !== undefined)
    query.set("isActive", String(params.isActive));
  if (params.categoryId !== undefined)
    query.set("categoryId", params.categoryId);
  const queryString = query.toString();
  return apiFetch<PaginatedProducts>(
    `/api/admin/products${queryString ? `?${queryString}` : ""}`,
  );
}

export async function createProduct(input: ProductInput): Promise<ProductDetail> {
  return apiFetch<ProductDetail>("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>,
): Promise<ProductDetail> {
  return apiFetch<ProductDetail>(`/api/admin/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await apiFetch<void>(`/api/admin/products/${id}`, { method: "DELETE" });
}

export async function addProductImage(
  id: string,
  input: { url: string; altText?: string; position?: number },
): Promise<void> {
  await apiFetch<void>(`/api/admin/products/${id}/images`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function removeProductImage(
  id: string,
  imageId: string,
): Promise<void> {
  await apiFetch<void>(`/api/admin/products/${id}/images/${imageId}`, {
    method: "DELETE",
  });
}

export async function getAdminVariants(id: string): Promise<AdminVariant[]> {
  return apiFetch<AdminVariant[]>(`/api/admin/products/${id}/variants`);
}

export async function createVariant(
  id: string,
  input: VariantInput,
): Promise<AdminVariant> {
  return apiFetch<AdminVariant>(`/api/admin/products/${id}/variants`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateVariant(
  id: string,
  variantId: string,
  input: Partial<VariantInput & { isActive: boolean }>,
): Promise<AdminVariant> {
  return apiFetch<AdminVariant>(
    `/api/admin/products/${id}/variants/${variantId}`,
    { method: "PATCH", body: JSON.stringify(input) },
  );
}

export async function deleteVariant(
  id: string,
  variantId: string,
): Promise<void> {
  await apiFetch<void>(`/api/admin/products/${id}/variants/${variantId}`, {
    method: "DELETE",
  });
}
