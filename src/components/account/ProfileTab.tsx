"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, Save, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateProfileMutation } from "@/hooks/useProfile";
import { useSession } from "@/hooks/useSession";
import { ApiError } from "@/lib/api/client";
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from "@/lib/validations/auth";
import type { User as UserType } from "@/types/user";

function ProfileForm({ user }: { user: UserType }) {
  const updateProfile = useUpdateProfileMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone ?? "",
    },
  });

  async function handleSubmit(values: UpdateProfileFormValues) {
    setIsSubmitting(true);
    try {
      const phone = values.phone?.trim() ?? null;
      await updateProfile.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone,
      });
      toast.success("Perfil actualizado");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "No se pudo actualizar el perfil",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6"
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="size-4 text-muted-foreground" />
              Información personal
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="María Fernanda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Gómez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="size-4 text-muted-foreground" />
              Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="tucorreo@ejemplo.com" {...field} />
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
                  <FormLabel className="flex items-center gap-1.5">
                    Teléfono
                    <span className="text-xs text-muted-foreground">(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="3001234567" className="pl-9" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="size-4" />
            {isSubmitting ? "Guardando…" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function ProfileTab() {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <ProfileForm
      key={[user.firstName, user.lastName, user.email, user.phone].join("|")}
      user={user}
    />
  );
}
