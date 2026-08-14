"use client";

import { ShoppingBag } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shipping";
import { formatCOP } from "@/lib/format";
import type { Order } from "@/types/order";

interface OrderSummaryProps {
  order?: Order | null;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  const { data: cart } = useCart();

  const lines =
    order?.items.map((item) => ({
      id: item.id,
      name: item.productName,
      detail: [item.size, item.color].filter(Boolean).join(" · "),
      quantity: item.quantity,
      price: item.lineTotal,
    })) ??
    cart?.items.map((item) => ({
      id: item.id,
      name: item.productName,
      detail: [item.size, item.color].filter(Boolean).join(" · "),
      quantity: item.quantity,
      price: item.subtotal,
    })) ??
    [];

  const subtotal = order?.subtotal ?? cart?.subtotal ?? 0;
  const hasBreakdown = !!order;

  return (
    <aside className="h-fit rounded-xl border border-border bg-muted/30 p-4 lg:sticky lg:top-6">
      <h4 className="mb-4 flex items-center gap-2 text-lg font-medium text-foreground">
        <ShoppingBag className="size-5 text-muted-foreground" />
        Resumen del pedido
      </h4>

      {lines.length > 0 ? (
        <ul className="space-y-2">
          {lines.map((line) => (
            <li
              key={line.id}
              className="flex justify-between gap-3 text-sm"
            >
              <span className="min-w-0 text-foreground">
                {line.quantity} × {line.name}
                {line.detail && (
                  <span className="text-muted-foreground">
                    {" "}
                    ({line.detail})
                  </span>
                )}
              </span>
              <span className="shrink-0 font-medium text-foreground">
                {formatCOP(line.price)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          Tu carrito está vacío.
        </p>
      )}

      <div className="my-4 h-px bg-border" />

      <dl className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="font-medium text-foreground">{formatCOP(subtotal)}</dd>
        </div>
        {hasBreakdown && (
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">IVA (19%)</dt>
            <dd className="text-foreground">{formatCOP(order!.taxAmount)}</dd>
          </div>
        )}
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Envío</dt>
          <dd className="text-foreground">
            {hasBreakdown
              ? order!.shippingAmount === 0
                ? "Gratis"
                : formatCOP(order!.shippingAmount)
              : "Se calculará"}
          </dd>
        </div>
      </dl>

      <div className="my-4 h-px bg-border" />

      <div className="flex items-end justify-between">
        <span className="text-base font-medium text-foreground">Total</span>
        <span className="text-xl font-semibold text-foreground">
          {hasBreakdown ? formatCOP(order!.total) : formatCOP(subtotal)}
        </span>
      </div>

      {subtotal >= FREE_SHIPPING_THRESHOLD && (
        <p className="mt-4 rounded-lg bg-secondary/60 px-3 py-2 text-center text-xs font-medium text-foreground">
          Tu pedido califica para envío gratis
        </p>
      )}
    </aside>
  );
}
