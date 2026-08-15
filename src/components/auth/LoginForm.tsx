"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

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
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/hooks/useLogin";
import { ApiError } from "@/lib/api/client";
import { getSafeRedirect } from "@/lib/auth/safeRedirect";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const serverError = loginMutation.error
    ? loginMutation.error instanceof ApiError
      ? loginMutation.error.message
      : "Ocurrió un error inesperado. Inténtalo de nuevo."
    : null;

  function handleSubmit(values: LoginFormValues) {
    loginMutation.mutate(values, {
      onSuccess: () => {
        router.push(getSafeRedirect(searchParams.get("redirect")));
      },
    });
  }

  return (
    <AuthCard
      title="Iniciar sesión"
      description="Ingresa tu correo para acceder a tu cuenta."
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link
            href="/registro"
            className="font-medium text-primary hover:underline"
          >
            Regístrate
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="tucorreo@ejemplo.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Contraseña</FormLabel>
                  <Link
                    href="/olvide-password"
                    className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full"
          >
            {loginMutation.isPending ? "Ingresando…" : "Ingresar"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
