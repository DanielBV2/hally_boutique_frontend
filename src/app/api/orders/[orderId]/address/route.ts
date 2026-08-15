import { NextRequest, NextResponse } from "next/server";
import { authenticatedFetch } from "@/lib/auth/serverAuth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const body = await req.json();
  const result = await authenticatedFetch(`/orders/${orderId}/address`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return NextResponse.json(result.data, { status: result.status });
}
