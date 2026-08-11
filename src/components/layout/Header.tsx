"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";

import { MobileNav } from "@/components/layout/MobileNav";
import { CategoriesFlyout } from "@/components/layout/CategoriesFlyout";
import { SearchBar } from "@/components/layout/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useSession } from "@/hooks/useSession";
import { useCartDrawerStore } from "@/stores/useCartDrawerStore";

export function Header() {
  const { isAuthenticated } = useSession();
  const { data: cart } = useCart();
  const toggleCart = useCartDrawerStore((state) => state.toggle);

  const totalItems = cart?.totalItems ?? 0;
  const showBadge = isAuthenticated && totalItems > 0;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <MobileNav />

        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Hally Boutique"
            width={300}
            height={100}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Button variant="ghost" asChild>
            <Link href="/productos">Productos</Link>
          </Button>
          <CategoriesFlyout />
        </nav>

        <div className="flex items-center gap-1">
          <SearchBar />

          <Button
            variant="ghost"
            size="icon"
            aria-label={isAuthenticated ? "Mi cuenta" : "Iniciar sesión"}
            asChild
          >
            <Link href={isAuthenticated ? "/cuenta" : "/login"}>
              <User />
            </Link>
          </Button>

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
