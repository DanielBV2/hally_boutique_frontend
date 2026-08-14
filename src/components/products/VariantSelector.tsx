'use client';
import { useMemo, useState } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ProductVariant } from '@/types/product';

interface VariantSelectorProps {
  variants: ProductVariant[];
  onSelect: (variant: ProductVariant | null) => void;
}

export function VariantSelector({ variants, onSelect }: VariantSelectorProps) {
  const sizes = useMemo(() => Array.from(new Set(variants.map((v) => v.size))), [variants]);
  const colors = useMemo(() => Array.from(new Set(variants.map((v) => v.color))), [variants]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const match = useMemo(() => {
    if (!selectedSize || !selectedColor) return null;
    return (
      variants.find(
        (v) => v.size === selectedSize && v.color === selectedColor,
      ) ?? null
    );
  }, [variants, selectedSize, selectedColor]);

  const combinationExists = (size: string, color: string) =>
    variants.some((v) => v.size === size && v.color === color);

  function handleSizeClick(size: string) {
    setSelectedSize(size);
    onSelect(
      selectedColor
        ? (variants.find((v) => v.size === size && v.color === selectedColor) ?? null)
        : null,
    );
  }

  function handleColorClick(color: string) {
    setSelectedColor(color);
    onSelect(
      selectedSize
        ? (variants.find((v) => v.size === selectedSize && v.color === color) ?? null)
        : null,
    );
  }

  const bothSelected = selectedSize !== null && selectedColor !== null;
  const combinationExistsForSelection = match !== null;
  const outOfStock = bothSelected && combinationExistsForSelection && !match!.inStock;
  const combinationMissing = bothSelected && !combinationExistsForSelection;

  const sizeDisabled = (size: string) =>
    selectedColor !== null && !combinationExists(size, selectedColor);
  const colorDisabled = (color: string) =>
    selectedSize !== null && !combinationExists(selectedSize, color);

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Talla</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const isActive = selectedSize === size;
            const disabled = sizeDisabled(size);
            return (
              <button
                key={size}
                type="button"
                aria-pressed={isActive}
                disabled={disabled}
                onClick={() => handleSizeClick(size)}
                className={cn(
                  buttonVariants({ variant: isActive ? 'default' : 'outline', size: 'sm' }),
                  'rounded-full select-none',
                  disabled && 'cursor-not-allowed opacity-40',
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const isActive = selectedColor === color;
            const disabled = colorDisabled(color);
            return (
              <button
                key={color}
                type="button"
                aria-pressed={isActive}
                disabled={disabled}
                onClick={() => handleColorClick(color)}
                className={cn(
                  buttonVariants({ variant: isActive ? 'default' : 'outline', size: 'sm' }),
                  'rounded-full select-none',
                  disabled && 'cursor-not-allowed opacity-40',
                )}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {outOfStock && (
        <p className="text-sm text-destructive">
          Sin stock disponible en esta combinación
        </p>
      )}

      {combinationMissing && (
        <p className="text-sm text-muted-foreground">
          Esta combinación no está disponible
        </p>
      )}
    </div>
  );
}
