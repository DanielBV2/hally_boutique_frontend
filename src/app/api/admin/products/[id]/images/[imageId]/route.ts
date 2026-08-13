import { NextResponse } from "next/server";

import { authenticatedFetch } from "@/lib/auth/serverAuth";

type Context = { params: Promise<{ id: string; imageId: string }> };

export async function DELETE(request: Request, context: Context) {
  const { id, imageId } = await context.params;
  const result = await authenticatedFetch(`/products/${id}/images/${imageId}`, {
    method: "DELETE",
  });
  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        error:
          result.data?.error ?? {
            message: "No se pudo eliminar la imagen",
          },
      },
      { status: result.status },
    );
  }
  return NextResponse.json({ success: true, data: null });
}
