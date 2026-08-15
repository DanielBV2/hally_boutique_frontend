"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AddressStep } from "@/components/checkout/AddressStep";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { ShippingStep } from "@/components/checkout/ShippingStep";
import { useSession } from "@/hooks/useSession";
import { ApiError } from "@/lib/api/client";
import { createOrder, updateOrderAddress } from "@/lib/api/orders";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";

type CheckoutStep = "address" | "shipping" | "payment";

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "address", label: "Dirección" },
  { id: "shipping", label: "Envío" },
  { id: "payment", label: "Pago" },
];

export function CheckoutContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading: sessionLoading } = useSession();

  const [step, setStep] = useState<CheckoutStep>("address");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderSubtotal, setOrderSubtotal] = useState<number>(0);
  const [order, setOrder] = useState<Order | null>(null);
  const [confirmedAddressId, setConfirmedAddressId] = useState<string | null>(
    null,
  );
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

  const currentStepIndex = STEPS.findIndex((s) => s.id === step);

  function goToStep(target: CheckoutStep) {
    const targetIndex = STEPS.findIndex((s) => s.id === target);
    if (targetIndex >= currentStepIndex) return;
    if (target === "address") {
      setOrder(null);
    }
    setStep(target);
  }

  async function handleAddressConfirmed(addressId: string) {
    setConfirmedAddressId(addressId);
    try {
      if (orderId) {
        const updatedOrder = await updateOrderAddress(orderId, addressId);
        setOrderSubtotal(updatedOrder.subtotal);
        setOrder(null);
      } else {
        const createdOrder = await createOrder({
          addressId,
          idempotencyKey: idempotencyKeyRef.current,
        });
        setOrderId(createdOrder.id);
        setOrderSubtotal(createdOrder.subtotal);
      }

      setStep("shipping");
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        toast.error(error.message);
        return;
      }

      if (error instanceof ApiError && error.status === 400) {
        toast.error(error.message);
        router.push("/productos");
        return;
      }

      toast.error("Ocurrió un error inesperado. Inténtalo de nuevo.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">
        Finalizar compra
      </h1>

      <div className="mb-8 flex items-center">
        {STEPS.map((s, index) => {
          const isActive = step === s.id;
          const isPast = index < currentStepIndex;
          return (
            <div key={s.id} className="flex flex-1 items-center">
              <button
                type="button"
                disabled={!isPast}
                onClick={() => goToStep(s.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full",
                  isPast ? "cursor-pointer" : "cursor-default",
                )}
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isPast
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {isPast ? <Check className="size-4" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-sm sm:inline",
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </span>
              </button>
              {index < STEPS.length - 1 && (
                <div className="mx-3 h-px flex-1 bg-border" />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          {step === "address" && (
            <AddressStep
              initialAddressId={confirmedAddressId}
              onConfirm={handleAddressConfirmed}
            />
          )}

          {step === "shipping" &&
            (orderId ? (
              <ShippingStep
                orderId={orderId}
                orderSubtotal={orderSubtotal}
                onBack={() => goToStep("address")}
                onConfirm={(updatedOrder) => {
                  setOrder(updatedOrder);
                  setStep("payment");
                }}
              />
            ) : (
              <div className="rounded-xl border border-border bg-muted/30 p-8 text-center text-muted-foreground">
                Envío no disponible
              </div>
            ))}

          {step === "payment" &&
            (order ? (
              <PaymentStep
                order={order}
                onBack={() => goToStep("shipping")}
              />
            ) : (
              <div className="rounded-xl border border-border bg-muted/30 p-8 text-center text-muted-foreground">
                Pago no disponible
              </div>
            ))}
        </div>

        <OrderSummary order={order} />
      </div>
    </div>
  );
}
