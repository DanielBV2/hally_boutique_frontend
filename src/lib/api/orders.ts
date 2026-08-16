import { apiFetch } from "@/lib/api/client";
import type {
  AdminOrder,
  AdminOrderStatus,
  CheckoutParams,
  Order,
  PaginatedAdminOrders,
  PaginatedOrders,
} from "@/types/order";
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

export async function updateOrderAddress(
  orderId: string,
  addressId: string,
): Promise<Order> {
  return apiFetch<Order>(`/api/orders/${orderId}/address`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ addressId }),
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

export async function getAdminOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<PaginatedAdminOrders> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status) query.set("status", params.status);
  if (params?.search) query.set("search", params.search);
  const queryString = query.toString();
  return apiFetch<PaginatedAdminOrders>(
    `/api/admin/orders${queryString ? `?${queryString}` : ""}`,
  );
}

export async function getAdminOrder(orderId: string): Promise<AdminOrder> {
  return apiFetch<AdminOrder>(`/api/admin/orders/${orderId}`);
}

export async function updateAdminOrderStatus(
  orderId: string,
  status: AdminOrderStatus,
): Promise<AdminOrder> {
  return apiFetch<AdminOrder>(`/api/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}
