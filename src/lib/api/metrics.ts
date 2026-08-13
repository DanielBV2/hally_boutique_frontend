import { apiFetch } from "@/lib/api/client";
import type { DashboardMetrics } from "@/types/metrics";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return apiFetch<DashboardMetrics>("/api/admin/metrics");
}
