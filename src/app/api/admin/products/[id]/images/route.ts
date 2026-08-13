import { NextResponse } from "next/server";

import { authenticatedFetch } from "@/lib/auth/serverAuth";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json();
  const result = await authenticatedFetch(`/products/${id}/images`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        error:
          result.data?.error ?? {
            message: "No se pudo agregar la imagen",
          },
      },
      { status: result.status },
    );
  }
  return NextResponse.json({ success: true, data: null });
}
