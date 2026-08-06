import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  EXPRESS_API_URL,
} from "./constants";

async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15, // 15 minutos
    path: "/",
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 días
    path: "/",
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

async function tryRefresh(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) return null;

  const response = await fetch(`${EXPRESS_API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    await clearAuthCookies();
    return null;
  }

  const json = await response.json();
  const { accessToken, refreshToken: newRefreshToken } = json.data;
  await setAuthCookies(accessToken, newRefreshToken);
  return accessToken;
}

/**
 * Helper central para llamar a Express desde cualquier Route Handler que
 * necesite autenticación. Maneja refresh automático en caso de 401.
 * NUNCA exponer el resultado crudo de esto directo al cliente sin filtrar
 * los tokens si algún día se necesitara devolver algo con ellos (no debería
 * pasar, esta función siempre se usa server-side).
 */
export async function authenticatedFetch(
  path: string,
  options: RequestInit = {}
) {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    accessToken = (await tryRefresh()) ?? undefined;
    if (!accessToken) {
      return { ok: false, status: 401, data: null };
    }
  }

  let response = await fetch(`${EXPRESS_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    const newAccessToken = await tryRefresh();
    if (!newAccessToken) {
      return { ok: false, status: 401, data: null };
    }
    response = await fetch(`${EXPRESS_API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newAccessToken}`,
        ...options.headers,
      },
    });
  }

  const json = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, data: json };
}

export { setAuthCookies };
