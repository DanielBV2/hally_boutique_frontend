"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

function ProductsGrid() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const { data, isLoading, isError } = useProducts({ categoryId, search });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6 p-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No se pudieron cargar los productos. Intenta de nuevo más tarde.
      </div>
    );
  }

  if (data.items.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No hay productos disponibles todavía.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 p-6 md:grid-cols-3 lg:grid-cols-4">
      {data.items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-2 gap-6 p-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-lg" />
          ))}
        </div>
      }
    >
      <ProductsGrid />
    </Suspense>
  );
}
