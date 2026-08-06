import { NextRequest, NextResponse } from "next/server";
import { EXPRESS_API_URL } from "@/lib/auth/constants";
import { setAuthCookies } from "@/lib/auth/serverAuth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const response = await fetch(`${EXPRESS_API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await response.json();
  if (!response.ok) {
    return NextResponse.json(json, { status: response.status });
  }
  const { accessToken, refreshToken, user } = json.data;
  await setAuthCookies(accessToken, refreshToken);
  return NextResponse.json(
    { success: true, data: { user } },
    { status: response.status }
  );
}
