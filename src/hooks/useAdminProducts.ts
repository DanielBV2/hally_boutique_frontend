"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addProductImage,
  createProduct,
  createVariant,
  deleteProduct,
  deleteVariant,
  getAdminProducts,
  getAdminVariants,
  removeProductImage,
  updateProduct,
  updateVariant,
  type AdminProductsParams,
} from "@/lib/api/products";
import type { ProductInput, VariantInput } from "@/types/product";

function invalidateProductQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
  queryClient.invalidateQueries({ queryKey: ["products"] });
}

function invalidateProductDetail(queryClient: ReturnType<typeof useQueryClient>, slug: string) {
  queryClient.invalidateQueries({ queryKey: ["product", slug] });
}

export function useAdminProducts(params: AdminProductsParams = {}) {
  return useQuery({
    queryKey: [
      "admin",
      "products",
      params.page,
      params.limit,
      params.categoryId,
      params.search,
    ],
    queryFn: () => getAdminProducts(params),
  });
}

export function useAdminProductVariants(productId: string) {
  return useQuery({
    queryKey: ["admin", "product-variants", productId],
    queryFn: () => getAdminVariants(productId),
    enabled: !!productId,
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductInput) => createProduct(input),
    onSuccess: () => invalidateProductQueries(queryClient),
  });
}

export function useUpdateProductMutation(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ProductInput> }) =>
      updateProduct(id, input),
    onSuccess: () => {
      invalidateProductQueries(queryClient);
      invalidateProductDetail(queryClient, slug);
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => invalidateProductQueries(queryClient),
  });
}

export function useAddProductImageMutation(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: { url: string; altText?: string; position?: number };
    }) => addProductImage(id, input),
    onSuccess: () => invalidateProductDetail(queryClient, slug),
  });
}

export function useRemoveProductImageMutation(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, imageId }: { id: string; imageId: string }) =>
      removeProductImage(id, imageId),
    onSuccess: () => invalidateProductDetail(queryClient, slug),
  });
}

export function useCreateVariantMutation(productId: string, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VariantInput) => createVariant(productId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "product-variants", productId],
      });
      invalidateProductDetail(queryClient, slug);
    },
  });
}

export function useUpdateVariantMutation(productId: string, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      variantId,
      input,
    }: {
      variantId: string;
      input: Partial<VariantInput & { isActive: boolean }>;
    }) => updateVariant(productId, variantId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "product-variants", productId],
      });
      invalidateProductDetail(queryClient, slug);
    },
  });
}

export function useDeleteVariantMutation(productId: string, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variantId: string) => deleteVariant(productId, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "product-variants", productId],
      });
      invalidateProductDetail(queryClient, slug);
    },
  });
}
