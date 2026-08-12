"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCheckoutParams } from "@/lib/api/orders";
import { formatCOP } from "@/lib/format";
import type { Order } from "@/types/order";

interface PaymentStepProps {
  order: Order;
}

export function PaymentStep({ order }: PaymentStepProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function handlePay() {
    setIsRedirecting(true);
    try {
      const params = await getCheckoutParams(order.id);

      const url = new URL("https://checkout.wompi.co/p/");
      url.searchParams.set("public-key", params.publicKey);
      url.searchParams.set("currency", params.currency);
      url.searchParams.set("amount-in-cents", String(params.amountInCents));
      url.searchParams.set("reference", params.reference);
      url.searchParams.set("signature:integrity", params.signature);
      url.searchParams.set(
        "redirect-url",
        `${window.location.origin}/checkout/confirmacion?orderId=${order.id}`,
      );

      window.location.href = url.toString();
    } catch (error) {
      setIsRedirecting(false);
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo iniciar el pago. Inténtalo de nuevo.",
      );
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">
              {formatCOP(order.subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">IVA (19%)</span>
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

        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={isRedirecting}
          onClick={handlePay}
        >
          {isRedirecting ? "Redirigiendo a Wompi..." : "Pagar con Wompi"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Serás redirigido a Wompi para completar el pago de forma segura
        </p>
      </CardContent>
    </Card>
  );
}
