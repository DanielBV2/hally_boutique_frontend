"use client";

import { ArrowLeft, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { toast } from "sonner";

import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminOrder,
  useUpdateOrderStatusMutation,
} from "@/hooks/useAdminOrders";
import { ApiError } from "@/lib/api/client";
import { formatAddressLine, formatCOP } from "@/lib/format";
import type { AdminOrderStatus, OrderStatus } from "@/types/order";

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const NEXT_STATUS: Partial<
  Record<OrderStatus, { status: AdminOrderStatus; label: string }>
> = {
  PAID: { status: "PROCESSING", label: "Marcar como en preparación" },
  PROCESSING: { status: "SHIPPED", label: "Marcar como enviado" },
  SHIPPED: { status: "DELIVERED", label: "Marcar como entregado" },
};

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const router = useRouter();
  const { orderId } = use(params);
  const { data: order, isLoading } = useAdminOrder(orderId);
  const statusMutation = useUpdateOrderStatusMutation();

  const nextStep = order ? NEXT_STATUS[order.status] : undefined;

  const handleAdvance = () => {
    if (!order || !nextStep) return;
    statusMutation.mutate(
      { orderId: order.id, status: nextStep.status },
      {
        onSuccess: () => {
          toast.success("Estado de la orden actualizado");
        },
        onError: (error) => {
          toast.error(
            error instanceof ApiError
              ? error.message
              : "No se pudo actualizar el estado",
          );
        },
      },
    );
  };

  if (isLoading && !order) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-muted-foreground">No se encontró la orden.</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/ordenes")}
        >
          Volver a órdenes
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Button
        type="button"
        variant="ghost"
        className="-ml-3 mb-4 self-start text-muted-foreground"
        onClick={() => router.push("/admin/ordenes")}
      >
        <ArrowLeft />
        Volver a órdenes
      </Button>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-foreground">
            Pedido #{order.id.slice(0, 8)}
          </h1>
          <span className="text-sm text-muted-foreground">
            {dateFormatter.format(new Date(order.createdAt))}
          </span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cliente</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">
              {order.customerName}
            </span>
            <span className="text-muted-foreground">
              {order.customerEmail}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado del pedido</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <OrderStatusBadge status={order.status} />
              <span className="text-muted-foreground">
                {order.status === "PENDING" &&
                  "Esperando confirmación de pago."}
                {order.status === "PAID" && "Pago confirmado, listo para preparar."}
                {order.status === "PROCESSING" && "En preparación y empaque."}
                {order.status === "SHIPPED" && "En camino al cliente."}
                {order.status === "DELIVERED" && "Entregado al cliente."}
                {order.status === "CANCELLED" && "Orden cancelada."}
                {order.status === "REFUNDED" && "Pago reembolsado."}
              </span>
            </div>
            {nextStep && (
              <Button
                type="button"
                className="self-start"
                disabled={statusMutation.isPending}
                onClick={handleAdvance}
              >
                {nextStep.label}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 text-sm"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-foreground">
                  {item.quantity} × {item.productName}
                </span>
                <span className="text-muted-foreground">
                  Talla {item.size} · {item.color} ·{" "}
                  {formatCOP(item.unitPrice)} c/u
                </span>
              </div>
              <span className="shrink-0 text-foreground">
                {formatCOP(item.lineTotal)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">
                {formatCOP(order.subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">IVA</span>
              <span className="text-foreground">
                {formatCOP(order.taxAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Envío</span>
              <span className="text-foreground">
                {formatCOP(order.shippingAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 text-base font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">
                {formatCOP(order.total)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dirección de envío</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">
              {order.shippingFullName}
            </span>
            <span className="text-muted-foreground">
              {formatAddressLine({
                line1: order.shippingLine1,
                line2: order.shippingLine2,
                city: order.shippingCity,
                state: order.shippingState,
                postalCode: order.shippingPostalCode,
              })}
            </span>
            <span className="text-muted-foreground">{order.shippingPhone}</span>
          </CardContent>
        </Card>
      </div>

      {(order.shippingCarrier || order.shippingStatus !== "PENDING") && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Envío</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            {order.shippingStatus === "LABEL_FAILED" && (
              <Alert variant="destructive" className="mb-2">
                <TriangleAlert />
                <AlertTitle>Guía de envío pendiente</AlertTitle>
                <AlertDescription>
                  Falló la generación de la guía de envío. Requiere intervención
                  manual con la transportadora.
                </AlertDescription>
              </Alert>
            )}
            {order.shippingCarrier && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Transportadora</span>
                <span className="text-foreground">
                  {order.shippingCarrier}
                </span>
              </div>
            )}
            {order.shippingService && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Servicio</span>
                <span className="text-foreground">{order.shippingService}</span>
              </div>
            )}
            {order.shippingTrackingNumber && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Guía</span>
                <span className="text-foreground">
                  {order.shippingTrackingNumber}
                </span>
              </div>
            )}
            {order.shippingLabelUrl && (
              <a
                href={order.shippingLabelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-primary underline underline-offset-4"
              >
                Descargar guía
              </a>
            )}
            {order.shippingStatus === "PENDING" &&
              !order.shippingTrackingNumber && (
                <p className="text-muted-foreground">
                  La guía de envío se está generando. Vuelve a consultar en unos
                  minutos.
                </p>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
