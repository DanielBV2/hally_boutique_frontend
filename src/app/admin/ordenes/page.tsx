"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { formatCOP, formatShortDate } from "@/lib/format";

const PAGE_SIZE = 20;

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "Todos los estados" },
  { value: "PENDING", label: "Pendiente de pago" },
  { value: "PAID", label: "Pago confirmado" },
  { value: "PROCESSING", label: "En preparación" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "REFUNDED", label: "Reembolsado" },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");

  const { data, isLoading } = useAdminOrders(
    page,
    PAGE_SIZE,
    status === "all" ? undefined : status,
  );

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.limit))
    : 1;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-64 rounded-md" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  if (!data || (data.items.length === 0 && data.page === 1)) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Órdenes</h1>
        <Select value={status} onValueChange={(value) => {
          setStatus(value);
          setPage(1);
        }}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No hay órdenes con el estado seleccionado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Órdenes</h1>

      <Select
        value={status}
        onValueChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
      >
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_FILTERS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((order) => (
                <TableRow
                  key={order.id}
                  role="link"
                  tabIndex={0}
                  aria-label={`Ver pedido ${order.id.slice(0, 8)}`}
                  className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  onClick={() =>
                    router.push(`/admin/ordenes/${order.id}`)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      router.push(`/admin/ordenes/${order.id}`);
                    }
                  }}
                >
                  <TableCell className="font-medium">
                    #{order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <span className="block">{order.customerName}</span>
                    <span className="block text-muted-foreground">
                      {order.customerEmail}
                    </span>
                  </TableCell>
                  <TableCell>
                    {formatShortDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCOP(order.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
