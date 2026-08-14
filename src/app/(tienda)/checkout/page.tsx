import { CheckoutContent } from "@/components/checkout/CheckoutContent";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Finalizar compra · Hally Boutique",
  description: "Completa tu compra de moda de baño en Hally Boutique.",
  path: "/checkout",
  noindex: true,
});

export default function CheckoutPage() {
  return <CheckoutContent />;
}
