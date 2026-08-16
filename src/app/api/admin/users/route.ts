import { NextResponse } from "next/server";

import { authenticatedFetch } from "@/lib/auth/serverAuth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = new URLSearchParams();
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const role = searchParams.get("role");
  const search = searchParams.get("search");
  if (page) query.set("page", page);
  if (limit) query.set("limit", limit);
  if (role) query.set("role", role);
  if (search) query.set("search", search);
  const queryString = query.toString();

  const result = await authenticatedFetch(
    `/auth/admin/all${queryString ? `?${queryString}` : ""}`,
  );
  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        error:
          result.data?.error ?? {
            message: "No se pudieron cargar los usuarios",
          },
      },
      { status: result.status },
    );
  }
  return NextResponse.json({ success: true, data: result.data.data });
}
