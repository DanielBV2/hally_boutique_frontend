"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background px-4 text-center text-foreground">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Error inesperado
        </p>
        <h1 className="text-3xl font-bold">Algo salió mal</h1>
        <p className="max-w-md text-muted-foreground">
          Ocurrió un error inesperado al cargar la aplicación. Recarga la página
          para intentarlo de nuevo.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Recargar página
        </button>
      </body>
    </html>
  );
}