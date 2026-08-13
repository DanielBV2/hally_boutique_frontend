export interface LowStockVariant {
  id: string;
  productName: string;
  size: string;
  color: string;
  stock: number;
}

export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  totalCustomers: number;
  lowStockVariants: LowStockVariant[];
}
