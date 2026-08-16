"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddresses } from "@/hooks/useAddresses";
import { formatAddressLine } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Address } from "@/types/address";

import { AddressForm } from "./AddressForm";

interface AddressStepProps {
  onConfirm: (addressId: string) => void;
  initialAddressId?: string | null;
}

export function AddressStep({
  onConfirm,
  initialAddressId = null,
}: AddressStepProps) {
  const { data: addresses, isLoading } = useAddresses();
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  const preferred =
    addresses?.find((address) => address.id === initialAddressId) ??
    addresses?.find((address) => address.isDefault) ??
    addresses?.[0];
  const effectiveSelectedId = selectedAddressId ?? preferred?.id ?? null;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    );
  }

  if (addresses && addresses.length > 0 && !showNewForm) {
    return (
      <div className="flex flex-col gap-6">
        <RadioGroup
          value={effectiveSelectedId ?? ""}
          onValueChange={setSelectedAddressId}
          className="flex flex-col gap-3"
        >
          {addresses.map((address) => (
            <AddressOption key={address.id} address={address} />
          ))}
        </RadioGroup>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowNewForm(true)}
          >
            Usar otra dirección
          </Button>
          <Button
            type="button"
            disabled={!effectiveSelectedId}
            onClick={() => onConfirm(effectiveSelectedId as string)}
          >
            Continuar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AddressForm
      onSuccess={(address) => onConfirm(address.id)}
      onCancel={
        addresses && addresses.length > 0
          ? () => setShowNewForm(false)
          : undefined
      }
    />
  );
}

function AddressOption({ address }: { address: Address }) {
  return (
    <label className="flex cursor-pointer">
      <RadioGroupItem
        value={address.id}
        id={`address-${address.id}`}
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
              {address.fullName}
            </span>
            {address.isDefault && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Principal
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatAddressLine(address)}
          </div>
          <div className="text-sm text-muted-foreground">{address.phone}</div>
        </CardContent>
      </Card>
    </label>
  );
}
