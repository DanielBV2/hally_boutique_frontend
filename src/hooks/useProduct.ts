'use client';
import { useQuery } from '@tanstack/react-query';
import { getProductBySlug } from '@/lib/api/products';
import type { ProductDetail } from '@/types/product';

export function useProduct(
  slug: string,
  options?: { initialData?: ProductDetail },
) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
    initialData: options?.initialData,
  });
}
