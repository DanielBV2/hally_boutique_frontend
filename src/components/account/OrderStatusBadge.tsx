import type { VariantProps } from "class-variance-authority";

import { Badge, badgeVariants } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/order";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
  PENDING: { label: "Pendiente de pago", variant: "outline" },
  PAID: { label: "Pago confirmado", variant: "default" },
  PROCESSING: { label: "En preparación", variant: "default" },
  SHIPPED: { label: "Enviado", variant: "default" },
  DELIVERED: { label: "Entregado", variant: "default" },
  CANCELLED: { label: "Cancelado", variant: "destructive" },
  REFUNDED: { label: "Reembolsado", variant: "destructive" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config =
    STATUS_CONFIG[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
