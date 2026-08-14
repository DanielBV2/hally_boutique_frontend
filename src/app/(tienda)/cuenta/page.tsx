import { CuentaContent } from "@/components/account/CuentaContent";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Mi cuenta · Hally Boutique",
  description: "Gestiona tu perfil, direcciones y pedidos en Hally Boutique.",
  path: "/cuenta",
  noindex: true,
});

export default function CuentaPage() {
  return <CuentaContent />;
}
