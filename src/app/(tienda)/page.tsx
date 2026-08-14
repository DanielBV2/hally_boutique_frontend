import { HomeContent } from "@/components/home/HomeContent";
import { pageSeo } from "@/lib/seo";
import { SITE_DESCRIPTION } from "@/lib/constants/site";

export const metadata = pageSeo({
  title: "Hally Boutique — Moda de baño tropical",
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  return <HomeContent />;
}
