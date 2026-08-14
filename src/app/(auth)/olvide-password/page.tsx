import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Recuperar contraseña · Hally Boutique",
  description: "Solicita un enlace para restablecer tu contraseña.",
  path: "/olvide-password",
  noindex: true,
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
