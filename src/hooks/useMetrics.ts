"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardMetrics } from "@/lib/api/metrics";

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["admin", "metrics"],
    queryFn: getDashboardMetrics,
  });
}
