"use client";

import {
  ArrowLeft,
  Calendar,

  MapPin,
  Package,
  Receipt,
  Truck,
  TriangleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

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
import { StoreBreadcrumbs } from "@/components/shared/StoreBreadcrumbs";
import { useOrder } from "@/hooks/useOrders";
import { formatAddressLine, formatCOP, formatDate } from "@/lib/format";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const router = useRouter();
  const { orderId } = use(params);
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading && !order) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-4 px-4 py-8">
        <StoreBreadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Mi cuenta", href: "/cuenta" },
            { label: "Pedidos", href: "/cuenta" },
            { label: "No encontrado" },
          ]}
        />
        <p className="text-muted-foreground">No se encontró el pedido.</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/cuenta")}
        >
          <ArrowLeft className="size-4" />
          Volver a mis pedidos
        </Button>
      </div>
    );
  }

  const hasShippingInfo =
    !!order.shippingCarrier || order.shippingStatus !== "PENDING";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4 py-8">
      <StoreBreadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Mi cuenta", href: "/cuenta" },
          { label: "Pedidos", href: "/cuenta" },
          { label: `#${order.id.slice(0, 8)}` },
        ]}
        className="mb-4"
      />

      <Button
        type="button"
        variant="ghost"
        className="-ml-3 mb-4 self-start text-muted-foreground"
        onClick={() => router.push("/cuenta")}
      >
        <ArrowLeft className="size-4" />
        Volver a mis pedidos
      </Button>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-foreground">
            Pedido {order.id.slice(0, 8)}
          </h1>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="size-3.5" />
            {formatDate(order.createdAt)}
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Receipt className="size-4 text-muted-foreground" />
            Resumen del pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted p-4 text-sm">
            <div>
              <p className="mb-1 text-muted-foreground">Estado</p>
              <OrderStatusBadge status={order.status} />
            </div>
            <div>
              <p className="mb-1 text-muted-foreground">Fecha</p>
              <p className="font-medium text-foreground">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <div>
              <p className="mb-1 text-muted-foreground">Total</p>
              <p className="font-medium text-foreground">
                {formatCOP(order.total)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Productos
            </h3>
            <ul className="space-y-2 text-sm">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-foreground">
                      {item.quantity} × {item.productName}
                    </p>
                    <p className="text-muted-foreground">
                      Talla {item.size} · {item.color} ·{" "}
                      {formatCOP(item.unitPrice)} c/u
                    </p>
                  </div>
                  <span className="shrink-0 font-medium text-foreground">
                    {formatCOP(item.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-3 text-sm">
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
                {order.shippingAmount === 0
                  ? "Gratis"
                  : formatCOP(order.shippingAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 text-base font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">
                {formatCOP(order.total)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className={hasShippingInfo ? "mt-4 grid gap-4 sm:grid-cols-2" : "mt-4"}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-4 text-muted-foreground" />
              Dirección de envío
            </CardTitle>
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

        {hasShippingInfo && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Truck className="size-4 text-muted-foreground" />
                Envío
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              {order.shippingStatus === "LABEL_FAILED" && (
                <Alert variant="destructive" className="mb-2">
                  <TriangleAlert className="size-4" />
                  <AlertTitle>Guía de envío pendiente</AlertTitle>
                  <AlertDescription>
                    Ocurrió un problema al generar la guía de envío. Ya
                    estamos gestionándolo con la transportadora; te
                    contactaremos cuando esté resuelto.
                  </AlertDescription>
                </Alert>
              )}
              {order.shippingCarrier && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Transportadora</span>
                  <span className="font-medium text-foreground">
                    {order.shippingCarrier}
                  </span>
                </div>
              )}
              {order.shippingService && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Servicio</span>
                  <span className="font-medium text-foreground">
                    {order.shippingService}
                  </span>
                </div>
              )}
              {order.shippingTrackingNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Guía</span>
                  <span className="font-medium text-foreground">
                    {order.shippingTrackingNumber}
                  </span>
                </div>
              )}
              {order.shippingLabelUrl && (
                <a
                  href={order.shippingLabelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  <Package className="size-3.5" />
                  Descargar guía
                </a>
              )}
              {order.shippingStatus === "PENDING" &&
                !order.shippingTrackingNumber && (
                  <p className="text-muted-foreground">
                    La guía de envío se está generando. Vuelve a consultar en
                    unos minutos.
                  </p>
                )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
