"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Package, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ProductForm } from "@/components/admin/ProductForm";
import { AdminSearchInput } from "@/components/admin/AdminSearchInput";
import { EmptyState } from "@/components/admin/EmptyState";
import { PageHeader } from "@/components/admin/PageHeader";
import { ResultsSummary } from "@/components/admin/ResultsSummary";
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
import { Switch } from "@/components/ui/switch";
import { Pagination } from "@/components/shared/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories } from "@/hooks/useCategories";
import {
  useAdminProducts,
  useDeleteProductMutation,
  useToggleProductActiveMutation,
} from "@/hooks/useAdminProducts";
import { formatCOP } from "@/lib/format";
import type { ProductListItem } from "@/types/product";

const PAGE_SIZE = 20;

export default function AdminProductsPage() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAdminProducts({
    page,
    limit: PAGE_SIZE,
    categoryId: categoryId === "all" ? undefined : categoryId,
    search: search || undefined,
  });
  const deleteProduct = useDeleteProductMutation();
  const toggleActive = useToggleProductActiveMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductListItem | null>(
    null,
  );
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleToggle(product: ProductListItem, isActive: boolean) {
    setTogglingId(product.id);
    try {
      await toggleActive.mutateAsync({ id: product.id, isActive });
      toast.success(
        isActive ? "Producto activado" : "Producto desactivado",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo cambiar el estado del producto",
      );
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!productToDelete) return;
    try {
      await deleteProduct.mutateAsync(productToDelete.id);
      toast.success("Producto eliminado");
      setProductToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el producto",
      );
    }
  }

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.limit))
    : 1;
  const isEmpty = !data || (data.items.length === 0 && data.page === 1);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Productos"
        description="Gestiona el catálogo de la tienda. Desactiva un producto para ocultarlo en la tienda."
        actions={
          <>
            <AdminSearchInput
              placeholder="Buscar por nombre de producto…"
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
            <Select
              value={categoryId}
              onValueChange={(value) => {
                setCategoryId(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={() => setDialogOpen(true)}>
              <Plus />
              Nuevo producto
            </Button>
          </>
        }
      />

      {isLoading ? (
        <>
          <Skeleton className="h-10 w-64 rounded-md" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </>
      ) : isEmpty ? (
        <EmptyState
          icon={Package}
          title="Sin productos"
          description="No hay productos con el filtro seleccionado."
        />
      ) : (
        <>
          <ResultsSummary
            page={data.page}
            limit={data.limit}
            total={data.total}
            label="productos"
          />
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((product) => (
                    <TableRow
                      key={product.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        router.push(`/admin/productos/${product.slug}`)
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                            {product.thumbnailUrl ? (
                              <Image
                                src={product.thumbnailUrl}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                                Sin img
                              </span>
                            )}
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.categoryName}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCOP(product.basePrice)}
                      </TableCell>
                      <TableCell>
                        <div
                          className="flex items-center"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Switch
                            checked={product.isActive}
                            onCheckedChange={(checked) =>
                              handleToggle(product, checked)
                            }
                            disabled={togglingId === product.id}
                            aria-label={
                              product.isActive
                                ? `Desactivar ${product.name}`
                                : `Activar ${product.name}`
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(event) => {
                              event.stopPropagation();
                              router.push(`/admin/productos/${product.slug}`);
                            }}
                          >
                            Ver
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(event) => {
                              event.stopPropagation();
                              setProductToDelete(product);
                            }}
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
            <Pagination
              page={data.page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo producto</DialogTitle>
          </DialogHeader>
          <ProductForm
            mode="create"
            onSuccess={(product) => {
              toast.success("Producto creado");
              setDialogOpen(false);
              router.push(`/admin/productos/${product.slug}`);
            }}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(open) => {
          if (!open) setProductToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este producto?</AlertDialogTitle>
            <AlertDialogDescription>
              El producto dejará de estar visible en la tienda. Esta acción no
              se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? "Eliminando…" : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
