"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";

import { AuthCard } from "@/components/auth/AuthCard";
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
import { ApiError } from "@/lib/api/client";
import { forgotPassword } from "@/lib/api/auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function handleSubmit(values: ForgotPasswordFormValues) {
    setSubmitting(true);
    try {
      await forgotPassword(values.email);
      setSubmitted(true);
    } catch (error) {
      if (error instanceof TypeError) {
        toast.error("Ocurrió un error, intenta de nuevo");
      } else if (error instanceof ApiError && error.isRateLimited()) {
        toast.error(error.message);
      } else {
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <AuthCard
        title="Revisa tu correo"
        description="Si el correo está registrado, te enviaremos un enlace para restablecer tu contraseña."
      >
        <div className="flex flex-col gap-2">
          <Button type="button" asChild>
            <Link href="/login">Volver a iniciar sesión</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setSubmitted(false)}
          >
            Usar otro correo
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Restablecer contraseña"
      description="Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña."
      footer={
        <>
          ¿Recordaste tu contraseña?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Inicia sesión
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

          <Button type="submit" disabled={submitting}>
            {submitting ? "Enviando…" : "Enviar enlace"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
