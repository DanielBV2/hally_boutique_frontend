"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

async function fetchSession(): Promise<SessionUser | null> {
  const res = await fetch("/api/auth/me");
  const json = await res.json();
  return json.data;
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
