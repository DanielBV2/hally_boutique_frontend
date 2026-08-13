import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { getSessionUserServerSide } from "@/lib/auth/serverAuth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUserServerSide();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  return <AdminShell>{children}</AdminShell>;
}
