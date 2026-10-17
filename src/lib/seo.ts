import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/data/types";
import { href, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/** Absolute URL for a site path. */
export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}

/** Shared metadata: canonical + hreflang alternates + Open Graph. */
export function pageMetadata(
  locale: Locale,
  path: string,
  { title, description, image }: { title?: string; description?: string; image?: string } = {},
): Metadata {
  const dict = getDictionary(locale);
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = href(l, path);
  languages["x-default"] = href("ar", path);
  const desc = description ?? dict.meta.description;
  return {
    title: title ?? { absolute: dict.meta.defaultTitle },
    description: desc,
    alternates: { canonical: href(locale, path), languages },
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      locale: locale === "ar" ? "ar_SD" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_SD",
      url: href(locale, path),
      title: title ?? dict.meta.defaultTitle,
      description: desc,
      images: [{ url: image ?? "/images/brand/product-lineup.jpg" }],
    },
    twitter: { card: "summary_large_image" },
  };
}
