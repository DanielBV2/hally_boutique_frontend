import { NextRequest, NextResponse } from "next/server";
import { EXPRESS_API_URL } from "@/lib/auth/constants";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const response = await fetch(`${EXPRESS_API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await response.json();
  return NextResponse.json(json, { status: response.status });
}
