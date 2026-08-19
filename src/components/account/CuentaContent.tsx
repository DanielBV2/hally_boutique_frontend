"use client";

import { LogOut, MapPin, Package, User } from "lucide-react";

import { AddressesTab } from "@/components/account/AddressesTab";
import { OrdersTab } from "@/components/account/OrdersTab";
import { ProfileTab } from "@/components/account/ProfileTab";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLogoutMutation } from "@/hooks/useLogout";
import { useSession } from "@/hooks/useSession";

function UserInitials({ firstName, lastName }: { firstName: string; lastName: string }) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function CuentaContent() {
  const logoutMutation = useLogoutMutation();
  const { user } = useSession();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      {user && (
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Avatar size="lg" className="size-16 text-lg sm:size-20 sm:text-xl">
            <AvatarFallback>
              <UserInitials firstName={user.firstName} lastName={user.lastName} />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-1.5 text-center sm:items-start sm:text-left">
            <h1 className="text-2xl font-semibold text-foreground">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="text-xs">
              {user.role === "ADMIN" ? "Administrador" : "Cliente"}
            </Badge>
          </div>
        </div>
      )}

      {!user && (
        <h1 className="mb-6 text-2xl font-semibold text-foreground">
          Mi cuenta
        </h1>
      )}

      <Separator className="mb-6" />

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="perfil" className="flex-1 gap-2">
            <User className="size-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="direcciones" className="flex-1 gap-2">
            <MapPin className="size-4" />
            Direcciones
          </TabsTrigger>
          <TabsTrigger value="pedidos" className="flex-1 gap-2">
            <Package className="size-4" />
            Pedidos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-6">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="direcciones" className="mt-6">
          <AddressesTab />
        </TabsContent>

        <TabsContent value="pedidos" className="mt-6">
          <OrdersTab />
        </TabsContent>
      </Tabs>

      <Separator className="my-8" />

      <div className="flex justify-center">
        <Button
          type="button"
          variant="ghost"
          className="text-muted-foreground hover:text-destructive"
          disabled={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="size-4" />
          {logoutMutation.isPending ? "Cerrando sesión…" : "Cerrar sesión"}
        </Button>
      </div>
    </div>
  );
}
