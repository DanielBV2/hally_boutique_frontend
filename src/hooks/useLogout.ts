"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { logout } from "@/lib/api/auth";

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.push("/");
    },
    onError: () => {
      toast.error("No se pudo cerrar la sesión. Inténtalo de nuevo.");
    },
  });
}
