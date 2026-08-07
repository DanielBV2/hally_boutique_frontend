import { NextRequest, NextResponse } from "next/server";

import { authenticatedFetch } from "@/lib/auth/serverAuth";

export async function GET() {
  const result = await authenticatedFetch("/addresses", { method: "GET" });
  return NextResponse.json(result.data, { status: result.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await authenticatedFetch("/addresses", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return NextResponse.json(result.data, { status: result.status });
}
