"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useProducts } from "@/hooks/useProducts";
import type {
  ProductSortBy,
  ProductSortOrder,
} from "@/lib/api/products";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Pagination } from "@/components/shared/Pagination";
import { StoreBreadcrumbs } from "@/components/shared/StoreBreadcrumbs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";
import { scrollToResults } from "@/lib/scroll";

const PAGE_SIZE = 12;

function parseSort(
  sort: string,
): { sortBy: ProductSortBy; sortOrder: ProductSortOrder } {
  const [by, order] = sort.split("-");
  const sortBy: ProductSortBy =
    by === "basePrice" || by === "name" ? by : "createdAt";
  const sortOrder: ProductSortOrder = order === "asc" ? "asc" : "desc";
  return { sortBy, sortOrder };
}

export function ProductsGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const { sortBy, sortOrder } = parseSort(
    searchParams.get("sort") ?? "createdAt-desc",
  );

  const { data, isLoading, isError } = useProducts({
    page,
    limit: PAGE_SIZE,
    categoryId,
    search,
    sortBy,
    sortOrder,
  });
  const { data: categories } = useCategories();
  const category = categories?.find((c) => c.id === categoryId);

  const hasFilters = !!(categoryId || search);

  const crumbs = [
    { label: "Inicio", href: "/" },
    { label: "Productos", href: search ? undefined : "/productos" },
    ...(category ? [{ label: category.name }] : []),
  ];

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`/productos?${params.toString()}`);
    scrollToResults();
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <StoreBreadcrumbs items={crumbs} />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <StoreBreadcrumbs items={crumbs} />
        <div className="p-6 text-center text-muted-foreground">
          No se pudieron cargar los productos. Intenta de nuevo más tarde.
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));

  if (data.items.length === 0) {
    return (
      <div
        id="resultados"
        tabIndex={-1}
        className="flex scroll-mt-24 flex-col gap-6 p-6 outline-none"
      >
        <StoreBreadcrumbs items={crumbs} />
        <ProductFilters total={data.total} />
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 p-10 text-center">
          <p className="text-muted-foreground">
            {hasFilters
              ? "No encontramos productos para esta búsqueda."
              : "No hay productos disponibles todavía."}
          </p>
          {hasFilters && (
            <Button
              type="button"
              onClick={() => {
                router.push("/productos");
                scrollToResults();
              }}
            >
              Ver todos los productos
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      id="resultados"
      tabIndex={-1}
      className="flex scroll-mt-24 flex-col gap-6 p-6 outline-none"
    >
      <StoreBreadcrumbs items={crumbs} />
      <ProductFilters total={data.total} />
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {data.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          page={data.page}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}
