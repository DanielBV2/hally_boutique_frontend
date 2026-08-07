export interface CartItem {
  id: string;
  variantId: string;
  productName: string;
  productSlug: string;
  size: string;
  color: string;
  thumbnailUrl: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  availableStock: number;
  isAvailable: boolean;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface AddCartItemInput {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}
