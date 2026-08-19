"use client";

import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AddressForm } from "@/components/checkout/AddressForm";
import { EmptyState } from "@/components/shared/EmptyState";
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
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-4 text-muted-foreground" />
              Mis direcciones
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setDialogAddress(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="size-4" />
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {addresses && addresses.length > 0 ? (
            <div className="flex flex-col gap-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/40"
                >
                  <div className="flex min-w-0 gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                      <MapPin className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {address.fullName}
                        </span>
                        {address.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Predeterminada
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatAddressLine(address)}
                      </span>
                      {address.phone && (
                        <span className="text-sm text-muted-foreground">
                          {address.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setDialogAddress(address);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="size-3.5" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setAddressToDelete(address)}
                    >
                      <Trash2 className="size-3.5" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MapPin}
              title="Sin direcciones"
              description="Agrega tu primera dirección de envío para facilitar tus compras."
              action={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDialogAddress(null);
                    setDialogOpen(true);
                  }}
                >
                  <Plus className="size-4" />
                  Agregar dirección
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

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
