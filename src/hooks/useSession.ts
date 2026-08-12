"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api/client";
import type { User } from "@/types/user";

async function fetchSession(): Promise<User | null> {
  return apiFetch<User | null>("/api/auth/me");
}

export function useSession() {
  const { data, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 1000 * 60 * 5,
  });
  return { user: data ?? null, isLoading, isAuthenticated: !!data };
}

export function useInvalidateSession() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["session"] });
}
