import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { toast } from "sonner";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/api/cart";
import {
  useAddToCartMutation,
  useCart,
  useClearCartMutation,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/hooks/useCart";
import { useSession } from "@/hooks/useSession";
import { useCartDrawerStore } from "@/stores/useCartDrawerStore";
import { createTestQueryClientWrapper } from "@/test/query-client";
import type { AddCartItemInput, Cart, UpdateCartItemInput } from "@/types/cart";

vi.mock("@/lib/api/cart", () => ({
  addCartItem: vi.fn(),
  clearCart: vi.fn(),
  getCart: vi.fn(),
  removeCartItem: vi.fn(),
  updateCartItem: vi.fn(),
}));

vi.mock("@/hooks/useSession", () => ({
  useSession: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const wrapper = createTestQueryClientWrapper();

const input: AddCartItemInput = { variantId: "variant-1", quantity: 2 };
const updateInput: UpdateCartItemInput = { quantity: 3 };

const emptyCart: Cart = { id: "cart-1", items: [], totalItems: 0, subtotal: 0 };

// Espía sobre el prototipo (no sobre una instancia) para poder verificar la
// invalidación sin depender de la caché compartida del wrapper de módulo.
let invalidateSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.clearAllMocks();
  invalidateSpy = vi.spyOn(QueryClient.prototype, "invalidateQueries");
});

afterEach(() => {
  invalidateSpy.mockRestore();
});

describe("useAddToCartMutation", () => {
  beforeEach(() => {
    useCartDrawerStore.setState({ isOpen: false });
    vi.clearAllMocks();
  });

  it("éxito: invoca addCartItem con el input, muestra toast.success y abre el drawer", async () => {
    vi.mocked(addCartItem).mockResolvedValue(emptyCart);
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

describe("useCart", () => {
  it("sin sesión: no ejecuta la query (getCart nunca se llama)", async () => {
    vi.mocked(useSession).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
    const queryWrapper = createTestQueryClientWrapper();
    const { result } = renderHook(() => useCart(), { wrapper: queryWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getCart).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it("con sesión: ejecuta getCart y expone los datos del carrito", async () => {
    vi.mocked(useSession).mockReturnValue({
      user: {
        id: "user-1",
        email: "cliente@test.co",
        firstName: "Cliente",
        lastName: "Prueba",
        phone: null,
        role: "CUSTOMER",
      },
      isLoading: false,
      isAuthenticated: true,
    });
    vi.mocked(getCart).mockResolvedValue(emptyCart);
    const queryWrapper = createTestQueryClientWrapper();
    const { result } = renderHook(() => useCart(), { wrapper: queryWrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(emptyCart);
    });

    expect(getCart).toHaveBeenCalledTimes(1);
    expect(result.current.isSuccess).toBe(true);
  });
});

describe("useUpdateCartItemMutation", () => {
  beforeEach(() => {
    vi.mocked(updateCartItem).mockResolvedValue(emptyCart);
  });

  it("éxito: invoca updateCartItem con (itemId, input) e invalida la query 'cart'", async () => {
    const { result } = renderHook(() => useUpdateCartItemMutation(), { wrapper });

    await result.current.mutateAsync({ itemId: "item-1", input: updateInput });

    expect(updateCartItem).toHaveBeenCalledWith("item-1", updateInput);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["cart"] });
  });

  it("error: muestra toast.error con el mensaje y NO invalida 'cart'", async () => {
    const errorMessage = "Stock insuficiente";
    vi.mocked(updateCartItem).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useUpdateCartItemMutation(), { wrapper });

    await expect(
      result.current.mutateAsync({ itemId: "item-1", input: updateInput }),
    ).rejects.toThrow(errorMessage);

    expect(updateCartItem).toHaveBeenCalledWith("item-1", updateInput);
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});

describe("useRemoveCartItemMutation", () => {
  beforeEach(() => {
    vi.mocked(removeCartItem).mockResolvedValue(emptyCart);
  });

  it("éxito: invoca removeCartItem con el itemId, invalida 'cart' y muestra toast.success", async () => {
    const { result } = renderHook(() => useRemoveCartItemMutation(), { wrapper });

    await result.current.mutateAsync("item-1");

    expect(removeCartItem).toHaveBeenCalledWith("item-1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["cart"] });
    expect(toast.success).toHaveBeenCalledWith("Producto eliminado");
  });

  it("error: muestra toast.error con el mensaje y NO invalida 'cart'", async () => {
    const errorMessage = "No se pudo eliminar el producto";
    vi.mocked(removeCartItem).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useRemoveCartItemMutation(), { wrapper });

    await expect(result.current.mutateAsync("item-1")).rejects.toThrow(
      errorMessage,
    );

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(toast.success).not.toHaveBeenCalled();
    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});

describe("useClearCartMutation", () => {
  beforeEach(() => {
    vi.mocked(clearCart).mockResolvedValue(null);
  });

  it("éxito: invoca clearCart, invalida 'cart' y muestra toast.success", async () => {
    const { result } = renderHook(() => useClearCartMutation(), { wrapper });

    await result.current.mutateAsync();

    expect(clearCart).toHaveBeenCalledTimes(1);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["cart"] });
    expect(toast.success).toHaveBeenCalledWith("Carrito vaciado");
  });

  it("error: muestra toast.error con el mensaje y NO invalida 'cart'", async () => {
    const errorMessage = "No se pudo vaciar el carrito";
    vi.mocked(clearCart).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useClearCartMutation(), { wrapper });

    await expect(result.current.mutateAsync()).rejects.toThrow(errorMessage);

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(toast.success).not.toHaveBeenCalled();
    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
