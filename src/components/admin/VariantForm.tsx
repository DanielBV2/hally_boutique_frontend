"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateVariantMutation,
  useUpdateVariantMutation,
} from "@/hooks/useAdminProducts";
import { formatCurrency } from "@/lib/format";
import { variantSchema, type VariantFormValues } from "@/lib/validations/product";
import { SIZES } from "@/lib/validations/product";
import type { AdminVariant } from "@/types/product";

interface VariantFormProps {
  productId: string;
  slug: string;
  basePrice: number;
  currency: string;
  onSuccess: () => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
  initialValues?: AdminVariant;
}

export function VariantForm({
  productId,
  slug,
  basePrice,
  currency,
  onSuccess,
  onCancel,
  mode = "create",
  initialValues,
}: VariantFormProps) {
  const createVariant = useCreateVariantMutation(productId, slug);
  const updateVariant = useUpdateVariantMutation(productId, slug);
  const isEdit = mode === "edit" && !!initialValues;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VariantFormValues>({
    resolver: zodResolver(variantSchema),
    defaultValues: initialValues
      ? {
          size: initialValues.size,
          color: initialValues.color,
          sku: initialValues.sku,
          stock: String(initialValues.stock),
          priceDelta: String(initialValues.priceDelta),
        }
      : {
          size: "",
          color: "",
          sku: "",
          stock: "0",
          priceDelta: "0",
        },
  });

  const [isActive, setIsActive] = useState(initialValues?.isActive ?? true);

  const watchedPriceDelta = useWatch({
    control: form.control,
    name: "priceDelta",
  });
  const priceDeltaNumber = Number(watchedPriceDelta) || 0;
  const finalPrice = basePrice + priceDeltaNumber;

  async function handleSubmit(values: VariantFormValues) {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateVariant.mutateAsync({
          variantId: initialValues!.id,
          input: {
            sku: values.sku,
            stock: Number(values.stock),
            priceDelta: Number(values.priceDelta) || 0,
            isActive,
          },
        });
      } else {
        await createVariant.mutateAsync({
          size: values.size,
          color: values.color,
          sku: values.sku,
          stock: Number(values.stock),
          priceDelta: Number(values.priceDelta) || 0,
        });
      }
      toast.success(isEdit ? "Variante actualizada" : "Variante creada");
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo guardar la variante",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="size"
            render={({ field }) =>
              isEdit ? (
                <FormItem>
                  <FormLabel>Talla</FormLabel>
                  <FormControl>
                    <Input value={initialValues!.size} readOnly />
                  </FormControl>
                </FormItem>
              ) : (
                <FormItem>
                  <FormLabel>Talla</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la talla" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )
            }
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Azul"
                    {...field}
                    readOnly={isEdit}
                    disabled={isEdit}
                  />
                </FormControl>
                {isEdit && (
                  <FormDescription>
                    La talla y el color no se pueden cambiar después de crear la
                    variante.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="HB-CAM-OXF-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" step="1" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceDelta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recargo de precio</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>
                  Precio final: {formatCurrency(finalPrice, currency)}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isEdit && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="variant-active"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked === true)}
            />
            <label htmlFor="variant-active" className="text-sm text-foreground">
              Variante activa
            </label>
          </div>
        )}

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Guardando…"
              : isEdit
                ? "Guardar cambios"
                : "Crear variante"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
