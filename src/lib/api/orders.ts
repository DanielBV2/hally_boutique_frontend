import type { Order } from "@/types/order";
import type { ShippingRateOption } from "@/types/shipping";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { message: string };
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) {
    throw new ApiError(json.error?.message ?? "Error en la petición", res.status);
  }
  return json.data;
}

export async function getShippingQuote(
  orderId: string,
): Promise<ShippingRateOption[]> {
  const res = await fetch(`/api/orders/${orderId}/shipping-quote`, {
    method: "POST",
  });
  return handleResponse<ShippingRateOption[]>(res);
}

export async function selectShipping(
  orderId: string,
  input: { carrier: string; service: string },
): Promise<Order> {
  const res = await fetch(`/api/orders/${orderId}/shipping-selection`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<Order>(res);
}
