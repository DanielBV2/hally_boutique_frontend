import type { Metadata } from "next";

import { SITE_NAME, SITE_URL } from "@/lib/constants/site";

interface PageSeoOptions {
  title: string;
  description?: string;
  path?: string;
  noindex?: boolean;
  images?: string[];
}

export function pageSeo({
  title,
  description,
  path = "/",
  noindex = false,
  images = [],
}: PageSeoOptions): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "es_CO",
      images: images.length
        ? images.map((imageUrl) => ({ url: imageUrl }))
        : undefined,
    },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}
