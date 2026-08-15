"use client";

import Link from "next/link";

import { useSession } from "@/hooks/useSession";
import {
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/shared/SocialIcons";

const socialLinks = [
  {
    href: "https://www.instagram.com/hallyboutique?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    label: "Instagram de Hally Boutique",
    Icon: InstagramIcon,
  },
  {
    href: "https://www.tiktok.com/@hallyboutique_?is_from_webapp=1&sender_device=pc",
    label: "TikTok de Hally Boutique",
    Icon: TikTokIcon,
  },
];

const whatsappUrl = "https://wa.me/573225754134";
const whatsappNumber = "322 575 4134";

export function Footer() {
  const { isAuthenticated } = useSession();

  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-display text-base font-bold text-foreground">
              Hally Boutique
            </p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Moda de baño con estilo tropical.
            </p>
            <div className="mt-3 flex items-center gap-2">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Tienda
            </h4>
            <ul className="mt-2 flex flex-col gap-1.5">
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Mi cuenta
            </h4>
            <ul className="mt-2 flex flex-col gap-1.5">
              {isAuthenticated ? (
                <li>
                  <Link
                    href="/cuenta"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Mi cuenta
                  </Link>
                </li>
              ) : (
                <>
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
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Contacto
            </h4>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <WhatsAppIcon className="size-4 shrink-0" />
              {whatsappNumber}
            </a>
            <p className="mt-1 text-xs text-muted-foreground">
              Escríbenos por WhatsApp
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Hally Boutique. Todos los derechos reservados.</p>
          <nav className="flex items-center gap-4">
            <Link href="/terminos" className="hover:text-foreground">
              Términos y condiciones
            </Link>
            <Link href="/privacidad" className="hover:text-foreground">
              Política de privacidad
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
