import { NextResponse } from "next/server";

import { authenticatedFetch } from "@/lib/auth/serverAuth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = new URLSearchParams();
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const isActive = searchParams.get("isActive");
  if (page) query.set("page", page);
  if (limit) query.set("limit", limit);
  if (isActive) query.set("isActive", isActive);
  const queryString = query.toString();

  const result = await authenticatedFetch(
    `/categories/admin/all${queryString ? `?${queryString}` : ""}`,
  );
  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        error:
          result.data?.error ?? {
            message: "No se pudieron cargar las categorías",
          },
      },
      { status: result.status },
    );
  }
  return NextResponse.json({ success: true, data: result.data.data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await authenticatedFetch("/categories", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        error:
          result.data?.error ?? {
            message: "No se pudo crear la categoría",
          },
      },
      { status: result.status },
    );
  }
  return NextResponse.json({ success: true, data: result.data.data });
}
