import { apiFetch } from "@/lib/api/client";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<{ user: AuthUser }> {
  return apiFetch<{ user: AuthUser }>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function register(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{ user: AuthUser }> {
  return apiFetch<{ user: AuthUser }>("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function forgotPassword(email: string): Promise<null> {
  return apiFetch<null>("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<null> {
  return apiFetch<null>("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
}

export async function logout(): Promise<null> {
  return apiFetch<null>("/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
}
