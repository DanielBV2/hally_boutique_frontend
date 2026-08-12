import { apiFetch } from "@/lib/api/client";
import type {
  AddCartItemInput,
  Cart,
  UpdateCartItemInput,
} from "@/types/cart";

export async function getCart(): Promise<Cart> {
  return apiFetch<Cart>("/api/cart");
}

export async function addCartItem(input: AddCartItemInput): Promise<Cart> {
  return apiFetch<Cart>("/api/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function updateCartItem(
  itemId: string,
  input: UpdateCartItemInput,
): Promise<Cart> {
  return apiFetch<Cart>(`/api/cart/items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  return apiFetch<Cart>(`/api/cart/items/${itemId}`, {
    method: "DELETE",
  });
}

export async function clearCart(): Promise<null> {
  return apiFetch<null>("/api/cart", { method: "DELETE" });
}
