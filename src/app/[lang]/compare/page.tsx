import type { Metadata } from "next";
import { CompareView, type CompareProduct } from "@/components/CompareView";
import { PageHero } from "@/components/PageHero";
import { categoryById } from "@/data/categories";
import { products } from "@/data/products";
import type { Locale } from "@/data/types";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/compare">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang).compare;
  return { ...pageMetadata(lang, "/compare", { title: d.title, description: d.lead }), robots: { index: false, follow: true } };
}

/**
 * Static page: the selected products are read in the browser (?items=… or the saved list),
 * so the page also works as plain HTML without a server.
 */
export default async function ComparePage({ params }: PageProps<"/[lang]/compare">) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const d = dict.compare;

  const data: CompareProduct[] = products.map((x) => ({
    slug: x.slug,
    name: x.name[locale],
    image: x.image,
    category: categoryById[x.category].name[locale],
    form: x.form?.[locale] ?? null,
    formulation: x.formulation ?? (x.formulations ? x.formulations.join(" · ") : null),
    basis: x.basis ?? null,
    composition: x.composition?.map((r) => ({ label: r.label[locale], value: r.value })) ?? null,
    hasTables: !!x.compositionTables,
    packages: x.packages ? x.packages.map((k) => k[locale]) : null,
    keyFeature: x.keyFeature?.[locale] ?? null,
    benefits: x.benefits.map((b) => b[locale]),
  }));

  return (
    <>
      <PageHero locale={locale} title={d.title} lead={d.lead} crumbs={[{ label: dict.nav.products, href: href(locale, "/products") }, { label: d.title }]} />
      <div className="container-x pb-24 pt-8">
        <CompareView locale={locale} products={data} />
      </div>
    </>
  );
}
