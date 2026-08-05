import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/categorias", label: "Categorías" },
];

export function Header() {
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

        <Button variant="ghost" size="icon" aria-label="Carrito de compras" asChild>
          <Link href="/carrito">
            <ShoppingCart />
          </Link>
        </Button>
      </div>
    </header>
  );
}
