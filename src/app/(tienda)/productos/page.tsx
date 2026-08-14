import type { Metadata } from "next";
import { Suspense } from "react";

import { ProductsGrid } from "@/components/products/ProductsGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchExpress } from "@/lib/api/server";
import { pageSeo } from "@/lib/seo";
import type { Category } from "@/types/category";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    categoryId?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const search = params.search?.trim();
  const categoryId = params.categoryId;
  const isFiltered = !!search || !!params.sort || Number(params.page) > 1;

  if (search) {
    return pageSeo({
      title: `Resultados para "${search}" · Hally Boutique`,
      description: `Productos de Hally Boutique que coinciden con "${search}".`,
      path: "/productos",
      noindex: true,
    });
  }

  if (isFiltered) {
    return pageSeo({
      title: "Productos · Hally Boutique",
      description: "Explora el catálogo de moda de baño de Hally Boutique.",
      path: categoryId
        ? `/productos?categoryId=${categoryId}`
        : "/productos",
      noindex: true,
    });
  }

  if (categoryId) {
    const categories = await fetchExpress<Category[]>("/categories");
    const category = categories?.find((c) => c.id === categoryId);
    if (category) {
      return pageSeo({
        title: `${category.name} · Hally Boutique`,
        description: `Explora la categoría ${category.name} en Hally Boutique.`,
        path: `/productos?categoryId=${categoryId}`,
      });
    }
  }

  return pageSeo({
    title: "Productos · Hally Boutique",
    description: "Explora el catálogo de moda de baño de Hally Boutique.",
    path: "/productos",
  });
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
