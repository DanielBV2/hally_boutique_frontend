import { NextResponse } from "next/server";
import { authenticatedFetch } from "@/lib/auth/serverAuth";

export async function GET() {
  const result = await authenticatedFetch("/auth/me");
  if (!result.ok) {
    return NextResponse.json({ success: true, data: null }); // no autenticado, no es un error
  }
  return NextResponse.json({ success: true, data: result.data.data });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const result = await authenticatedFetch("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        error:
          result.data?.error ?? {
            message: "No se pudo actualizar el perfil",
          },
      },
      { status: result.status },
    );
  }
  return NextResponse.json({ success: true, data: result.data.data });
}
