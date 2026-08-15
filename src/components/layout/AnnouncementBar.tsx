"use client";

import { useState } from "react";
import Link from "next/link";
import { Truck, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shipping";
import { formatCOP } from "@/lib/format";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const message = `Envío gratis en compras superiores a ${formatCOP(
    FREE_SHIPPING_THRESHOLD
  )}`;

  const copy = (
    <>
      <Truck className="size-4 shrink-0 text-accent" />
      <span>{message}</span>
      <Link
        href="/productos"
        className="underline underline-offset-4 hover:no-underline"
      >
        Ver productos
      </Link>
    </>
  );

  return (
    <div className="relative flex items-center overflow-hidden bg-primary py-3 text-primary-foreground">
      <div className="animate-marquee flex w-max items-center gap-40 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-3">{copy}</div>
        <div className="flex items-center gap-3 motion-reduce:hidden" aria-hidden="true">
          {copy}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Cerrar aviso"
        className="absolute right-2 hover:bg-primary-foreground/10 hover:text-primary-foreground"
        onClick={() => setIsVisible(false)}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
