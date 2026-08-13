import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  description: z.string().max(1000).optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
