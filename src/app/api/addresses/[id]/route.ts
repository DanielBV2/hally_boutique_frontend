import { NextRequest, NextResponse } from "next/server";

import { authenticatedFetch } from "@/lib/auth/serverAuth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const result = await authenticatedFetch(`/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return NextResponse.json(result.data, { status: result.status });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await authenticatedFetch(`/addresses/${id}`, {
    method: "DELETE",
  });
  return NextResponse.json(result.data, { status: result.status });
}
