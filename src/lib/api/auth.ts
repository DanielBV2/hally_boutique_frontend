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
