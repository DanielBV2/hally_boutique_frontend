import { apiFetch } from "@/lib/api/client";
import type { PaginatedAdminUsers, User } from "@/types/user";

export async function login(input: {
  email: string;
  password: string;
}): Promise<{ user: User }> {
  return apiFetch<{ user: User }>("/api/auth/login", {
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
}): Promise<{ user: User }> {
  return apiFetch<{ user: User }>("/api/auth/register", {
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

export async function updateProfile(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}): Promise<User> {
  return apiFetch<User>("/api/auth/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export interface AdminUsersParams {
  page?: number;
  limit?: number;
  role?: "CUSTOMER" | "ADMIN";
}

export async function getAdminUsers(
  params: AdminUsersParams = {},
): Promise<PaginatedAdminUsers> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.role) query.set("role", params.role);
  const queryString = query.toString();
  return apiFetch<PaginatedAdminUsers>(
    `/api/admin/users${queryString ? `?${queryString}` : ""}`,
  );
}
