"use client";

import { useMutation } from "@tanstack/react-query";

import { register } from "@/lib/api/auth";
import { useInvalidateSession } from "@/hooks/useSession";

export function useRegisterMutation() {
  const invalidateSession = useInvalidateSession();

  return useMutation({
    mutationFn: register,
    onSuccess: async () => {
      await invalidateSession();
    },
  });
}
