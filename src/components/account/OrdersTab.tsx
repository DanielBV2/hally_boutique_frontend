"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/Pagination";
import { useMyOrders } from "@/hooks/useOrders";
import { formatCOP, formatDate } from "@/lib/format";

const PAGE_SIZE = 20;

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
          <Link
            key={order.id}
            href={`/cuenta/pedidos/${order.id}`}
            className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card className="transition-colors hover:bg-muted/40">
              <CardContent className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1.5">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)} ·{" "}
                    {order.itemsCount}{" "}
                    {order.itemsCount === 1 ? "producto" : "productos"}
                  </span>
                </div>
                <span className="text-base font-semibold text-foreground">
                  {formatCOP(order.total)}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          page={data.page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
