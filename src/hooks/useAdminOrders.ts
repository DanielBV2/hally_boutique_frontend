"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAdminOrder,
  getAdminOrders,
  updateAdminOrderStatus,
} from "@/lib/api/orders";
import type { AdminOrderStatus } from "@/types/order";

export function useAdminOrders(
  page: number,
  limit: number,
  status?: string,
) {
  return useQuery({
    queryKey: ["admin", "orders", page, limit, status ?? "all"],
    queryFn: () => getAdminOrders({ page, limit, status }),
  });
}

export function useAdminOrder(orderId: string | null) {
  return useQuery({
    queryKey: ["admin", "order", orderId],
    queryFn: () => getAdminOrder(orderId as string),
    enabled: !!orderId,
  });
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { orderId: string; status: AdminOrderStatus }) =>
      updateAdminOrderStatus(input.orderId, input.status),
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "order", input.orderId],
      });
    },
  });
}
