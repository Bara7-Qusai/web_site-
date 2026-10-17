export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { href, locales } from "@/i18n/config";
import { absoluteUrl } from "@/lib/seo";

const PAGES = ["/", "/about", "/products", "/solutions", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...PAGES, ...products.map((p) => `/products/${p.slug}`)];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(href(locale, path)),
      changeFrequency: path.startsWith("/products/") ? ("monthly" as const) : ("weekly" as const),
      priority: path === "/" ? 1 : path.startsWith("/products/") ? 0.7 : 0.8,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(href(l, path))])) },
    })),
  );
}
