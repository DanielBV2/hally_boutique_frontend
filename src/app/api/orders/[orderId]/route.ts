import { NextRequest, NextResponse } from "next/server";
import { authenticatedFetch } from "@/lib/auth/serverAuth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const result = await authenticatedFetch(`/orders/${orderId}`, {
    method: "GET",
  });
  return NextResponse.json(result.data, { status: result.status });
}
