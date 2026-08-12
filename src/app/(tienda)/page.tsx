"use client";

import Link from "next/link";
import { RefreshCw, ShieldCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WaveDivider } from "@/components/home/WaveDivider";
import { FeaturedProductCard } from "@/components/home/FeaturedProductCard";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";

export default function Home() {
  const {
    data: categories,
    isLoading: categoriesLoading,
  } = useCategories();
  const {
    data: products,
    isLoading: productsLoading,
  } = useProducts({ limit: 8 });

  const showCategories =
    !categoriesLoading && categories && categories.length > 0;
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

      {showCategories && (
        <section className="mx-auto w-full max-w-6xl px-4 py-16">
          <h2 className="mb-8 text-2xl font-semibold text-foreground">
            Explora por categoría
          </h2>
          <div className="grid auto-rows-[140px] grid-cols-2 gap-4 sm:auto-rows-[180px] sm:grid-cols-3">
            {categories.map((category, i) => (
              <Link
                key={category.id}
                href={`/productos?categoryId=${category.id}`}
                className={cn(
                  "group relative flex items-end overflow-hidden rounded-2xl p-5 transition-transform hover:-translate-y-1",
                  i === 0 &&
                    categories.length >= 3 &&
                    "col-span-2 row-span-2 sm:col-span-1 sm:row-span-2",
                  ["bg-primary/15", "bg-accent/15", "bg-secondary/25", "bg-muted"][
                    i % 4
                  ],
                )}
              >
                <span className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {categoriesLoading && (
        <section className="mx-auto w-full max-w-6xl px-4 py-16">
          <Skeleton className="mb-8 h-8 w-64" />
          <div className="grid auto-rows-[140px] grid-cols-2 gap-4 sm:auto-rows-[180px] sm:grid-cols-3">
            <Skeleton className="col-span-2 row-span-2 rounded-2xl sm:col-span-1 sm:row-span-2" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="rounded-2xl" />
            ))}
          </div>
        </section>
      )}

      {showProducts && (
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-3xl font-semibold">
              Descubre lo nuevo
            </h2>
            <Link
              href="/productos"
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver todo →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.items.map((product, index) => (
              <FeaturedProductCard
                key={product.id}
                product={product}
                isNew={index < 3}
              />
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

      <section className="border-t border-border bg-muted/50">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 text-center sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="size-8 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Pago 100% seguro con Wompi
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Truck className="size-8 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Envíos a toda Colombia
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="size-8 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Cambios y devoluciones
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
