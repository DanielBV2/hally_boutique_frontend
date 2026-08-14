import { Suspense } from "react";

import {
  ConfirmacionContent,
  Spinner,
} from "@/components/checkout/ConfirmacionContent";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Confirmación de pedido · Hally Boutique",
  description: "Confirma el estado de tu pedido en Hally Boutique.",
  path: "/checkout/confirmacion",
  noindex: true,
});

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={<Spinner text="" />}>
      <ConfirmacionContent />
    </Suspense>
  );
}
