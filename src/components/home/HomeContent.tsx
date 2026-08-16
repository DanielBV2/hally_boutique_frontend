"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WaveDivider } from "@/components/home/WaveDivider";
import { FeaturedProductCard } from "@/components/home/FeaturedProductCard";
import { useProducts } from "@/hooks/useProducts";

export function HomeContent() {
  const {
    data: products,
    isLoading: productsLoading,
  } = useProducts({ limit: 8, sortBy: "createdAt", sortOrder: "desc" });

  const showProducts =
    !productsLoading && products && products.items.length > 0;

  return (
    <main className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-accent">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center px-4 pb-24 pt-16 lg:pb-28">
          <div className="relative z-10 flex max-w-xl flex-col gap-6">
            <h1 className="text-5xl font-extrabold tracking-tight text-primary-foreground sm:text-6xl lg:text-7xl">
              Verano sin límites
            </h1>
            <p className="text-lg text-primary-foreground/90 md:text-xl">
              Moda de baño con estilo tropical, pensada para brillar en cada
              ola.
            </p>
            <div className="mt-2">
              <Button
                variant="secondary"
                asChild
                className="h-12 px-8 text-base"
              >
                <Link href="/productos">Ver colección</Link>
              </Button>
            </div>
          </div>
        </div>

        <WaveDivider className="relative z-10 text-background" />
      </section>

      {showProducts && (
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-semibold">
              Descubre lo nuevo
            </h2>
            <Link
              href="/productos"
              className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
            >
              Ver todo →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.items.map((product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {productsLoading && (
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Skeleton className="mb-8 h-8 w-64" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-xl" />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
