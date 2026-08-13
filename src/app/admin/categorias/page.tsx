"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CategoryForm } from "@/components/admin/CategoryForm";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAdminCategories,
  useDeleteCategoryMutation,
} from "@/hooks/useAdminCategories";
import type { Category } from "@/types/category";

const PAGE_SIZE = 20;

export default function AdminCategoriesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminCategories({
    page,
    limit: PAGE_SIZE,
    isActive: true,
  });
  const deleteCategory = useDeleteCategoryMutation();

  const [dialogCategory, setDialogCategory] = useState<Category | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  async function handleDelete() {
    if (!categoryToDelete) return;
    try {
      await deleteCategory.mutateAsync(categoryToDelete.id);
      toast.success("Categoría eliminada");
      setCategoryToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la categoría",
      );
    }
  }

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.limit))
    : 1;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-40 rounded-md" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  if (!data || (data.items.length === 0 && data.page === 1)) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Categorías</h1>
          <Button
            type="button"
            onClick={() => {
              setDialogCategory(null);
              setDialogOpen(true);
            }}
          >
            <Plus />
            Nueva categoría
          </Button>
        </div>
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No hay categorías registradas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Categorías</h1>
        <Button
          type="button"
          onClick={() => {
            setDialogCategory(null);
            setDialogOpen(true);
          }}
        >
          <Plus />
          Nueva categoría
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    /{category.slug}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {category.description ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDialogCategory(category);
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
                        onClick={() => setCategoryToDelete(category)}
                      >
                        <Trash2 />
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {data.page} de {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Siguiente
          </Button>
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setDialogCategory(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogCategory ? "Editar categoría" : "Nueva categoría"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            mode={dialogCategory ? "edit" : "create"}
            initialValues={dialogCategory ?? undefined}
            onSuccess={() => {
              toast.success(
                dialogCategory
                  ? "Categoría actualizada"
                  : "Categoría creada",
              );
              setDialogOpen(false);
              setDialogCategory(null);
            }}
            onCancel={() => {
              setDialogOpen(false);
              setDialogCategory(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => {
          if (!open) setCategoryToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta categoría?</AlertDialogTitle>
            <AlertDialogDescription>
              La categoría dejará de estar visible en la tienda. Esta acción no
              se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteCategory.isPending}
            >
              {deleteCategory.isPending ? "Eliminando…" : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
