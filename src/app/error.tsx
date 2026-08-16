"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-24 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
          <TriangleAlert className="size-7 text-destructive" />
        </div>
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Error inesperado
        </p>
        <h1 className="text-3xl font-bold text-foreground">Algo salió mal</h1>
        <p className="max-w-md text-muted-foreground">
          Ocurrió un error inesperado al cargar esta página. Intenta de nuevo o
          vuelve al inicio.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" onClick={reset}>
            Intentar de nuevo
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
