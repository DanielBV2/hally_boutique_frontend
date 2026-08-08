"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getMyOrders, getOrder } from "@/lib/api/orders";
import type { Order } from "@/types/order";

export function useMyOrders(page: number, limit = 20) {
  return useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () => getMyOrders({ page, limit }),
  });
}

type OrderQueryKey = readonly ["order", string | null];

export function useOrder(
  orderId: string | null,
  options?: Omit<
    UseQueryOptions<Order, Error, Order, OrderQueryKey>,
    "queryKey" | "queryFn" | "enabled"
  >,
) {
  return useQuery<Order, Error, Order, OrderQueryKey>({
    queryKey: ["order", orderId] as const,
    queryFn: () => getOrder(orderId as string),
    enabled: !!orderId,
    ...options,
  });
}
