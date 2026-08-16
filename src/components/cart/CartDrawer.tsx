"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCart,
  useClearCartMutation,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/hooks/useCart";
import { formatCOP } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shipping";
import { useCartDrawerStore } from "@/stores/useCartDrawerStore";
import type { CartItem } from "@/types/cart";

export function CartDrawer() {
  const { isOpen, close } = useCartDrawerStore();
  const { data: cart, isLoading } = useCart();
  const updateCartItem = useUpdateCartItemMutation();
  const removeCartItem = useRemoveCartItemMutation();
  const clearCart = useClearCartMutation();
  const router = useRouter();

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
  const hasFreeShipping = remainingForFreeShipping <= 0;
  const shippingProgress = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100,
  );

  const isUpdatingItem = (itemId: string) =>
    (updateCartItem.isPending &&
      updateCartItem.variables?.itemId === itemId) ||
    (removeCartItem.isPending && removeCartItem.variables === itemId);

  const handleDecrement = (item: CartItem) => {
    if (item.quantity === 1) {
      removeCartItem.mutate(item.id);
      return;
    }
    updateCartItem.mutate({
      itemId: item.id,
      input: { quantity: item.quantity - 1 },
    });
  };

  const handleIncrement = (item: CartItem) => {
    if (item.quantity >= item.availableStock) return;
    updateCartItem.mutate({
      itemId: item.id,
      input: { quantity: item.quantity + 1 },
    });
  };

  const goToCheckout = () => {
    close();
    router.push("/checkout");
  };

  const goToProducts = () => {
    close();
    router.push("/productos");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent side="right" className="flex flex-col gap-0 p-0">
        <SheetHeader className="border-b border-border px-4 py-4">
          <div className="flex w-full items-center gap-2">
            <SheetTitle>Tu carrito</SheetTitle>
            {items.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-30 h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-destructive"
                    disabled={clearCart.isPending}
                  >
                    <Trash2 className="size-3.5" />
                    Vaciar carrito
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Vaciar el carrito?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Se eliminarán todos los productos de tu carrito. Esta
                      acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => clearCart.mutate()}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Vaciar carrito
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length > 0 && (
            <div className="mb-4 rounded-xl bg-muted p-3">
              {hasFreeShipping ? (
                <p className="text-sm font-medium text-foreground">
                  ¡Tienes envío gratis!
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Te faltan{" "}
                  <span className="font-semibold text-foreground">
                    {formatCOP(remainingForFreeShipping)}
                  </span>{" "}
                  para envío gratis
                </p>
              )}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-lg border border-border p-3"
                >
                  <Skeleton className="h-16 w-16 shrink-0 rounded-md" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="mt-1 h-7 w-28" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Tu carrito está vacío</p>
              <Button variant="outline" onClick={goToProducts}>
                Ver productos
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((item) => {
                const updating = isUpdatingItem(item.id);
                const stepperDisabled = updating || !item.isAvailable;
                const plusDisabled =
                  stepperDisabled || item.quantity >= item.availableStock;
                return (
                  <li
                    key={item.id}
                    className="flex gap-4 rounded-xl bg-muted p-4"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-background">
                      {item.thumbnailUrl && (
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.productName}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {item.productName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {[item.size, item.color].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Eliminar ${item.productName}`}
                          disabled={updating}
                          onClick={() => removeCartItem.mutate(item.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>

                      <p className="text-xs font-medium text-foreground">
                        {formatCOP(item.unitPrice)}
                      </p>

                      {!item.isAvailable && (
                        <Badge variant="destructive" className="w-fit">
                          No disponible
                        </Badge>
                      )}

                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-border bg-background">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Disminuir cantidad"
                            disabled={stepperDisabled}
                            className="h-8 w-8 rounded-lg hover:bg-muted"
                            onClick={() => handleDecrement(item)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-sm tabular-nums">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Aumentar cantidad"
                            disabled={plusDisabled}
                            className="h-8 w-8 rounded-lg hover:bg-muted"
                            onClick={() => handleIncrement(item)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-base font-semibold text-foreground">
                          {formatCOP(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">
                {formatCOP(cart?.subtotal ?? 0)}
              </span>
            </div>
            <Button className="w-full" onClick={goToCheckout}>
              Ir a pagar
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
