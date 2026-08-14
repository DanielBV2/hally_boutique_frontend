'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';

import { VariantSelector } from '@/components/products/VariantSelector';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProduct } from '@/hooks/useProduct';
import { useSession } from '@/hooks/useSession';
import { useAddToCartMutation } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { ProductDetail as ProductDetailType, ProductVariant } from '@/types/product';

export function ProductDetail({
  slug,
  initialProduct,
}: {
  slug: string;
  initialProduct?: ProductDetailType;
}) {
  const router = useRouter();
  const {
    data: product,
    isLoading,
    isError,
  } = useProduct(slug, { initialData: initialProduct });
  const { isAuthenticated } = useSession();
  const addToCart = useAddToCartMutation();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Producto no encontrado.
      </div>
    );
  }

  const images = product.images;
  const hasMultipleImages = images.length > 1;
  const currentImage = images[selectedImageIndex]?.url;

  const displayedPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const showOriginalPrice =
    !!selectedVariant && selectedVariant.price !== product.basePrice;

  const handleSelectVariant = (variant: ProductVariant | null) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const incrementQuantity = () =>
    setQuantity((prev) => Math.min(prev + 1, selectedVariant?.stock ?? 1));
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const nextImage = () =>
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/productos/${slug}`);
      return;
    }
    if (!selectedVariant) return;
    addToCart.mutate({ variantId: selectedVariant.id, quantity });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Imágenes */}
        <div className="flex gap-2">
          {hasMultipleImages && (
            <div className="flex w-28 flex-col gap-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                  aria-pressed={selectedImageIndex === index}
                  className={cn(
                    'aspect-square overflow-hidden rounded-lg border-2 bg-muted transition-colors',
                    selectedImageIndex === index
                      ? 'border-primary'
                      : 'border-transparent',
                  )}
                >
                  <Image
                    src={image.url}
                    alt={image.altText ?? product.name}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="relative aspect-[3/4] flex-1 overflow-hidden rounded-lg bg-muted">
            {currentImage ? (
              <Image
                src={currentImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Sin imagen
              </div>
            )}

            {hasMultipleImages && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Imagen anterior"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Siguiente imagen"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Información */}
        <div className="space-y-6">
          <div>
            <Link
              href={`/productos?categoryId=${product.category.id}`}
              className="mb-2 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {product.category.name}
            </Link>
            <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
            <p className="mt-2 text-muted-foreground">{product.description}</p>
          </div>

          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(displayedPrice, product.currency)}
            </p>
            {showOriginalPrice && (
              <p className="text-2xl font-medium text-muted-foreground line-through">
                {formatCurrency(product.basePrice, product.currency)}
              </p>
            )}
          </div>

          <div>
            <VariantSelector variants={product.variants} onSelect={handleSelectVariant} />
            <div className="mt-3">
              {selectedVariant ? (
                selectedVariant.inStock ? (
                  <p className="text-sm text-muted-foreground">
                    {selectedVariant.stock === 1
                      ? '¡Última unidad disponible!'
                      : `${selectedVariant.stock} disponibles`}
                  </p>
                ) : (
                  <p className="text-sm font-medium text-destructive">
                    Sin stock en esta combinación
                  </p>
                )
              ) : (
                <p className="text-sm text-muted-foreground">
                  Selecciona talla y color para continuar
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-border">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Disminuir cantidad"
                className="h-10 w-10 rounded-lg hover:bg-muted"
                disabled={quantity <= 1 || !selectedVariant?.inStock}
                onClick={decrementQuantity}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium text-foreground">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Aumentar cantidad"
                className="h-10 w-10 rounded-lg hover:bg-muted"
                disabled={
                  !selectedVariant?.inStock || quantity >= (selectedVariant?.stock ?? 1)
                }
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              size="lg"
              className="flex-1"
              disabled={!selectedVariant || !selectedVariant.inStock || addToCart.isPending}
              onClick={handleAddToCart}
            >
              {addToCart.isPending
                ? 'Añadiendo…'
                : !selectedVariant
                  ? 'Selecciona talla y color'
                  : selectedVariant.inStock
                    ? 'Añadir al carrito'
                    : 'Sin stock disponible'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
