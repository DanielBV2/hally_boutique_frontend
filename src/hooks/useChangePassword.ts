"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { changePassword, logout } from "@/lib/api/auth";

export function useChangePasswordMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string }) =>
      changePassword(input),
    onSuccess: async () => {
      try {
        await logout();
      } catch {
        // el backend ya revocó todas las sesiones; el logout puede no encontrar token
      }
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Contraseña actualizada. Inicia sesión de nuevo.");
      router.push("/login");
    },
  });
}
