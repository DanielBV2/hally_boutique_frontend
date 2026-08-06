import Link from "next/link";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import type { ProductListItem } from "@/types/product";

const priceFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Link href={`/productos/${product.slug}`} className="block h-full">
      <Card className="group h-full overflow-hidden bg-card p-0 transition-shadow hover:shadow-lg">
        {product.thumbnailUrl ? (
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={product.thumbnailUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-square w-full bg-muted" />
        )}
        <CardContent className="flex flex-col gap-1 pt-4">
          <p className="text-xs text-muted-foreground">{product.categoryName}</p>
          <h3 className="font-medium text-foreground">{product.name}</h3>
          <p className="text-sm font-semibold text-foreground">
            {priceFormatter.format(product.basePrice)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
