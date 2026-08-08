export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderItem {
  id: string;
  productName: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderListItem {
  id: string;
  status: OrderStatus;
  total: number;
  currency: string;
  itemsCount: number;
  createdAt: string;
}

export interface PaginatedOrders {
  items: OrderListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface CheckoutParams {
  publicKey: string;
  currency: string;
  amountInCents: number;
  reference: string;
  signature: string;
  redirectUrl: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  currency: string;
  items: OrderItem[];
  shippingAddressId: string;
  shippingFullName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingPostalCode: string | null;
  shippingCarrier: string | null;
  shippingService: string | null;
  shippingTrackingNumber: string | null;
  shippingLabelUrl: string | null;
  createdAt: string;
}
