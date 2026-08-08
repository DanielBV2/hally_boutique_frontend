"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
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
import { useCreateAddressMutation, useUpdateAddressMutation } from "@/hooks/useAddresses";
import { COLOMBIA_DEPARTMENTS } from "@/lib/constants/colombia-departments";
import { addressSchema, type AddressFormValues } from "@/lib/validations/address";
import type { Address } from "@/types/address";

interface AddressFormProps {
  onSuccess: (address: Address) => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
  initialValues?: Address;
}

export function AddressForm({
  onSuccess,
  onCancel,
  mode = "create",
  initialValues,
}: AddressFormProps) {
  const createAddress = useCreateAddressMutation();
  const updateAddress = useUpdateAddressMutation();
  const isEdit = mode === "edit" && !!initialValues;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialValues
      ? {
          fullName: initialValues.fullName,
          phone: initialValues.phone,
          line1: initialValues.line1,
          line2: initialValues.line2 ?? "",
          city: initialValues.city,
          state: initialValues.state,
          postalCode: initialValues.postalCode ?? "",
          isDefault: initialValues.isDefault,
        }
      : {
          fullName: "",
          phone: "",
          line1: "",
          line2: "",
          city: "",
          state: "",
          postalCode: "",
          isDefault: false,
        },
  });

  async function handleSubmit(values: AddressFormValues) {
    setIsSubmitting(true);
    try {
      const address = isEdit
        ? await updateAddress.mutateAsync({
            id: initialValues!.id,
            input: values,
          })
        : await createAddress.mutateAsync(values);
      onSuccess(address);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la dirección",
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
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input placeholder="María Fernanda Gómez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="3001234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="line1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Calle 10 # 5-23" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="line2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apartamento, oficina, etc. (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Apto 201" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <Input placeholder="Bogotá" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona tu departamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COLOMBIA_DEPARTMENTS.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código postal (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="110111" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
              </FormControl>
              <FormLabel className="font-normal text-muted-foreground">
                Usar como dirección principal
              </FormLabel>
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
                : "Guardar dirección"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
