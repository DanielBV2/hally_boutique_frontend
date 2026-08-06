"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInvalidateSession } from "@/hooks/useSession";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invalidateSession = useInvalidateSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(
          json.error?.message ?? "No se pudo completar el registro. Inténtalo de nuevo."
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
        Crear cuenta
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            id="firstName"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

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
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Creando cuenta…" : "Crear cuenta"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="text-primary underline-offset-4 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
