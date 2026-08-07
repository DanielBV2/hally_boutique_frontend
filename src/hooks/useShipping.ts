"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { getShippingQuote, selectShipping } from "@/lib/api/orders";

export function useShippingQuote(orderId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["shippingQuote", orderId],
    queryFn: () => getShippingQuote(orderId!),
    enabled: enabled && !!orderId,
    retry: false,
  });
}

export function useSelectShippingMutation() {
  return useMutation({
    mutationFn: ({
      orderId,
      carrier,
      service,
    }: {
      orderId: string;
      carrier: string;
      service: string;
    }) => selectShipping(orderId, { carrier, service }),
  });
}
