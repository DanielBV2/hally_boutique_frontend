import Link from "next/link";
import Image from "next/image";

import { QuickAddPopover } from "@/components/products/QuickAddPopover";
import { Badge } from "@/components/ui/badge";
import { formatCOP } from "@/lib/format";
import type { ProductListItem } from "@/types/product";

export function FeaturedProductCard({
  product,
}: {
  product: ProductListItem;
}) {
  const primaryImage = product.images?.[0]?.url ?? product.thumbnailUrl;
  const secondaryImage = product.images?.[1]?.url;
  const isSoldOut = !product.hasStock;

  return (
    <div className="group relative block h-full">
      <Link href={`/productos/${product.slug}`} className="block h-full">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
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
          {isSoldOut && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/40">
              <Badge className="bg-destructive text-destructive-foreground">
                Agotado
              </Badge>
            </div>
          )}
        </div>
        <div className="mt-2 flex flex-col gap-0.5">
          <h3 className="truncate font-medium text-foreground">
            {product.name}
          </h3>
          <p className="text-sm font-semibold text-foreground">
            {formatCOP(product.basePrice)}
          </p>
        </div>
      </Link>
      {!isSoldOut && (
        <div className="absolute right-2 top-2 z-20">
          <QuickAddPopover product={product} />
        </div>
      )}
    </div>
  );
}
