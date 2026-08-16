"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { scrollToResults } from "@/lib/scroll";
import { cn } from "@/lib/utils";

export const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Más recientes" },
  { value: "basePrice-asc", label: "Precio: menor a mayor" },
  { value: "basePrice-desc", label: "Precio: mayor a menor" },
  { value: "name-asc", label: "Nombre: A-Z" },
  { value: "name-desc", label: "Nombre: Z-A" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function ProductFilters({ total }: { total: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");
  const sort = (searchParams.get("sort") as SortValue | null) ?? "createdAt-desc";

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    params.delete("page");
    const query = params.toString();
    router.push(`/productos${query ? `?${query}` : ""}`);
    scrollToResults();
  }

  const chipClass = (active: boolean) =>
    cn(
      "shrink-0 cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-background text-foreground hover:bg-muted",
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categoriesLoading && !categories
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-full" />
            ))
          : [
              <button
                key="all"
                type="button"
                className={chipClass(!categoryId)}
                onClick={() => updateParams({ categoryId: null })}
              >
                Todas
              </button>,
              ...(categories ?? []).map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={chipClass(categoryId === category.id)}
                  onClick={() => updateParams({ categoryId: category.id })}
                >
                  {category.name}
                </button>
              )),
            ]}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {search ? (
            <>
              <span className="font-medium text-foreground">
                {total}
              </span>{" "}
              {total === 1 ? "resultado para" : "resultados para"}{" "}
              &quot;{search}&quot;
              <button
                type="button"
                className="ml-2 text-primary underline-offset-4 hover:underline"
                onClick={() => updateParams({ search: null })}
              >
                Limpiar búsqueda
              </button>
            </>
          ) : (
            <>
              <span className="font-medium text-foreground">{total}</span>{" "}
              {total === 1 ? "producto" : "productos"}
            </>
          )}
        </p>

        <Select
          value={sort}
          onValueChange={(value) =>
            updateParams({ sort: value === "createdAt-desc" ? null : value })
          }
        >
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
