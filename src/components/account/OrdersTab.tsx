"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyOrders } from "@/hooks/useOrders";

const PAGE_SIZE = 20;

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function OrdersTab() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyOrders(page, PAGE_SIZE);

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.limit))
    : 1;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    );
  }

  if (!data || (data.items.length === 0 && data.page === 1)) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">Aún no tienes pedidos</p>
        <Button type="button" onClick={() => router.push("/productos")}>
          Ver productos
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {data.items.map((order) => (
          <Card
            key={order.id}
            className="cursor-pointer transition-colors hover:bg-muted/40"
            onClick={() => router.push(`/cuenta/pedidos/${order.id}`)}
          >
            <CardContent className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1.5">
                <OrderStatusBadge status={order.status} />
                <span className="text-sm text-muted-foreground">
                  {dateFormatter.format(new Date(order.createdAt))} ·{" "}
                  {order.itemsCount}{" "}
                  {order.itemsCount === 1 ? "producto" : "productos"}
                </span>
              </div>
              <span className="text-base font-semibold text-foreground">
                {currencyFormatter.format(order.total)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {data.page} de {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
