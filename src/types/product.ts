export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  currency: string;
  thumbnailUrl: string | null;
  categoryName: string;
  images?: { id: string; url: string; altText: string | null }[];
}

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
