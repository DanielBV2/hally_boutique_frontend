"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/useSession";

export function ProfileTab() {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Nombre</Label>
          <span className="text-sm text-foreground">
            {[user.firstName, user.lastName].filter(Boolean).join(" ") ||
              "—"}
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">
            Correo electrónico
          </Label>
          <span className="text-sm text-foreground">{user.email}</span>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        La edición de perfil estará disponible próximamente.
      </p>
    </div>
  );
}
