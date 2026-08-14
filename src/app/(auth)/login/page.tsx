import { Suspense } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Iniciar sesión · Hally Boutique",
  description: "Accede a tu cuenta de Hally Boutique.",
  path: "/login",
  noindex: true,
});

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
