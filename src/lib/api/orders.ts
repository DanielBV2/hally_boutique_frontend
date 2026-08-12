import { apiFetch } from "@/lib/api/client";
import type { CheckoutParams, Order, PaginatedOrders } from "@/types/order";
import type { ShippingRateOption } from "@/types/shipping";

export async function createOrder(input: {
  addressId: string;
  idempotencyKey: string;
}): Promise<Order> {
  return apiFetch<Order>("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function getShippingQuote(
  orderId: string,
): Promise<ShippingRateOption[]> {
  return apiFetch<ShippingRateOption[]>(
    `/api/orders/${orderId}/shipping-quote`,
    { method: "POST" },
  );
}

export async function selectShipping(
  orderId: string,
  input: { carrier: string; service: string },
): Promise<Order> {
  return apiFetch<Order>(`/api/orders/${orderId}/shipping-selection`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function getCheckoutParams(orderId: string): Promise<CheckoutParams> {
  return apiFetch<CheckoutParams>(`/api/orders/${orderId}/checkout`, {
    method: "POST",
  });
}

export async function getOrder(orderId: string): Promise<Order> {
  return apiFetch<Order>(`/api/orders/${orderId}`);
}

export async function getMyOrders(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedOrders> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const queryString = query.toString();
  return apiFetch<PaginatedOrders>(
    `/api/orders${queryString ? `?${queryString}` : ""}`,
  );
}
