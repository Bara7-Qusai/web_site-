import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CompareActions } from "@/components/CompareActions";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { categoryById } from "@/data/categories";
import { getProduct } from "@/data/products";
import type { Locale, Product } from "@/data/types";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/compare">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang).compare;
  return { ...pageMetadata(lang, "/compare", { title: d.title, description: d.lead }), robots: { index: false, follow: true } };
}

export default async function ComparePage({ params, searchParams }: PageProps<"/[lang]/compare">) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const d = dict.compare;
  const p = dict.product;
  const sp = await searchParams;
  const raw = typeof sp.items === "string" ? sp.items : "";
  const items = [...new Set(raw.split(","))]
    .map((s) => getProduct(s.trim()))
    .filter((x): x is Product => !!x)
    .slice(0, 3);

  const rows: { label: string; render: (x: Product) => React.ReactNode }[] = [
    { label: p.category, render: (x) => categoryById[x.category].name[locale] },
    { label: p.form, render: (x) => x.form?.[locale] ?? "—" },
    { label: p.formulation, render: (x) => <span className="ltr-num">{x.formulation ?? (x.formulations ? x.formulations.join(" · ") : "—")}</span> },
    { label: p.basis, render: (x) => <span className="ltr-num">{x.basis ?? "—"}</span> },
    {
      label: p.composition,
      render: (x) =>
        x.composition ? (
          <ul className="space-y-1">
            {x.composition.map((r) => (
              <li key={r.label.en} className="flex justify-between gap-3">
                <span>{r.label[locale]}</span>
                <span className="ltr-num font-semibold text-forest-800">{r.value}</span>
              </li>
            ))}
          </ul>
        ) : x.compositionTables ? (
          <Link href={href(locale, `/products/${x.slug}`)} className="text-forest-800 underline">{dict.common.viewDetails}</Link>
        ) : (
          "—"
        ),
    },
    { label: p.packages, render: (x) => (x.packages ? x.packages.map((k) => k[locale]).join(" · ") : p.packagesPending) },
    { label: p.keyFeature, render: (x) => x.keyFeature?.[locale] ?? "—" },
    {
      label: p.benefits,
      render: (x) => (
        <ul className="list-disc space-y-1 ps-4">
          {x.benefits.map((b, i) => (
            <li key={i}>{b[locale]}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <>
      <PageHero locale={locale} title={d.title} lead={d.lead} crumbs={[{ label: dict.nav.products, href: href(locale, "/products") }, { label: d.title }]} />
      <div className="container-x pb-24 pt-8">
        <CompareActions locale={locale} items={items.map((x) => ({ slug: x.slug, name: x.name[locale] }))} />
        {items.length === 0 ? (
          <div className="card flex flex-col items-center gap-4 p-12 text-center">
            <Icon name="compare" className="size-12 text-sand-300" />
            <p className="max-w-md text-ink-700">{d.empty}</p>
            <Link href={href(locale, "/products")} className="btn btn-primary">{dict.common.exploreProducts}</Link>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl bg-white ring-1 ring-sand-200">
            <table className="w-full min-w-[42rem] border-collapse text-sm">
              <thead>
                <tr>
                  <th scope="col" className="w-44 bg-sand-50 p-4 text-start text-xs font-semibold text-ink-500">{d.attribute}</th>
                  {items.map((x) => (
                    <th key={x.slug} scope="col" className="p-4 text-start align-top">
                      <Link href={href(locale, `/products/${x.slug}`)} className="group block">
                        <span className="relative mb-3 block aspect-square w-28 overflow-hidden rounded-xl bg-sand-50">
                          <Image src={x.image} alt="" fill sizes="112px" className="object-contain p-2" />
                        </span>
                        <span className="block text-base font-bold text-forest-900 group-hover:underline">{x.name[locale]}</span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-t border-sand-200">
                    <th scope="row" className="bg-sand-50 p-4 text-start align-top text-xs font-semibold text-ink-500">{r.label}</th>
                    {items.map((x) => (
                      <td key={x.slug} className="p-4 align-top leading-relaxed text-ink-700">{r.render(x)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
