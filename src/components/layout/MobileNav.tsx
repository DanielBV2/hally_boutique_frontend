"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";
import { useLogoutMutation } from "@/hooks/useLogout";
import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useSession();
  const { data: categories, isLoading } = useCategories();
  const logoutMutation = useLogoutMutation();

  const close = () => setOpen(false);
  const isProductosActive = pathname.startsWith("/productos");

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Abrir menú"
        className="lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="flex flex-col gap-0 p-0">
          <SheetHeader className="border-b border-border px-4 py-4">
            <SheetTitle>
              <Link href="/" onClick={close} className="block w-fit">
                <span className="titulo text-base">Hally Boutique</span>
              </Link>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="flex flex-col gap-1">
              <Link
                href="/productos"
                onClick={close}
                aria-current={isProductosActive ? "page" : undefined}
                className={cn(
                  "rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  isProductosActive
                    ? "text-primary"
                    : "text-foreground hover:text-foreground"
                )}
              >
                Productos
              </Link>

              <p className="px-2 pt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Categorías
              </p>
              {isLoading ? (
                <div className="flex flex-col gap-2 px-2 py-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              ) : categories && categories.length > 0 ? (
                <ul className="flex flex-col">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/productos?categoryId=${category.id}`}
                        onClick={close}
                        className="block rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <Link
                  href="/categorias"
                  onClick={close}
                  className="rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Ver todas las categorías
                </Link>
              )}
            </nav>

            <Separator className="my-4" />

            <nav className="flex flex-col gap-1">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/cuenta"
                    onClick={close}
                    className="rounded-md px-2 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Mi cuenta
                  </Link>
                  {user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={close}
                      className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      <LayoutDashboard className="size-4" />
                      Panel admin
                    </Link>
                  )}
                  <button
                    type="button"
                    disabled={logoutMutation.isPending}
                    onClick={() => {
                      logoutMutation.mutate();
                      close();
                    }}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                  >
                    <LogOut className="size-4" />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={close}
                    className="rounded-md px-2 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/registro"
                    onClick={close}
                    className="rounded-md px-2 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Crear cuenta
                  </Link>
                </>
              )}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
