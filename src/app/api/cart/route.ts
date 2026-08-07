import { NextResponse } from "next/server";
import { authenticatedFetch } from "@/lib/auth/serverAuth";

export async function GET() {
  const result = await authenticatedFetch("/cart", { method: "GET" });
  return NextResponse.json(result.data, { status: result.status });
}

export async function DELETE() {
  const result = await authenticatedFetch("/cart", { method: "DELETE" });
  return NextResponse.json(result.data, { status: result.status });
}
