import type {
  AddCartItemInput,
  Cart,
  UpdateCartItemInput,
} from "@/types/cart";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { message: string };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) {
    throw new Error(json.error?.message ?? "Error en la petición");
  }
  return json.data;
}

export async function getCart(): Promise<Cart> {
  const res = await fetch("/api/cart", { method: "GET" });
  return handleResponse<Cart>(res);
}

export async function addCartItem(input: AddCartItemInput): Promise<Cart> {
  const res = await fetch("/api/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<Cart>(res);
}

export async function updateCartItem(
  itemId: string,
  input: UpdateCartItemInput,
): Promise<Cart> {
  const res = await fetch(`/api/cart/items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<Cart>(res);
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  const res = await fetch(`/api/cart/items/${itemId}`, {
    method: "DELETE",
  });
  return handleResponse<Cart>(res);
}

export async function clearCart(): Promise<null> {
  const res = await fetch("/api/cart", { method: "DELETE" });
  return handleResponse<null>(res);
}
