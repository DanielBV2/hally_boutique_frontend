import { NextResponse } from "next/server";

import { authenticatedFetch } from "@/lib/auth/serverAuth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = new URLSearchParams();
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  if (page) query.set("page", page);
  if (limit) query.set("limit", limit);
  if (status) query.set("status", status);
  if (search) query.set("search", search);
  const queryString = query.toString();

  const result = await authenticatedFetch(
    `/orders/admin/all${queryString ? `?${queryString}` : ""}`,
  );
  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        error:
          result.data?.error ?? {
            message: "No se pudieron cargar las órdenes",
          },
      },
      { status: result.status },
    );
  }
  return NextResponse.json({ success: true, data: result.data.data });
}
