"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Truck } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useSelectShippingMutation,
  useShippingQuote,
} from "@/hooks/useShipping";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";
import type { ShippingRateOption } from "@/types/shipping";

const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

// debe coincidir con FREE_SHIPPING_THRESHOLD del backend
const FREE_SHIPPING_THRESHOLD = 150000;

const optionKey = (option: ShippingRateOption) =>
  `${option.carrier}::${option.service}`;

interface ShippingStepProps {
  orderId: string;
  orderSubtotal: number;
  onConfirm: (updatedOrder: Order) => void;
}

export function ShippingStep({
  orderId,
  orderSubtotal,
  onConfirm,
}: ShippingStepProps) {
  const {
    data: options,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useShippingQuote(orderId, true);
  const [selectedOption, setSelectedOption] =
    useState<ShippingRateOption | null>(null);
  const selectShippingMutation = useSelectShippingMutation();

  function handleConfirm() {
    if (!selectedOption) return;
    selectShippingMutation.mutate(
      {
        orderId,
        carrier: selectedOption.carrier,
        service: selectedOption.service,
      },
      {
        onSuccess: (updatedOrder) => {
          onConfirm(updatedOrder);
        },
        onError: (error) => {
          if (error instanceof ApiError && error.status === 409) {
            toast.error(error.message);
            setSelectedOption(null);
            refetch();
            return;
          }
          toast.error(
            error.message ||
              "No se pudo confirmar el envío. Inténtalo de nuevo.",
          );
        },
      },
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-[90px] w-full rounded-xl" />
        <Skeleton className="h-[90px] w-full rounded-xl" />
        <Skeleton className="h-[90px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 p-8 text-center">
        <p className="text-foreground">No pudimos cotizar el envío</p>
        <Button
          type="button"
          variant="outline"
          disabled={isFetching}
          onClick={() => refetch()}
        >
          Reintentar cotización
        </Button>
      </div>
    );
  }

  if (options && options.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-8 text-center text-muted-foreground">
        No hay opciones de envío disponibles
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {orderSubtotal >= FREE_SHIPPING_THRESHOLD && (
        <Alert>
          <Truck />
          <AlertTitle>¡Tu pedido tiene envío gratis!</AlertTitle>
          <AlertDescription>
            Aplica sin importar la transportadora que elijas.
          </AlertDescription>
        </Alert>
      )}

      <RadioGroup
        value={selectedOption ? optionKey(selectedOption) : ""}
        onValueChange={(value) => {
          const option = options?.find((o) => optionKey(o) === value);
          if (option) setSelectedOption(option);
        }}
        className="flex flex-col gap-3"
      >
        {options?.map((option) => (
          <ShippingOption key={optionKey(option)} option={option} />
        ))}
      </RadioGroup>

      <Button
        type="button"
        disabled={!selectedOption || selectShippingMutation.isPending}
        onClick={handleConfirm}
      >
        {selectShippingMutation.isPending ? "Confirmando..." : "Continuar"}
      </Button>
    </div>
  );
}

function ShippingOption({ option }: { option: ShippingRateOption }) {
  return (
    <label className="flex cursor-pointer">
      <RadioGroupItem
        value={optionKey(option)}
        className="peer sr-only"
      />
      <Card
        className={cn(
          "w-full cursor-pointer transition-colors peer-aria-checked:border-primary peer-aria-checked:ring-2 peer-aria-checked:ring-ring/50",
        )}
      >
        <CardContent className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-foreground">
              {option.carrier}
            </span>
            <span className="text-sm font-medium text-foreground">
              {copFormatter.format(option.totalPrice)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {option.serviceDescription}
          </div>
          <div className="text-sm text-muted-foreground">
            {option.deliveryEstimate}
          </div>
        </CardContent>
      </Card>
    </label>
  );
}
