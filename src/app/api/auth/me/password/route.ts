import { NextResponse } from "next/server";
import { authenticatedFetch } from "@/lib/auth/serverAuth";

export async function PATCH(request: Request) {
  const body = await request.json();
  const result = await authenticatedFetch("/auth/me/password", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        error:
          result.data?.error ?? {
            message: "No se pudo cambiar la contraseña",
          },
      },
      { status: result.status },
    );
  }
  return NextResponse.json({ success: true, data: result.data.data });
}
