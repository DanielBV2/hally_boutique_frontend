"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/hooks/useAdminCategories";
import { categorySchema, type CategoryFormValues } from "@/lib/validations/category";
import type { Category } from "@/types/category";

interface CategoryFormProps {
  onSuccess: (category: Category) => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
  initialValues?: Category;
}

export function CategoryForm({
  onSuccess,
  onCancel,
  mode = "create",
  initialValues,
}: CategoryFormProps) {
  const createCategory = useCreateCategoryMutation();
  const updateCategory = useUpdateCategoryMutation();
  const isEdit = mode === "edit" && !!initialValues;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialValues
      ? {
          name: initialValues.name,
          description: initialValues.description ?? "",
        }
      : {
          name: "",
          description: "",
        },
  });

  async function handleSubmit(values: CategoryFormValues) {
    setIsSubmitting(true);
    try {
      const category = isEdit
        ? await updateCategory.mutateAsync({
            id: initialValues!.id,
            input: values,
          })
        : await createCategory.mutateAsync(values);
      onSuccess(category);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la categoría",
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
                <Input placeholder="Vestidos de baño" {...field} />
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
              <FormLabel>Descripción (opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Breve descripción de la categoría" {...field} />
              </FormControl>
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
                : "Crear categoría"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
