import type { Category } from "@/types/category";
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

export async function getCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories");
  return handleResponse(res);
}
