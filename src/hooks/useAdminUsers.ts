"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getAdminUsers,
  type AdminUsersParams,
} from "@/lib/api/auth";

export function useAdminUsers(params: AdminUsersParams = {}) {
  return useQuery({
    queryKey: ["admin", "users", params.page, params.limit, params.role],
    queryFn: () => getAdminUsers(params),
  });
}
