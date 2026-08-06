import { NextResponse } from "next/server";
import { authenticatedFetch } from "@/lib/auth/serverAuth";

export async function GET() {
  const result = await authenticatedFetch("/auth/me");
  if (!result.ok) {
    return NextResponse.json({ success: true, data: null }); // no autenticado, no es un error
  }
  return NextResponse.json({ success: true, data: result.data.data });
}
