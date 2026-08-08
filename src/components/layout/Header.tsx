"use client";

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useSession } from "@/hooks/useSession";
import { useCartDrawerStore } from "@/stores/useCartDrawerStore";

const navLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/categorias", label: "Categorías" },
];

export function Header() {
  const { isAuthenticated } = useSession();
  const { data: cart } = useCart();
  const toggleCart = useCartDrawerStore((state) => state.toggle);

  const totalItems = cart?.totalItems ?? 0;
  const showBadge = isAuthenticated && totalItems > 0;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-foreground">
          Hally Boutique
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

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
    </header>
  );
}
