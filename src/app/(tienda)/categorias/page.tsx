"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { CategoryCard } from "@/components/home/CategoryCard";
import { useCategories } from "@/hooks/useCategories";

export default function CategoriesPage() {
  const { data, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <h1 className="mb-8 text-2xl font-semibold text-foreground">
          Categorías
        </h1>
        <p className="text-center text-muted-foreground">
          No hay categorías disponibles por ahora.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold text-foreground">
        Categorías
      </h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {data.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </div>
    </div>
  );
}
