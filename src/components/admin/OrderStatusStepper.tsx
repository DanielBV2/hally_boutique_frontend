import { Fragment } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PENDING", label: "Pago pendiente" },
  { status: "PAID", label: "Pago confirmado" },
  { status: "PROCESSING", label: "En preparación" },
  { status: "SHIPPED", label: "Enviado" },
  { status: "DELIVERED", label: "Entregado" },
];

export function OrderStatusStepper({ status }: { status: OrderStatus }) {
  const currentIndex = STEPS.findIndex((step) => step.status === status);
  if (currentIndex === -1) return null;

  return (
    <ol className="flex w-full items-center" aria-label="Progreso del pedido">
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <Fragment key={step.status}>
            {index > 0 && (
              <li
                aria-hidden="true"
                className={cn(
                  "h-0.5 flex-1 rounded-full",
                  index <= currentIndex ? "bg-primary" : "bg-muted",
                )}
              />
            )}
            <li
              className="flex flex-col items-center gap-1.5"
              title={step.label}
            >
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border-2 text-xs font-semibold",
                  isDone &&
                    "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary text-primary ring-4 ring-primary/15",
                  !isDone && !isCurrent &&
                    "border-muted-foreground/30 bg-background text-muted-foreground/50",
                )}
              >
                {isDone ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  "hidden text-[11px] font-medium sm:block",
                  isCurrent
                    ? "text-foreground"
                    : isDone
                      ? "text-muted-foreground"
                      : "text-muted-foreground/50",
                )}
              >
                {step.label}
              </span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
