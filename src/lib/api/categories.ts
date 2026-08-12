import { apiFetch } from "@/lib/api/client";
import type { Category } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/api/categories");
}
