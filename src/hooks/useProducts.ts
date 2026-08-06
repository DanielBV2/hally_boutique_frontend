"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";

export function useProducts(params?: {
  page?: number;
  categoryId?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
}
