"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AddressStep } from "@/components/checkout/AddressStep";
import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";

type CheckoutStep = "address" | "shipping" | "payment";

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "address", label: "Dirección" },
  { id: "shipping", label: "Envío" },
  { id: "payment", label: "Pago" },
];

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { message: string };
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: sessionLoading } = useSession();

  const [step, setStep] = useState<CheckoutStep>("address");
  const [orderId, setOrderId] = useState<string | null>(null);
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  useEffect(() => {
    if (sessionLoading) return;
    if (!isAuthenticated) {
      router.replace("/login?redirect=/checkout");
    }
  }, [isAuthenticated, sessionLoading, router]);

  if (sessionLoading || !isAuthenticated) {
    return null;
  }

  async function handleAddressConfirmed(addressId: string) {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId,
          idempotencyKey: idempotencyKeyRef.current,
        }),
      });
      const json = (await res.json()) as ApiResponse<Order>;

      if (res.status === 409) {
        toast.error(
          json.error?.message ??
            "Stock insuficiente para uno de los productos. Revisa tu carrito.",
        );
        return;
      }

      if (res.status === 400) {
        toast.error(json.error?.message ?? "El carrito está vacío");
        router.push("/productos");
        return;
      }

      if (!res.ok || !json.success || !json.data) {
        toast.error(
          json.error?.message ?? "No se pudo crear la orden. Inténtalo de nuevo.",
        );
        return;
      }

      setOrderId(json.data.id);
      setStep("shipping");
    } catch {
      toast.error("Ocurrió un error inesperado. Inténtalo de nuevo.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">
        Finalizar compra
      </h1>

      <div className="mb-8 flex items-center">
        {STEPS.map((s, index) => (
          <div key={s.id} className="flex flex-1 items-center">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                  step === s.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm sm:inline",
                  step === s.id
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className="mx-3 h-px flex-1 bg-border" />
            )}
          </div>
        ))}
      </div>

      {step === "address" && <AddressStep onConfirm={handleAddressConfirmed} />}

      {step === "shipping" && (
        <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
          <h2 className="mb-2 text-lg font-medium text-foreground">
            Envío {orderId && <span className="text-muted-foreground">· {orderId}</span>}
          </h2>
          <p className="text-muted-foreground">Próximamente</p>
        </div>
      )}

      {step === "payment" && (
        <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
          <h2 className="mb-2 text-lg font-medium text-foreground">Pago</h2>
          <p className="text-muted-foreground">Próximamente</p>
        </div>
      )}
    </div>
  );
}
