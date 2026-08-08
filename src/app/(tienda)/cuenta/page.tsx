"use client";

import { AddressesTab } from "@/components/account/AddressesTab";
import { OrdersTab } from "@/components/account/OrdersTab";
import { ProfileTab } from "@/components/account/ProfileTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CuentaPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">
        Mi cuenta
      </h1>

      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="direcciones">Direcciones</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-4">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="direcciones" className="mt-4">
          <AddressesTab />
        </TabsContent>

        <TabsContent value="pedidos" className="mt-4">
          <OrdersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
