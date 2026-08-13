import { NextResponse } from "next/server";

import { authenticatedFetch } from "@/lib/auth/serverAuth";

type Context = {
  params: Promise<{ id: string; variantId: string }>;
};

export async function PATCH(request: Request, context: Context) {
  const { id, variantId } = await context.params;
  const body = await request.json();
  const result = await authenticatedFetch(
    `/products/${id}/variants/${variantId}`,
    { method: "PATCH", body: JSON.stringify(body) },
  );
  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        error:
          result.data?.error ?? {
            message: "No se pudo actualizar la variante",
          },
      },
      { status: result.status },
    );
  }
  return NextResponse.json({ success: true, data: result.data.data });
}

export async function DELETE(request: Request, context: Context) {
  const { id, variantId } = await context.params;
  const result = await authenticatedFetch(
    `/products/${id}/variants/${variantId}`,
    { method: "DELETE" },
  );
  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        error:
          result.data?.error ?? {
            message: "No se pudo eliminar la variante",
          },
      },
      { status: result.status },
    );
  }
  return NextResponse.json({ success: true, data: null });
}
