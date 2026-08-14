"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  type GetProductsParams,
} from "@/lib/api/products";

export function useProducts(params?: GetProductsParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
}
