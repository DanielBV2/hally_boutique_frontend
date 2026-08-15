"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, TriangleAlert } from "lucide-react";

import { VariantSelector } from "@/components/products/VariantSelector";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddToCartMutation } from "@/hooks/useCart";
import { useProduct } from "@/hooks/useProduct";
import { useSession } from "@/hooks/useSession";
import { formatCurrency } from "@/lib/format";
import type { ProductListItem, ProductVariant } from "@/types/product";

export function QuickAddPopover({ product }: { product: ProductListItem }) {
  const router = useRouter();
  const { isAuthenticated } = useSession();
  const addToCart = useAddToCartMutation();
  const [open, setOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { data: detail, isLoading, isError } = useProduct(product.slug, {
    enabled: open,
  });

  const variants = detail?.variants ?? [];
  const displayedPrice = selectedVariant
    ? selectedVariant.price
    : product.basePrice;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setSelectedVariant(null);
      setQuantity(1);
    }
  }

  function handleSelectVariant(variant: ProductVariant | null) {
    setSelectedVariant(variant);
    setQuantity(1);
  }

  function handleAdd() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/productos/${product.slug}`);
      return;
    }
    if (!selectedVariant) return;
    addToCart.mutate(
      { variantId: selectedVariant.id, quantity },
      { onSuccess: () => setOpen(false) },
    );
  }

  const increment = () =>
    setQuantity((prev) => Math.min(prev + 1, selectedVariant?.stock ?? 1));
  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Añadir ${product.name} al carrito`}
          className="shrink-0 rounded-full bg-background/90 backdrop-blur"
          disabled={!product.hasStock}
        >
          <ShoppingCart />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72">
        <PopoverHeader>
          <PopoverTitle className="line-clamp-1 pr-6">
            {product.name}
          </PopoverTitle>
          <PopoverDescription>
            {formatCurrency(displayedPrice, product.currency)}
          </PopoverDescription>
        </PopoverHeader>

        {isLoading ? (
          <div className="flex flex-col gap-2 py-1">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : isError || !detail ? (
          <div className="flex flex-col items-center gap-2 py-3 text-center">
            <TriangleAlert className="size-5 text-destructive" />
            <p className="text-xs text-muted-foreground">
              No pudimos cargar las opciones de este producto.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cerrar
            </Button>
          </div>
        ) : variants.length === 0 ? (
          <p className="py-3 text-center text-xs text-muted-foreground">
            Este producto no tiene opciones disponibles.
          </p>
        ) : (
          <>
            <VariantSelector
              variants={variants}
              onSelect={handleSelectVariant}
            />

            <div className="mt-1 flex items-center gap-2 border-t border-border pt-2.5">
              <div className="flex shrink-0 items-center rounded-lg border border-border">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Disminuir cantidad"
                  className="h-8 w-8 rounded-lg hover:bg-muted"
                  disabled={quantity <= 1 || !selectedVariant?.inStock}
                  onClick={decrement}
                >
                  <Minus />
                </Button>
                <span className="w-8 text-center text-sm tabular-nums">
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Aumentar cantidad"
                  className="h-8 w-8 rounded-lg hover:bg-muted"
                  disabled={
                    !selectedVariant?.inStock ||
                    quantity >= (selectedVariant?.stock ?? 1)
                  }
                  onClick={increment}
                >
                  <Plus />
                </Button>
              </div>

              <Button
                type="button"
                size="sm"
                className="flex-1"
                disabled={
                  !selectedVariant ||
                  !selectedVariant.inStock ||
                  addToCart.isPending
                }
                onClick={handleAdd}
              >
                {addToCart.isPending
                  ? "Añadiendo…"
                  : !selectedVariant
                    ? "Elige talla y color"
                    : selectedVariant.inStock
                      ? "Añadir al carrito"
                      : "Sin stock"}
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
