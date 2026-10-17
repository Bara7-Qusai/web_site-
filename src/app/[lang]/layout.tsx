import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { CompareTray, type CompareIndex } from "@/components/CompareTray";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteConfig } from "@/config/site";
import { products } from "@/data/products";
import { dir, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#115230",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: dict.meta.defaultTitle, template: `%s | ${dict.meta.siteName}` },
    description: dict.meta.description,
    applicationName: dict.meta.siteName,
    formatDetection: { telephone: false },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const compareIndex: CompareIndex = Object.fromEntries(products.map((p) => [p.slug, { name: p.name[lang], image: p.image }]));

  return (
    <html lang={lang} dir={dir(lang)}>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader locale={lang} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={lang} />
        <CompareTray locale={lang} index={compareIndex} />
      </body>
    </html>
  );
}
