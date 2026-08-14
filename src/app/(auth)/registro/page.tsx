import { Suspense } from "react";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Crear cuenta · Hally Boutique",
  description: "Crea tu cuenta en Hally Boutique y empieza a comprar.",
  path: "/registro",
  noindex: true,
});

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
