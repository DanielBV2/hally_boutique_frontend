"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ProductForm } from "@/components/admin/ProductForm";
import { VariantForm } from "@/components/admin/VariantForm";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  useAddProductImageMutation,
  useAdminProductVariants,
  useDeleteProductMutation,
  useDeleteVariantMutation,
  useRemoveProductImageMutation,
} from "@/hooks/useAdminProducts";
import { useProduct } from "@/hooks/useProduct";
import { formatCOP } from "@/lib/format";
import type { AdminVariant } from "@/types/product";

export default function AdminProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const { data: product, isLoading, isError } = useProduct(slug);
  const productId = product?.id ?? "";
  const { data: variants, isLoading: variantsLoading } =
    useAdminProductVariants(productId);

  const addImage = useAddProductImageMutation(slug);
  const removeImage = useRemoveProductImageMutation(slug);
  const deleteProduct = useDeleteProductMutation();
  const deleteVariant = useDeleteVariantMutation(productId, slug);

  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [addingImage, setAddingImage] = useState(false);

  const [variantDialogOpen, setVariantDialogOpen] = useState(false);
  const [variantToEdit, setVariantToEdit] = useState<AdminVariant | null>(null);
  const [variantToDelete, setVariantToDelete] = useState<AdminVariant | null>(
    null,
  );

  const [deleteProductOpen, setDeleteProductOpen] = useState(false);

  async function handleAddImage() {
    if (!product) return;
    setAddingImage(true);
    try {
      await addImage.mutateAsync({
        id: product.id,
        input: {
          url: imageUrl,
          ...(imageAlt.trim() ? { altText: imageAlt.trim() } : {}),
        },
      });
      toast.success("Imagen agregada");
      setImageUrl("");
      setImageAlt("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo agregar la imagen",
      );
    } finally {
      setAddingImage(false);
    }
  }

  async function handleRemoveImage(imageId: string) {
    if (!product) return;
    try {
      await removeImage.mutateAsync({ id: product.id, imageId });
      toast.success("Imagen eliminada");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo eliminar la imagen",
      );
    }
  }

  async function handleDeleteVariant() {
    if (!variantToDelete) return;
    try {
      await deleteVariant.mutateAsync(variantToDelete.id);
      toast.success("Variante eliminada");
      setVariantToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo eliminar la variante",
      );
    }
  }

  async function handleDeleteProduct() {
    if (!product) return;
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success("Producto eliminado");
      router.push("/admin/productos");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo eliminar el producto",
      );
      setDeleteProductOpen(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">Producto no encontrado.</p>
        <Button variant="outline" onClick={() => router.push("/admin/productos")}>
          Volver a productos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/productos"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Productos
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            {product.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            /{product.slug} · {product.category.name}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button asChild variant="outline">
            <Link href={`/productos/${product.slug}`} target="_blank" rel="noopener noreferrer">
              Ver en tienda
            </Link>
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setDeleteProductOpen(true)}
          >
            <Trash2 />
            Eliminar producto
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="images">
            Imágenes ({product.images.length})
          </TabsTrigger>
          <TabsTrigger value="variants">
            Variantes ({variants?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del producto</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm
                mode="edit"
                initialValues={product}
                slug={slug}
                onSuccess={() => toast.success("Producto actualizado")}
              />
            </CardContent>
          </Card>
        </TabsContent>

      <TabsContent value="images" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Imágenes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
          {product.images.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {product.images.map((image) => (
                <div
                  key={image.id}
                  className="group relative h-24 w-24 overflow-hidden rounded-lg border border-border bg-muted"
                >
                  <Image
                    src={image.url}
                    alt={image.altText ?? product.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image.id)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Eliminar imagen"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Este producto aún no tiene imágenes.
            </p>
          )}

          <div className="flex flex-wrap items-end gap-2 border-t border-border pt-4">
            <Input
              placeholder="URL de la imagen"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              className="w-72"
            />
            <Input
              placeholder="Texto alternativo (opcional)"
              value={imageAlt}
              onChange={(event) => setImageAlt(event.target.value)}
              className="w-64"
            />
            <Button
              type="button"
              onClick={handleAddImage}
              disabled={addingImage || !imageUrl.trim()}
            >
              <Plus />
              {addingImage ? "Agregando…" : "Agregar imagen"}
            </Button>
          </div>
        </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="variants" className="mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Variantes</CardTitle>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setVariantToEdit(null);
              setVariantDialogOpen(true);
            }}
          >
            <Plus />
            Nueva variante
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {variantsLoading ? (
            <div className="space-y-2 p-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : variants && variants.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Talla</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant) => (
                  <TableRow key={variant.id}>
                    <TableCell className="font-medium">{variant.size}</TableCell>
                    <TableCell>{variant.color}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {variant.sku}
                    </TableCell>
                    <TableCell
                      className={
                        variant.stock === 0
                          ? "text-right text-destructive"
                          : "text-right"
                      }
                    >
                      {variant.stock}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCOP(variant.finalPrice)}
                    </TableCell>
                    <TableCell>
                      {variant.isActive ? (
                        <Badge>Activa</Badge>
                      ) : (
                        <Badge variant="secondary">Inactiva</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setVariantToEdit(variant);
                            setVariantDialogOpen(true);
                          }}
                        >
                          <Pencil />
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setVariantToDelete(variant)}
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
          ) : (
            <p className="p-4 text-sm text-muted-foreground">
              Este producto aún no tiene variantes.
            </p>
          )}
        </CardContent>
        </Card>
      </TabsContent>
      </Tabs>

      <Dialog
        open={variantDialogOpen}
        onOpenChange={(open) => {
          setVariantDialogOpen(open);
          if (!open) setVariantToEdit(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {variantToEdit ? "Editar variante" : "Nueva variante"}
            </DialogTitle>
          </DialogHeader>
          {variantToEdit ? (
            <VariantForm
              mode="edit"
              initialValues={variantToEdit}
              productId={product.id}
              slug={slug}
              basePrice={product.basePrice}
              currency={product.currency}
              onSuccess={() => {
                setVariantDialogOpen(false);
                setVariantToEdit(null);
              }}
              onCancel={() => {
                setVariantDialogOpen(false);
                setVariantToEdit(null);
              }}
            />
          ) : (
            <VariantForm
              mode="create"
              productId={product.id}
              slug={slug}
              basePrice={product.basePrice}
              currency={product.currency}
              onSuccess={() => setVariantDialogOpen(false)}
              onCancel={() => setVariantDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!variantToDelete}
        onOpenChange={(open) => {
          if (!open) setVariantToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta variante?</AlertDialogTitle>
            <AlertDialogDescription>
              La variante {variantToDelete?.size} / {variantToDelete?.color}{" "}
              dejará de estar disponible en la tienda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVariant}
              disabled={deleteVariant.isPending}
            >
              {deleteVariant.isPending ? "Eliminando…" : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteProductOpen}
        onOpenChange={setDeleteProductOpen}
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
              onClick={handleDeleteProduct}
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
