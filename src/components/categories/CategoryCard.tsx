import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

const tones = [
  "bg-primary/10",
  "bg-secondary/10",
  "bg-accent/10",
  "bg-muted/60",
];

export function CategoryCard({
  category,
  index,
}: {
  category: Category;
  index: number;
}) {
  return (
    <Link
      href={`/productos?categoryId=${category.id}`}
      className={cn(
        "group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl p-6 transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        tones[index % tones.length],
      )}
    >
      <h3 className="font-display text-2xl font-semibold text-foreground">
        {category.name}
      </h3>
      {category.description && (
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {category.description}
        </p>
      )}
      <span className="absolute bottom-6 right-6 flex size-8 translate-y-4 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
