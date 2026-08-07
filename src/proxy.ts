import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { REFRESH_TOKEN_COOKIE } from "@/lib/auth/constants";

export function proxy(request: NextRequest) {
  if (request.cookies.has(REFRESH_TOKEN_COOKIE)) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  const redirectTo = encodeURIComponent(pathname + search);
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = `?redirect=${redirectTo}`;
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/cuenta/:path*", "/checkout/:path*"],
};
