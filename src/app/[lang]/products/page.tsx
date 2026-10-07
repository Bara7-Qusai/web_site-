import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { categories } from "@/data/categories";
import { crossListedIn, productsInCategory } from "@/data/products";
import { solutions } from "@/data/solutions";
import type { CategoryId, Locale } from "@/data/types";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { catalogItems } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/products">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang).catalog;
  return pageMetadata(lang, "/products", { title: d.title, description: d.lead });
}

export default async function ProductsPage({ params }: PageProps<"/[lang]/products">) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);

  const items = catalogItems(locale);
  const facets = categories.map((c) => ({ id: c.id, label: c.name[locale], count: productsInCategory(c.id).length }));
  const needs = solutions.map((s) => ({ id: s.id, label: s.title[locale] }));
  const crossListed: Partial<Record<CategoryId, { slug: string; name: string }[]>> = {};
  for (const c of categories) {
    const extra = crossListedIn(c.id);
    if (extra.length) crossListed[c.id] = extra.map((p) => ({ slug: p.slug, name: p.name[locale] }));
  }

  return (
    <>
      <PageHero locale={locale} title={dict.catalog.title} lead={dict.catalog.lead} crumbs={[{ label: dict.nav.products }]}>
        <a href={`/downloads/al-kunooz-catalog-${locale}.pdf`} download className="btn btn-ghost-light mt-8">
          <Icon name="download" className="size-4" />
          {dict.common.downloadCatalog}
        </a>
      </PageHero>
      <section className="container-x pb-24 pt-8">
        <CatalogBrowser locale={locale} items={items} categories={facets} needs={needs} crossListed={crossListed} />
      </section>
    </>
  );
}
