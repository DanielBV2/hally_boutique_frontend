"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ApiError } from "@/lib/api/client";
import { resetPassword } from "@/lib/api/auth";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth";

const INVALID_LINK_MESSAGE =
  "Este enlace no es válido o ha expirado. Solicita uno nuevo.";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token ?? "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function handleSubmit(values: ResetPasswordFormValues) {
    setSubmitting(true);
    setError(null);
    try {
      await resetPassword(token ?? values.token, values.newPassword);
      toast.success("Contraseña actualizada");
      router.push("/login");
    } catch (error) {
      if (error instanceof ApiError && error.isRateLimited()) {
        setError(error.message);
      } else {
        setError(INVALID_LINK_MESSAGE);
      }
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <AuthCard
        title="Enlace no válido"
        description="Este enlace no es válido o ha expirado."
      >
        <Button type="button" asChild>
          <Link href="/olvide-password">Solicitar un nuevo enlace</Link>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Restablecer contraseña"
      description="Crea una nueva contraseña para tu cuenta."
      footer={
        <>
          ¿El enlace expiró?{" "}
          <Link
            href="/olvide-password"
            className="font-medium text-primary hover:underline"
          >
            Solicita uno nuevo
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <input type="hidden" {...form.register("token")} />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nueva contraseña</FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete="new-password"
                    autoFocus
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar contraseña</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Actualizando…" : "Actualizar contraseña"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
