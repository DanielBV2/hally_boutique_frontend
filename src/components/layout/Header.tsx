"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, ShoppingCart, User } from "lucide-react";

import { MobileNav } from "@/components/layout/MobileNav";
import { CategoriesFlyout } from "@/components/layout/CategoriesFlyout";
import { SearchBar } from "@/components/layout/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/hooks/useCart";
import { useLogoutMutation } from "@/hooks/useLogout";
import { useSession } from "@/hooks/useSession";
import { useCartDrawerStore } from "@/stores/useCartDrawerStore";

export function Header() {
  const { user, isAuthenticated } = useSession();
  const { data: cart } = useCart();
  const toggleCart = useCartDrawerStore((state) => state.toggle);
  const logoutMutation = useLogoutMutation();

  const totalItems = cart?.totalItems ?? 0;
  const showBadge = isAuthenticated && totalItems > 0;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <MobileNav />

        <Link href="/" className="shrink-0">
          <span className="titulo text-lg sm:text-xl">Hally Boutique</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Button variant="ghost" asChild>
            <Link href="/productos">Tienda</Link>
          </Button>
          <CategoriesFlyout />
        </nav>

        <div className="flex items-center gap-1">
          <SearchBar />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Mi cuenta">
                  <User />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild>
                  <Link href="/cuenta">Mi cuenta</Link>
                </DropdownMenuItem>
                {user?.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <LayoutDashboard />
                      Panel admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={logoutMutation.isPending}
                  onSelect={(event) => {
                    event.preventDefault();
                    logoutMutation.mutate();
                  }}
                >
                  <LogOut />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" aria-label="Iniciar sesión" asChild>
              <Link href="/login">
                <User />
              </Link>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            aria-label="Carrito de compras"
            onClick={toggleCart}
            className="relative"
          >
            <ShoppingCart />
            {showBadge && (
              <Badge className="absolute -right-1 -top-1 h-4 min-w-4 px-1 text-[10px] leading-none">
                {totalItems}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
