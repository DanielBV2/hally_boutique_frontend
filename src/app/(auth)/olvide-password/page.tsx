"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import Link from "next/link";

export default function ForgotPasswordPage() {
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
      <div className="mx-auto w-full max-w-sm px-4 py-16">
        <h1 className="mb-6 text-2xl font-semibold text-foreground">
          Restablecer contraseña
        </h1>

        <p className="text-sm text-muted-foreground">
          Si el correo está registrado, te enviaremos un enlace para
          restablecer tu contraseña.
        </p>

        <div className="mt-6 flex flex-col gap-2 text-sm">
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="w-fit text-primary underline-offset-4 hover:underline"
          >
            Volver a intentar
          </button>
          <Link
            href="/login"
            className="w-fit text-primary underline-offset-4 hover:underline"
          >
            Volver a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">
        Restablecer contraseña
      </h1>

      <p className="mb-6 text-sm text-muted-foreground">
        Ingresa tu correo y te enviaremos un enlace para restablecer tu
        contraseña.
      </p>

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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
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

      <p className="mt-6 text-sm text-muted-foreground">
        ¿Recordaste tu contraseña?{" "}
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
