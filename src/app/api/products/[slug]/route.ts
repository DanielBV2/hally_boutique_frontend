import { NextRequest, NextResponse } from "next/server";

import { EXPRESS_API_URL } from "@/lib/auth/constants";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const response = await fetch(`${EXPRESS_API_URL}/products/${slug}`);
  const json = await response.json();
  return NextResponse.json(json, { status: response.status });
}
