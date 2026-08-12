"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/hooks/useLogin";
import { ApiError } from "@/lib/api/client";
import { getSafeRedirect } from "@/lib/auth/safeRedirect";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const error = loginMutation.error
    ? loginMutation.error instanceof ApiError
      ? loginMutation.error.message
      : "Ocurrió un error inesperado. Inténtalo de nuevo."
    : null;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.push(getSafeRedirect(searchParams.get("redirect")));
        },
      },
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">
        Iniciar sesión
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Link
            href="/olvide-password"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Ingresando…" : "Ingresar"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link
          href="/registro"
          className="text-primary underline-offset-4 hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
