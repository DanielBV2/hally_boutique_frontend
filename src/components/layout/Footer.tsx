"use client";

import Link from "next/link";

import { useSession } from "@/hooks/useSession";

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://tiktok.com", label: "TikTok" },
];

export function Footer() {
  const { isAuthenticated } = useSession();

  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Tienda</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                href="/productos"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Productos
              </Link>
            </li>
            <li>
              <Link
                href="/categorias"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Categorías
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Mi cuenta
          </h3>
          {isAuthenticated ? (
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/cuenta"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Mi cuenta
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link
                  href="/registro"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Crear cuenta
                </Link>
              </li>
            </ul>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Síguenos
          </h3>
          <ul className="flex flex-col gap-2">
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Hally Boutique. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
