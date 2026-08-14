import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Restablecer contraseña · Hally Boutique",
  description: "Crea una nueva contraseña para tu cuenta de Hally Boutique.",
  path: "/restablecer-password",
  noindex: true,
});

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
