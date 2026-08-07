import { NextRequest, NextResponse } from "next/server";

import { authenticatedFetch } from "@/lib/auth/serverAuth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await authenticatedFetch("/orders", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return NextResponse.json(result.data, { status: result.status });
}
