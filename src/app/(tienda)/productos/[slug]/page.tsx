import type { Metadata } from "next";

import { ProductDetail } from "@/components/products/ProductDetail";
import { fetchExpress } from "@/lib/api/server";
import { pageSeo } from "@/lib/seo";
import type { ProductDetail as ProductDetailDTO } from "@/types/product";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchExpress<ProductDetailDTO>(`/products/${slug}`);

  if (!product) {
    return pageSeo({
      title: "Producto no encontrado · Hally Boutique",
      path: `/productos/${slug}`,
      noindex: true,
    });
  }

  const primaryImage = product.images?.[0]?.url;

  return pageSeo({
    title: `${product.name} · Hally Boutique`,
    description: product.description
      ? product.description.slice(0, 160)
      : `Producto de moda de baño de Hally Boutique.`,
    path: `/productos/${product.slug}`,
    images: primaryImage ? [primaryImage] : [],
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchExpress<ProductDetailDTO>(`/products/${slug}`);
  return <ProductDetail slug={slug} initialProduct={product ?? undefined} />;
}
