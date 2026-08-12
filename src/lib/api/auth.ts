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

export async function forgotPassword(email: string): Promise<null> {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse<null>(res);
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<null> {
  const res = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
  return handleResponse<null>(res);
}

export async function logout(): Promise<null> {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<null>(res);
}
