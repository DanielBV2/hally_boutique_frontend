export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }

  isRateLimited(): boolean {
    return this.status === 429;
  }
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { code?: string; message: string };
}

export async function handleResponse<T>(res: Response): Promise<T> {
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

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  return handleResponse<T>(res);
}
