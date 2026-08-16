"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

interface ProductImageLightboxProps {
  images: ProductImage[];
  index: number;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIndexChange: (index: number) => void;
}

export function ProductImageLightbox({
  images,
  index,
  productName,
  open,
  onOpenChange,
  onIndexChange,
}: ProductImageLightboxProps) {
  const current = images[index];

  const next = () => onIndexChange((index + 1) % images.length);
  const prev = () => onIndexChange((index - 1 + images.length) % images.length);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl gap-0 overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{productName}</DialogTitle>
        </DialogHeader>

        <div className="relative aspect-[3/4] w-full bg-muted sm:aspect-auto sm:h-[70vh]">
          {current ? (
            <Image
              src={current.url}
              alt={current.altText ?? productName}
              fill
              sizes="(max-width: 1024px) 100vw, 80vw"
              className="object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Sin imagen
            </div>
          )}

          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                aria-label="Imagen anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={prev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Siguiente imagen"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={next}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 border-t border-border p-3">
            {images.map((image, imageIndex) => (
              <button
                key={image.id}
                type="button"
                onClick={() => onIndexChange(imageIndex)}
                aria-label={`Ver imagen ${imageIndex + 1}`}
                aria-pressed={index === imageIndex}
                className={cn(
                  "h-14 w-14 overflow-hidden rounded-lg border-2 bg-muted transition-colors",
                  index === imageIndex
                    ? "border-primary"
                    : "border-transparent",
                )}
              >
                <Image
                  src={image.url}
                  alt={image.altText ?? productName}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
