"use client";

import { useMutation } from "@tanstack/react-query";

import { useInvalidateSession } from "@/hooks/useSession";
import { updateProfile } from "@/lib/api/auth";

export function useUpdateProfileMutation() {
  const invalidateSession = useInvalidateSession();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await invalidateSession();
    },
  });
}
