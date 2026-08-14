import { EXPRESS_API_URL } from "@/lib/auth/constants";

export async function fetchExpress<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${EXPRESS_API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}
