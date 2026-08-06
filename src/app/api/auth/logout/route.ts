import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { REFRESH_TOKEN_COOKIE, EXPRESS_API_URL } from "@/lib/auth/constants";
import { clearAuthCookies } from "@/lib/auth/serverAuth";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  if (refreshToken) {
    await fetch(`${EXPRESS_API_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {}); // no bloquear el logout local si esto falla
  }
  await clearAuthCookies();
  return NextResponse.json({ success: true, data: null });
}
