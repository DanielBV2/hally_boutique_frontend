'use client';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
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
    return variants.find(
      (v) => v.size === selectedSize && v.color === selectedColor,
    ) ?? null;
  }, [variants, selectedSize, selectedColor]);

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

  const sizeSelected = selectedSize !== null;
  const colorSelected = selectedColor !== null;
  const bothSelected = sizeSelected && colorSelected;
  const combinationExists = match !== null;
  const outOfStock = bothSelected && combinationExists && !match.inStock;
  const combinationMissing = bothSelected && !combinationExists;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-foreground mb-2">Talla</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const isActive = selectedSize === size;
            return (
              <Badge
                key={size}
                variant={isActive ? 'default' : 'outline'}
                className="cursor-pointer select-none"
                onClick={() => handleSizeClick(size)}
              >
                {size}
              </Badge>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-2">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const isActive = selectedColor === color;
            return (
              <Badge
                key={color}
                variant={isActive ? 'default' : 'outline'}
                className="cursor-pointer select-none"
                onClick={() => handleColorClick(color)}
              >
                {color}
              </Badge>
            );
          })}
        </div>
      </div>

      {outOfStock && (
        <p className="text-sm text-destructive">Sin stock disponible en esta combinación</p>
      )}

      {combinationMissing && (
        <p className="text-sm text-muted-foreground">Esta combinación no está disponible</p>
      )}
    </div>
  );
}
