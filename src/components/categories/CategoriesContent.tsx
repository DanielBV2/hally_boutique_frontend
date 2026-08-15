"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { useCategories } from "@/hooks/useCategories";

export function CategoriesContent() {
  const { data, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-12">
        <Skeleton className="mb-4 h-9 w-64" />
        <Skeleton className="mb-8 h-5 w-80" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-12">
        <h1 className="mb-4 text-3xl font-bold text-foreground">
          Compra por categoría
        </h1>
        <p className="text-muted-foreground">
          No hay categorías disponibles por ahora.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-col gap-1 lg:mb-10">
        <h1 className="text-3xl font-bold text-foreground">
          Compra por categoría
        </h1>
        <p className="text-sm text-muted-foreground lg:text-base">
          Explora nuestras colecciones de moda de baño.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </div>
    </section>
  );
}
