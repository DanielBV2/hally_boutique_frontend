import { z } from "zod";

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(200),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(5000),
  basePrice: z
    .string()
    .refine(
      (value) => value.trim() !== "" && !Number.isNaN(Number(value)) && Number(value) > 0,
      "El precio debe ser un número mayor a 0",
    ),
  currency: z.string().min(1),
  weightGrams: z
    .string()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        value.trim() === "" ||
        (Number.isInteger(Number(value)) && Number(value) > 0),
      "El peso debe ser un entero positivo",
    ),
  categoryId: z.string().uuid("Selecciona una categoría"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const productImageSchema = z.object({
  url: z.string().url("Ingresa una URL válida"),
  altText: z.string().max(200).optional(),
});

export type ProductImageFormValues = z.infer<typeof productImageSchema>;

export const variantSchema = z.object({
  size: z
    .string()
    .refine(
      (value) => (SIZES as readonly string[]).includes(value),
      "Selecciona una talla",
    ),
  color: z.string().min(2, "El color debe tener al menos 2 caracteres").max(50),
  sku: z
    .string()
    .min(3, "El SKU debe tener al menos 3 caracteres")
    .max(50)
    .optional()
    .or(z.literal("")),
  stock: z
    .string()
    .refine(
      (value) => {
        const number = Number(value);
        return value.trim() !== "" && Number.isInteger(number) && number >= 0;
      },
      "El stock debe ser un entero no negativo",
    ),
  priceDelta: z
    .string()
    .refine(
      (value) => value.trim() === "" || !Number.isNaN(Number(value)),
      "El recargo debe ser un número",
    ),
});

export type VariantFormValues = z.infer<typeof variantSchema>;
