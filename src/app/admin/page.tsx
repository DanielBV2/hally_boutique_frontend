"use client";

import Link from "next/link";
import {
  ArrowRight,
  CircleDollarSign,
  RefreshCw,
  ShoppingCart,
  TriangleAlert,
  Users,
} from "lucide-react";

import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { PageHeader } from "@/components/admin/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { useDashboardMetrics } from "@/hooks/useMetrics";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { formatCOP, formatShortDate } from "@/lib/format";
import type { OrderStatus } from "@/types/order";

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendientes",
  PAID: "Pagadas",
  PROCESSING: "En preparación",
  SHIPPED: "Enviadas",
  DELIVERED: "Entregadas",
  CANCELLED: "Canceladas",
  REFUNDED: "Reembolsadas",
};

const STATUS_BAR_CLASS: Record<OrderStatus, string> = {
  PENDING: "bg-muted-foreground/20",
  PAID: "bg-primary",
  PROCESSING: "bg-secondary",
  SHIPPED: "bg-accent",
  DELIVERED: "bg-primary/50",
  CANCELLED: "bg-destructive/60",
  REFUNDED: "bg-destructive/30",
};

const RECENT_ORDERS_LIMIT = 5;

function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tintClass,
}: {
  label: string;
  value: string;
  helper: string;
  icon: typeof CircleDollarSign;
  tintClass: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            tintClass,
          )}
        >
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboardMetrics();
  const recentOrders = useAdminOrders(1, RECENT_ORDERS_LIMIT);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-56" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 w-full rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Alert variant="destructive">
        <AlertTitle>No se pudo cargar el dashboard</AlertTitle>
        <AlertDescription className="flex flex-col items-start gap-3">
          <span>
            {error instanceof ApiError
              ? error.message
              : "Ocurrió un error inesperado. Intenta de nuevo."}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            <RefreshCw />
            Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const statusCounts = ORDER_STATUSES.map((status) => ({
    status,
    count: data.ordersByStatus[status] ?? 0,
  }));
  const totalOrders =
    statusCounts.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Resumen general de la tienda."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Ingresos"
          value={formatCOP(data.totalRevenue)}
          helper="Órdenes pagadas y en proceso"
          icon={CircleDollarSign}
          tintClass="bg-primary/10 text-primary"
        />
        <StatCard
          label="Pedidos"
          value={String(data.totalOrders)}
          helper="Total en la tienda"
          icon={ShoppingCart}
          tintClass="bg-accent/10 text-accent"
        />
        <StatCard
          label="Clientes"
          value={String(data.totalCustomers)}
          helper="Usuarios registrados"
          icon={Users}
          tintClass="bg-muted text-muted-foreground"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle>Pedidos por estado</CardTitle>
            <span className="text-sm text-muted-foreground">
              {data.totalOrders} en total
            </span>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div
              className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted"
              aria-label="Distribución de pedidos por estado"
            >
              {statusCounts
                .filter((item) => item.count > 0)
                .map((item) => (
                  <div
                    key={item.status}
                    className={cn("h-full", STATUS_BAR_CLASS[item.status])}
                    style={{
                      width: `${(item.count / totalOrders) * 100}%`,
                    }}
                  />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {statusCounts.map(({ status, count }) => (
                <div
                  key={status}
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5"
                >
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span
                      className={cn(
                        "size-2.5 rounded-full",
                        STATUS_BAR_CLASS[status],
                      )}
                    />
                    {STATUS_LABELS[status]}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle>Órdenes recientes</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link href="/admin/ordenes">
                Ver todas
                <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {recentOrders.isLoading ? (
              <>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </>
            ) : recentOrders.isError || !recentOrders.data ? (
              <p className="py-4 text-sm text-muted-foreground">
                No se pudieron cargar las órdenes recientes.
              </p>
            ) : recentOrders.data.items.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                Todavía no hay órdenes en la tienda.
              </p>
            ) : (
              recentOrders.data.items.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/ordenes/${order.id}`}
                  className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/50"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">
                      #{order.id.slice(0, 8)} · {order.customerName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatShortDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-sm font-semibold text-foreground">
                      {formatCOP(order.total)}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <TriangleAlert className="size-4 text-destructive" />
            Stock bajo
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-primary">
            <Link href="/admin/productos">
              Ver productos
              <ArrowRight />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {data.lowStockVariants.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              No hay variantes con stock bajo.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Talla</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.lowStockVariants.map((variant) => (
                  <TableRow key={variant.id}>
                    <TableCell className="font-medium">
                      {variant.productName}
                    </TableCell>
                    <TableCell>{variant.size}</TableCell>
                    <TableCell>{variant.color}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">{variant.stock}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
