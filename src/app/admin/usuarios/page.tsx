"use client";

import { useState } from "react";
import { Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/EmptyState";
import { AdminSearchInput } from "@/components/admin/AdminSearchInput";
import { PageHeader } from "@/components/shared/PageHeader";
import { ResultsSummary } from "@/components/shared/ResultsSummary";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { formatShortDate } from "@/lib/format";

const PAGE_SIZE = 20;

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [role, setRole] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAdminUsers({
    page,
    limit: PAGE_SIZE,
    role: role === "all" ? undefined : (role as "CUSTOMER" | "ADMIN"),
    search: search || undefined,
  });

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.limit))
    : 1;
  const isEmpty = !data || (data.items.length === 0 && data.page === 1);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Usuarios"
        description="Cuentas registradas en la tienda."
        actions={
          <>
            <AdminSearchInput
              placeholder="Buscar por nombre o correo…"
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
            <Select
              value={role}
              onValueChange={(value) => {
                setRole(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="CUSTOMER">Clientes</SelectItem>
                <SelectItem value="ADMIN">Administradores</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      {isLoading ? (
        <>
          <Skeleton className="h-10 w-44 rounded-md" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </>
      ) : isEmpty ? (
        <EmptyState
          icon={Users}
          title="Sin usuarios"
          description="No hay usuarios con el filtro seleccionado."
        />
      ) : (
        <>
          <ResultsSummary
            page={data.page}
            limit={data.limit}
            total={data.total}
            label="usuarios"
          />
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Registrado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        {user.role === "ADMIN" ? (
                          <Badge variant="default">Admin</Badge>
                        ) : (
                          <Badge variant="secondary">Cliente</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatShortDate(user.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <Pagination
              page={data.page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
