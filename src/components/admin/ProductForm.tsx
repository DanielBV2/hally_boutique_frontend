"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/useCategories";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/hooks/useAdminProducts";
import { productSchema, type ProductFormValues } from "@/lib/validations/product";
import type { ProductDetail } from "@/types/product";

interface ProductFormProps {
  onSuccess: (product: ProductDetail) => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
  initialValues?: ProductDetail;
  slug?: string;
}

export function ProductForm({
  onSuccess,
  onCancel,
  mode = "create",
  initialValues,
  slug,
}: ProductFormProps) {
  const { data: categories } = useCategories();
  const createProduct = useCreateProductMutation();
  const updateProduct = useUpdateProductMutation(slug ?? "");
  const isEdit = mode === "edit" && !!initialValues;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues
      ? {
          name: initialValues.name,
          description: initialValues.description,
          basePrice: String(initialValues.basePrice),
          currency: initialValues.currency,
          weightGrams: String(initialValues.weightGrams ?? ""),
          categoryId: initialValues.category.id,
        }
      : {
          name: "",
          description: "",
          basePrice: "",
          currency: "COP",
          weightGrams: "",
          categoryId: "",
        },
  });

  async function handleSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        basePrice: Number(values.basePrice),
        currency: values.currency,
        categoryId: values.categoryId,
        ...(values.weightGrams && values.weightGrams.trim() !== ""
          ? { weightGrams: Number(values.weightGrams) }
          : {}),
      };

      const product = isEdit
        ? await updateProduct.mutateAsync({
            id: initialValues!.id,
            input: payload,
          })
        : await createProduct.mutateAsync(payload);
      onSuccess(product);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el producto",
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Camisa Oxford Azul" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Descripción del producto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio base</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="99000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moneda</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Moneda" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="COP">COP</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weightGrams"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso (gramos, opcional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1"
                  min="1"
                  placeholder="300 por defecto"
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value)}
                />
              </FormControl>
              <FormDescription>
                Usado para la cotización de envío.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                : "Crear producto"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
