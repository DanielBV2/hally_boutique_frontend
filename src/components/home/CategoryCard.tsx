import Link from "next/link";

import { Card } from "@/components/ui/card";
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
    <Link href={`/productos?categoryId=${category.id}`} className="block h-full">
      <Card
        className={cn(
          "flex aspect-square h-full items-center justify-center p-4 transition-shadow hover:shadow-lg",
          tones[index % tones.length],
        )}
      >
        <h3 className="text-center text-lg font-semibold text-foreground">
          {category.name}
        </h3>
      </Card>
    </Link>
  );
}
