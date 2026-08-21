"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { ExternalLink } from "lucide-react";

import { AppSidebar } from "@/components/admin/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { User } from "@/types/user";

const SECTION_LABELS: Record<string, string> = {
  ordenes: "Órdenes",
  productos: "Productos",
  categorias: "Categorías",
  usuarios: "Usuarios",
};

function getCrumbs(pathname: string): { label: string; href?: string }[] {
  if (pathname === "/admin") return [{ label: "" }];
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href?: string }[] = [
    { label: "Dashboard", href: "/admin" },
  ];
  const section = segments[1];
  crumbs.push({
    label: SECTION_LABELS[section] ?? section,
    href: `/admin/${section}`,
  });
  if (segments[2]) {
    const value = segments[2];
    crumbs.push({
      label: value.length > 24 ? `#${value.slice(0, 8)}` : value,
    });
  }
  return crumbs;
}

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const pathname = usePathname();
  const crumbs = getCrumbs(pathname);

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <header className="flex h-10 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((crumb, index) => {
                  const isLast = index === crumbs.length - 1;
                  return (
                    <Fragment key={crumb.label}>
                      {index > 0 && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                      <BreadcrumbItem>
                        {isLast || !crumb.href ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={crumb.href}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="ml-auto text-muted-foreground"
            >
              <Link href="/">
                <ExternalLink />
                Ver tienda
              </Link>
            </Button>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
