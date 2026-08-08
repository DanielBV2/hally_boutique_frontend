"use client";

import Link from "next/link";
import { RefreshCw, ShieldCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryCard } from "@/components/home/CategoryCard";
import { ProductCard } from "@/components/products/ProductCard";
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
  } = useProducts({ limit: 6 });

  const showCategories =
    !categoriesLoading && categories && categories.length > 0;
  const showProducts =
    !productsLoading && products && products.items.length > 0;

  return (
    <main className="flex flex-col">
      <section className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-primary to-accent px-4 py-16 text-center">
        <div className="flex max-w-2xl flex-col items-center gap-6">
          <h1 className="text-4xl font-semibold text-primary-foreground md:text-6xl">
            Hally Boutique
          </h1>
          <p className="text-lg text-primary-foreground/90 md:text-xl">
            Moda de baño con estilo tropical, pensada para brillar en cada
            ola.
          </p>
          <Button variant="secondary" asChild className="h-12 px-8 text-base">
            <Link href="/productos">Ver colección</Link>
          </Button>
        </div>
      </section>

      {showCategories && (
        <section className="mx-auto w-full max-w-6xl px-4 py-16">
          <h2 className="mb-8 text-2xl font-semibold text-foreground">
            Explora por categoría
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </section>
      )}

      {categoriesLoading && (
        <section className="mx-auto w-full max-w-6xl px-4 py-16">
          <Skeleton className="mb-8 h-8 w-64" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-xl" />
            ))}
          </div>
        </section>
      )}

      {showProducts && (
        <section className="mx-auto w-full max-w-6xl px-4 pb-16">
          <h2 className="mb-8 text-2xl font-semibold text-foreground">
            Descubre lo nuevo
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {products.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/productos">Ver todo</Link>
            </Button>
          </div>
        </section>
      )}

      {productsLoading && (
        <section className="mx-auto w-full max-w-6xl px-4 pb-16">
          <Skeleton className="mb-8 h-8 w-64" />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-lg" />
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
