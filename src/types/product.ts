export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  currency: string;
  thumbnailUrl: string | null;
  secondaryImageUrl: string | null;
  categoryName: string;
  images?: { id: string; url: string; altText: string | null }[];
  hasStock: boolean;
}

export interface PaginatedProducts {
  items: ProductListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductInput {
  name: string;
  description: string;
  basePrice: number;
  currency?: string;
  weightGrams?: number;
  categoryId: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
}

export interface AdminVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
  priceDelta: number;
  finalPrice: number;
  isActive: boolean;
}

export interface VariantInput {
  size: string;
  color: string;
  sku: string;
  stock?: number;
  priceDelta?: number;
}

export type ProductSizes = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  inStock: boolean;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  currency: string;
  category: { id: string; name: string; slug: string };
  images: { id: string; url: string; altText: string | null }[];
  variants: ProductVariant[];
}
