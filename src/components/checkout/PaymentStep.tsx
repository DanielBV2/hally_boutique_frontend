"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCheckoutParams } from "@/lib/api/orders";
import type { Order } from "@/types/order";

interface PaymentStepProps {
  order: Order;
  onBack: () => void;
}

export function PaymentStep({ order, onBack }: PaymentStepProps) {
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
    <div className="flex flex-col gap-3">
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Pago</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Paga de forma segura con Wompi, redirigido a su plataforma de
              pago.
            </p>
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

      <Button
        type="button"
        variant="outline"
        disabled={isRedirecting}
        onClick={onBack}
      >
        Volver al envío
      </Button>
    </div>
  );
}
