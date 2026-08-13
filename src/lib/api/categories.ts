import { apiFetch } from "@/lib/api/client";
import type {
  Category,
  CategoryInput,
  PaginatedCategories,
} from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/api/categories");
}

export interface AdminCategoriesParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export async function getAdminCategories(
  params: AdminCategoriesParams = {},
): Promise<PaginatedCategories> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.isActive !== undefined)
    query.set("isActive", String(params.isActive));
  const queryString = query.toString();
  return apiFetch<PaginatedCategories>(
    `/api/admin/categories${queryString ? `?${queryString}` : ""}`,
  );
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  return apiFetch<Category>("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
): Promise<Category> {
  return apiFetch<Category>(`/api/admin/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await apiFetch<void>(`/api/admin/categories/${id}`, { method: "DELETE" });
}
