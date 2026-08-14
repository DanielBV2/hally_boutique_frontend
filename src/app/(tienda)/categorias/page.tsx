import { CategoriesContent } from "@/components/categories/CategoriesContent";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Categorías · Hally Boutique",
  description:
    "Explora las categorías de moda de baño de Hally Boutique: vestidos de baño, bikinis y más.",
  path: "/categorias",
});

export default function CategoriesPage() {
  return <CategoriesContent />;
}
