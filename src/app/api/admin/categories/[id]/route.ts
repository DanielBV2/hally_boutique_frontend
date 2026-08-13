import { NextResponse } from "next/server";

import { authenticatedFetch } from "@/lib/auth/serverAuth";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json();
  const result = await authenticatedFetch(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        error:
          result.data?.error ?? {
            message: "No se pudo actualizar la categoría",
          },
      },
      { status: result.status },
    );
  }
  return NextResponse.json({ success: true, data: result.data.data });
}

export async function DELETE(request: Request, context: Context) {
  const { id } = await context.params;
  const result = await authenticatedFetch(`/categories/${id}`, {
    method: "DELETE",
  });
  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        error:
          result.data?.error ?? {
            message: "No se pudo eliminar la categoría",
          },
      },
      { status: result.status },
    );
  }
  return NextResponse.json({ success: true, data: null });
}
