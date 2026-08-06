"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInvalidateSession } from "@/hooks/useSession";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invalidateSession = useInvalidateSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(
          json.error?.message ?? "No se pudo iniciar sesión. Inténtalo de nuevo."
        );
        return;
      }

      await invalidateSession();

      const redirect = searchParams.get("redirect");
      const safeRedirect =
        redirect && redirect.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : "/";
      router.push(safeRedirect);
    } catch {
      setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Ingresando…" : "Ingresar"}
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
