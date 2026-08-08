import { NextRequest, NextResponse } from "next/server";
import { authenticatedFetch } from "@/lib/auth/serverAuth";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const result = await authenticatedFetch(`/orders/${orderId}/checkout`, {
    method: "POST",
  });
  return NextResponse.json(result.data, { status: result.status });
}
