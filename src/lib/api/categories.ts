import type { Category } from "@/types/category";

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

export async function getCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories");
  return handleResponse(res);
}
