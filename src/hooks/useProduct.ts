'use client';
import { useQuery } from '@tanstack/react-query';
import { getProductBySlug } from '@/lib/api/products';

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
}
