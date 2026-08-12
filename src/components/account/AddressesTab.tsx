"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AddressForm } from "@/components/checkout/AddressForm";
import {
  useAddresses,
  useDeleteAddressMutation,
} from "@/hooks/useAddresses";
import { formatAddressLine } from "@/lib/format";
import type { Address } from "@/types/address";

export function AddressesTab() {
  const { data: addresses, isLoading } = useAddresses();
  const deleteAddress = useDeleteAddressMutation();

  const [dialogAddress, setDialogAddress] = useState<Address | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  async function handleDelete() {
    if (!addressToDelete) return;
    try {
      await deleteAddress.mutateAsync(addressToDelete.id);
      toast.success("Dirección eliminada");
      setAddressToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la dirección",
      );
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {addresses && addresses.length > 0 ? (
        addresses.map((address) => (
          <Card key={address.id}>
            <CardContent className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">
                  {address.fullName}
                </span>
                {address.isDefault && <Badge variant="secondary">Predeterminada</Badge>}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatAddressLine(address)}
              </div>
              <div className="text-sm text-muted-foreground">
                {address.phone}
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDialogAddress(address);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil />
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAddressToDelete(address)}
                >
                  <Trash2 />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="rounded-xl border border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          Aún no tienes direcciones guardadas.
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setDialogAddress(null);
          setDialogOpen(true);
        }}
      >
        <Plus />
        Agregar dirección
      </Button>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setDialogAddress(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAddress ? "Editar dirección" : "Agregar dirección"}
            </DialogTitle>
          </DialogHeader>
          <AddressForm
            mode={dialogAddress ? "edit" : "create"}
            initialValues={dialogAddress ?? undefined}
            onSuccess={() => {
              toast.success("Dirección guardada");
              setDialogOpen(false);
              setDialogAddress(null);
            }}
            onCancel={() => {
              setDialogOpen(false);
              setDialogAddress(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!addressToDelete}
        onOpenChange={(open) => {
          if (!open) setAddressToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta dirección?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteAddress.isPending}
            >
              {deleteAddress.isPending ? "Eliminando…" : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
