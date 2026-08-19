"use client";

import { ArrowRight, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
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
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (!data || (data.items.length === 0 && data.page === 1)) {
    return (
      <EmptyState
        icon={Package}
        title="Sin pedidos"
        description="Tus pedidos aparecerán aquí una vez que realices una compra."
        action={
          <Button type="button" variant="outline" size="sm" onClick={() => router.push("/productos")}>
            Ver productos
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="size-4 text-muted-foreground" />
            Historial de pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {data.items.map((order) => (
              <Link
                key={order.id}
                href={`/cuenta/pedidos/${order.id}`}
                className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-4 transition-colors group-hover:bg-muted/40">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Package className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-foreground">
                          Pedido #{order.id.slice(0, 8)}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)} · {order.itemsCount}{" "}
                        {order.itemsCount === 1 ? "producto" : "productos"}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {formatCOP(order.total)}
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

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
