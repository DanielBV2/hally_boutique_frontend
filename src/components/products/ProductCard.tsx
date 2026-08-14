import Link from "next/link";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCOP } from "@/lib/format";
import type { ProductListItem } from "@/types/product";

export function ProductCard({ product }: { product: ProductListItem }) {
  const primaryImage = product.thumbnailUrl;
  const secondaryImage = product.secondaryImageUrl;

  return (
    <Card className="h-full w-full overflow-hidden p-0 transition-shadow hover:shadow-lg">
      <CardContent className="p-4">
        <Link
          href={`/productos/${product.slug}`}
          className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-muted">
            {primaryImage && (
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-opacity duration-300"
              />
            )}
            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="absolute inset-0 object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            )}
          </div>

          <div className="mb-4">
            <p className="mb-1 text-xs text-muted-foreground">
              {product.categoryName}
            </p>
            <CardTitle className="text-lg leading-tight">
              {product.name}
            </CardTitle>
          </div>
        </Link>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xl font-bold text-foreground">
            {formatCOP(product.basePrice)}
          </p>
          <Button asChild size="sm">
            <Link href={`/productos/${product.slug}`}>Ver detalle</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
