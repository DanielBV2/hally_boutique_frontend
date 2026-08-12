"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useClearCartMutation } from "@/hooks/useCart";
import { useOrder } from "@/hooks/useOrders";
import { formatCOP } from "@/lib/format";
import type { Order } from "@/types/order";

const maxAttempts = 10;
const pollInterval = 3000;

const SUCCESS_STATUSES = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];
const FAILED_STATUSES = ["CANCELLED", "REFUNDED"];

export default function ConfirmacionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <ConfirmacionContent />
    </Suspense>
  );
}

function ConfirmacionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const clearedCartRef = useRef(false);
  const clearCartMutation = useClearCartMutation();

  const [attempts, setAttempts] = useState(0);
  const attemptsRef = useRef(0);
  const lastUpdatedAtRef = useRef(0);

  const { data: order, isLoading, dataUpdatedAt } = useOrder(orderId, {
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      const stillPending = status === "PENDING";
      if (!stillPending) return false;
      return attemptsRef.current < maxAttempts ? pollInterval : false;
    },
  });

  useEffect(() => {
    if (!order || order.status !== "PENDING") return;
    if (lastUpdatedAtRef.current === dataUpdatedAt) return;
    lastUpdatedAtRef.current = dataUpdatedAt;
    attemptsRef.current += 1;
    setAttempts(attemptsRef.current);
  }, [order, dataUpdatedAt]);

  const isPaid = order ? SUCCESS_STATUSES.includes(order.status) : false;
  const isFailed = order ? FAILED_STATUSES.includes(order.status) : false;

  useEffect(() => {
    if (!isPaid || clearedCartRef.current) return;
    clearedCartRef.current = true;
    clearCartMutation.mutate();
  }, [isPaid, clearCartMutation]);

  if (!orderId) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <XCircle className="size-10 text-destructive" />
        <h1 className="text-xl font-semibold text-foreground">
          No pudimos encontrar tu pedido
        </h1>
        <p className="text-muted-foreground">
          Vuelve a la tienda para continuar tu compra.
        </p>
        <Button type="button" onClick={() => router.push("/productos")}>
          Ir a la tienda
        </Button>
      </div>
    );
  }

  if (isLoading && !order) {
    return <Spinner text="Verificando tu pedido..." />;
  }

  if (isPaid && order) {
    return (
      <SuccessView
        order={order}
        onSeeOrders={() => router.push("/cuenta")}
        onContinueShopping={() => router.push("/productos")}
      />
    );
  }

  if (isFailed) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <XCircle className="size-10 text-destructive" />
        <h1 className="text-xl font-semibold text-foreground">
          Tu pago no se completó
        </h1>
        <p className="text-muted-foreground">
          El pago no pudo procesarse. Puedes volver a intentarlo cuando
          quieras.
        </p>
        <Button type="button" onClick={() => router.push("/productos")}>
          Volver a intentar
        </Button>
      </div>
    );
  }

  if (order?.status === "PENDING" && attempts >= maxAttempts) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Estamos procesando tu pedido
        </h1>
        <p className="text-muted-foreground">
          Esto está tardando más de lo normal. Te confirmaremos por email
          cuando el pago se procese.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/cuenta")}
        >
          Ver mis pedidos
        </Button>
      </div>
    );
  }

  return <Spinner text="Confirmando tu pago..." />;
}

function Spinner({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}

function SuccessView({
  order,
  onSeeOrders,
  onContinueShopping,
}: {
  order: Order;
  onSeeOrders: () => void;
  onContinueShopping: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 px-4 py-16 text-center">
      <CheckCircle2 className="size-12 text-primary" />
      <h1 className="text-xl font-semibold text-foreground">¡Pago confirmado!</h1>

      <Card className="w-full">
        <CardContent className="flex flex-col gap-2 p-6 text-sm">
          <div className="flex flex-col gap-1">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-left text-foreground">
                  {item.quantity} × {item.productName}{" "}
                  <span className="text-muted-foreground">
                    ({item.size} · {item.color})
                  </span>
                </span>
                <span className="text-foreground">
                  {formatCOP(item.lineTotal)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2 text-base font-semibold">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">
              {formatCOP(order.total)}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex w-full flex-col gap-2">
        <Button type="button" onClick={onSeeOrders}>
          Ver mis pedidos
        </Button>
        <Button type="button" variant="outline" onClick={onContinueShopping}>
          Seguir comprando
        </Button>
      </div>
    </div>
  );
}
