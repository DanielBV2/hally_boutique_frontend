import { NextRequest, NextResponse } from "next/server";

import { EXPRESS_API_URL } from "@/lib/auth/constants";

export async function GET(req: NextRequest) {
  const queryString = req.nextUrl.searchParams.toString();
  const response = await fetch(
    `${EXPRESS_API_URL}/products${queryString ? `?${queryString}` : ""}`,
  );
  const json = await response.json();
  return NextResponse.json(json, { status: response.status });
}
