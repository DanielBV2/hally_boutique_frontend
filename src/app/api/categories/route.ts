import { NextResponse } from "next/server";

import { EXPRESS_API_URL } from "@/lib/auth/constants";

export async function GET() {
  const response = await fetch(`${EXPRESS_API_URL}/categories`);
  const json = await response.json();
  return NextResponse.json(json, { status: response.status });
}
