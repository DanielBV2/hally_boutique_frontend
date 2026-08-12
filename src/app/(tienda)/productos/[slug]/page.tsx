'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useProduct } from '@/hooks/useProduct';
import { useSession } from '@/hooks/useSession';
import { useAddToCartMutation } from '@/hooks/useCart';
import { VariantSelector } from '@/components/products/VariantSelector';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';
import type { ProductVariant } from '@/types/product';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: product, isLoading, isError } = useProduct(slug);
  const { isAuthenticated } = useSession();
  const addToCart = useAddToCartMutation();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <Skeleton className="h-96 w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
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

  const formattedPrice = formatCurrency(
    selectedVariant ? selectedVariant.price : product.basePrice,
    product.currency,
  );

  const currentImage = product.images[selectedImageIndex]?.url;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/productos/${slug}`);
      return;
    }
    if (!selectedVariant) return;
    addToCart.mutate({ variantId: selectedVariant.id, quantity: 1 });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <div>
        <div className="relative h-96 w-full rounded-lg overflow-hidden bg-muted">
          {currentImage ? (
            <Image src={currentImage} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              Sin imagen
            </div>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 mt-3">
            {product.images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelectedImageIndex(i)}
                className={`h-16 w-16 rounded-md overflow-hidden border-2 ${i === selectedImageIndex ? 'border-primary' : 'border-transparent'}`}
              >
                <Image src={img.url} alt={img.altText || product.name} width={64} height={64} className="object-cover h-full w-full" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-muted-foreground">{product.category.name}</p>
        <h1 className="text-2xl font-semibold text-foreground mt-1">{product.name}</h1>
        <p className="text-xl font-medium text-primary mt-2">{formattedPrice}</p>
        <p className="text-foreground/80 mt-4">{product.description}</p>

        <div className="mt-6">
          <VariantSelector variants={product.variants} onSelect={setSelectedVariant} />
        </div>

        <Button
          className="mt-6 w-full"
          disabled={!selectedVariant || !selectedVariant.inStock || addToCart.isPending}
          onClick={handleAddToCart}
        >
          {addToCart.isPending
            ? 'Añadiendo…'
            : selectedVariant?.inStock
              ? 'Añadir al carrito'
              : 'Selecciona talla y color'}
        </Button>
      </div>
    </div>
  );
}
