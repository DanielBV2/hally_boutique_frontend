import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { toast } from "sonner";
import { addCartItem } from "@/lib/api/cart";
import { useAddToCartMutation } from "@/hooks/useCart";
import { useCartDrawerStore } from "@/stores/useCartDrawerStore";
import { createTestQueryClientWrapper } from "@/test/query-client";
import type { AddCartItemInput } from "@/types/cart";

vi.mock("@/lib/api/cart", () => ({
  addCartItem: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const wrapper = createTestQueryClientWrapper();

const input: AddCartItemInput = { variantId: "variant-1", quantity: 2 };

describe("useAddToCartMutation", () => {
  beforeEach(() => {
    useCartDrawerStore.setState({ isOpen: false });
    vi.clearAllMocks();
  });

  it("éxito: invoca addCartItem con el input, muestra toast.success y abre el drawer", async () => {
    vi.mocked(addCartItem).mockResolvedValue({
      id: "cart-1",
      items: [],
      totalItems: 0,
      subtotal: 0,
    });
    const { result } = renderHook(() => useAddToCartMutation(), { wrapper });

    await result.current.mutateAsync(input);

    expect(addCartItem).toHaveBeenCalledWith(input);
    expect(toast.success).toHaveBeenCalledWith("Añadido al carrito");
    expect(useCartDrawerStore.getState().isOpen).toBe(true);
  });

  it("error: si addCartItem rechaza, muestra toast.error con el mensaje y NO abre el drawer", async () => {
    const errorMessage = "Stock insuficiente";
    vi.mocked(addCartItem).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useAddToCartMutation(), { wrapper });

    await expect(result.current.mutateAsync(input)).rejects.toThrow(errorMessage);

    expect(addCartItem).toHaveBeenCalledWith(input);
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(useCartDrawerStore.getState().isOpen).toBe(false);
  });
});