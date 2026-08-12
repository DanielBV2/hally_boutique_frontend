"use client";

import { useMutation } from "@tanstack/react-query";

import { login } from "@/lib/api/auth";
import { useInvalidateSession } from "@/hooks/useSession";

export function useLoginMutation() {
  const invalidateSession = useInvalidateSession();

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await invalidateSession();
    },
  });
}
