import type { MetadataRoute } from "next";
import * as Sentry from "@sentry/nextjs";

import { SITE_URL } from "@/lib/constants/site";
import { fetchExpress } from "@/lib/api/server";
import type { PaginatedProducts } from "@/types/product";

const STATIC_PATHS = ["/", "/productos", "/categorias", "/terminos", "/privacidad"];

const PAGE_LIMIT = 50;
const MAX_PAGES = 50;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  let page = 1;
  let pagesFetched = 0;

  while (pagesFetched < MAX_PAGES) {
    const data = await fetchExpress<PaginatedProducts>(
      `/products?page=${page}&limit=${PAGE_LIMIT}`,
    );

    if (!data) {
      Sentry.captureMessage(
        "sitemap: fallo al obtener productos para el catálogo",
        { extra: { page, limit: PAGE_LIMIT } },
      );
      break;
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      break;
    }

    for (const product of data.items) {
      entries.push({ url: `${SITE_URL}/productos/${product.slug}` });
    }

    if (data.items.length < PAGE_LIMIT) {
      break;
    }

    page += 1;
    pagesFetched += 1;
  }

  return entries;
}
