"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";

export function CategoriesFlyout() {
  const pathname = usePathname();
  const { data: categories, isLoading } = useCategories();

  const isActive = pathname.startsWith("/categorias");
  const activeProps = {
    className: isActive ? "text-primary hover:text-primary" : undefined,
    "aria-current": isActive ? ("page" as const) : undefined,
  };

  if (!isLoading && (!categories || categories.length === 0)) {
    return (
      <Button variant="ghost" asChild {...activeProps}>
        <Link href="/categorias">Categorías</Link>
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" {...activeProps}>
          Categorías
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-2">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col p-1">
            <ul className="flex flex-col">
              {(categories ?? []).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/productos?categoryId=${category.id}`}
                    className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Separator className="my-2" />
            <Link
              href="/categorias"
              className="rounded-md px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Ver todas las categorías
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
