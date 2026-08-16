import Link from "next/link";
import { SearchX } from "lucide-react";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-24 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
          <SearchX className="size-7 text-primary" />
        </div>
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Error 404
        </p>
        <h1 className="text-3xl font-bold text-foreground">
          Página no encontrada
        </h1>
        <p className="max-w-md text-muted-foreground">
          La página que buscas no existe o fue movida a otra dirección.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/">Volver al inicio</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/productos">Ver productos</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
