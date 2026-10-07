import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompareToggle } from "@/components/CompareToggle";
import { DataTableView } from "@/components/DataTableView";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { whatsappLink } from "@/config/site";
import { categoryById } from "@/data/categories";
import { getProduct, products } from "@/data/products";
import type { Locale } from "@/data/types";
import { href, isLocale, locales, otherLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { catalogItems, needsForProduct } from "@/lib/catalog";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => products.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/products/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!isLocale(lang) || !product) return {};
  const cat = categoryById[product.category];
  const lead = (product.keyFeature ?? product.benefits[0])[lang];
  return pageMetadata(lang, `/products/${slug}`, {
    title: `${product.name[lang]} — ${cat.name[lang]}`,
    description: `${product.name[lang]} (${product.name[otherLocale(lang)]}): ${lead}`.slice(0, 300),
    image: product.image,
  });
}

export default async function ProductPage({ params }: PageProps<"/[lang]/products/[slug]">) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const product = getProduct(slug);
  if (!product) notFound();

  const dict = getDictionary(locale);
  const d = dict.product;
  const cat = categoryById[product.category];
  const other = otherLocale(locale);
  const wa = whatsappLink(d.whatsappMessage(`${product.name[locale]} (#${product.number})`));
  const needs = needsForProduct(product);
  const related = catalogItems(locale)
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);
  const isDilution = product.slug === "endolin-iba";

  const specs: { label: string; value: React.ReactNode }[] = [
    { label: d.category, value: cat.name[locale] },
    ...(product.form ? [{ label: d.form, value: product.form[locale] }] : []),
    ...(product.formulation ? [{ label: d.formulation, value: <span className="ltr-num">{product.formulation}</span> }] : []),
    ...(product.basis ? [{ label: d.basis, value: <span className="ltr-num">{product.basis}</span> }] : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name[locale],
    alternateName: product.name[other],
    image: absoluteUrl(product.image),
    description: (product.keyFeature ?? product.benefits[0])[locale],
    category: cat.name[locale],
    sku: `AK-${String(product.number).padStart(2, "0")}`,
    url: absoluteUrl(href(locale, `/products/${product.slug}`)),
    ...(product.category === "private-label" ? { brand: { "@type": "Brand", name: "Al-Kunooz" } } : {}),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.nav.home, item: absoluteUrl(href(locale)) },
      { "@type": "ListItem", position: 2, name: dict.nav.products, item: absoluteUrl(href(locale, "/products")) },
      { "@type": "ListItem", position: 3, name: product.name[locale] },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbLd]) }} />

      <div className="border-b border-sand-200 bg-white">
        <nav aria-label={d.breadcrumb} className="container-x py-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
            <li>
              <Link href={href(locale)} className="hover:text-forest-800">{dict.nav.home}</Link>
            </li>
            <li aria-hidden="true"><Icon name="arrow" className="size-3.5 rtl:-scale-x-100" /></li>
            <li>
              <Link href={href(locale, "/products")} className="hover:text-forest-800">{dict.nav.products}</Link>
            </li>
            <li aria-hidden="true"><Icon name="arrow" className="size-3.5 rtl:-scale-x-100" /></li>
            <li>
              <Link href={`${href(locale, "/products")}?category=${cat.id}`} className="hover:text-forest-800">{cat.name[locale]}</Link>
            </li>
            <li aria-hidden="true"><Icon name="arrow" className="size-3.5 rtl:-scale-x-100" /></li>
            <li aria-current="page" className="font-semibold text-ink-900">{product.name[locale]}</li>
          </ol>
        </nav>
      </div>

      {/* ───────────── Overview ───────────── */}
      <section className="container-x grid gap-10 py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14 lg:py-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-sand-50 to-leaf-50 ring-1 ring-sand-200 shadow-card">
            <Image
              src={product.image}
              alt={`${product.name[locale]} — ${cat.name[locale]}`}
              fill
              priority
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-contain p-8"
            />
            <span className="ltr-num absolute top-4 start-4 rounded-full bg-forest-800 px-3 py-1 text-xs font-bold text-white">
              #{String(product.number).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div>
          <p className="eyebrow">{cat.name[locale]}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-forest-900 sm:text-4xl">{product.name[locale]}</h1>
          <p className="mt-2 text-lg text-ink-500" lang={other} dir={other === "ar" ? "rtl" : "ltr"}>
            {product.name[other]}
          </p>
          {product.subtitle && <p className="mt-3 font-semibold text-leaf-600">{product.subtitle[locale]}</p>}

          {product.keyFeature && (
            <div className="mt-6 flex gap-3 rounded-2xl bg-leaf-50 p-5 ring-1 ring-leaf-200">
              <Icon name="star" className="mt-0.5 size-5 shrink-0 text-leaf-600" />
              <div>
                <p className="text-sm font-bold text-forest-800">{d.keyFeature}</p>
                <p className="mt-1 leading-relaxed text-ink-700">{product.keyFeature[locale]}</p>
              </div>
            </div>
          )}

          <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-sand-200 ring-1 ring-sand-200 sm:grid-cols-2">
            {specs.map((s) => (
              <div key={s.label} className="bg-white p-4">
                <dt className="text-xs font-semibold text-ink-500">{s.label}</dt>
                <dd className="mt-1 font-semibold text-ink-900">{s.value}</dd>
              </div>
            ))}
            <div className="bg-white p-4 sm:col-span-2">
              <dt className="text-xs font-semibold text-ink-500">{d.packages}</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {product.packages ? (
                  product.packages.map((p) => (
                    <span key={p.en} className="inline-flex items-center gap-1.5 rounded-full bg-forest-800 px-3 py-1 text-sm font-semibold text-white">
                      <Icon name="package" className="size-4" />
                      {p[locale]}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-900 ring-1 ring-amber-200">{d.packagesPending}</span>
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`${href(locale, "/contact")}?product=${product.slug}&type=product`} className="btn btn-primary">
              {dict.common.requestInfo}
            </Link>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <Icon name="whatsapp" className="size-5" />
                {dict.common.whatsapp}
              </a>
            )}
            <CompareToggle slug={product.slug} locale={locale} variant="button" />
          </div>

          {product.pesticide && (
            <div role="note" className="mt-6 flex gap-3 rounded-2xl bg-amber-50 p-5 text-amber-950 ring-1 ring-amber-200">
              <Icon name="alert" className="mt-0.5 size-5 shrink-0" />
              <p className="text-sm leading-relaxed">{d.pesticideWarning}</p>
            </div>
          )}

          {/* ───────────── Technical sections ───────────── */}
          <div className="mt-10 space-y-10">
            {(product.composition || product.compositionTables) && (
              <section aria-labelledby="composition">
                <h2 id="composition" className="flex items-center gap-2 text-xl font-bold text-forest-900">
                  <Icon name="atom" className="size-5 text-leaf-600" />
                  {d.composition}
                  {product.basis && <span className="ltr-num rounded-md bg-sand-100 px-2 py-0.5 text-xs font-semibold text-ink-500">{product.basis}</span>}
                </h2>
                {product.composition && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th scope="col">{d.element}</th>
                          <th scope="col">{d.value}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.composition.map((r) => (
                          <tr key={r.label.en}>
                            <th scope="row" className="font-medium text-ink-900">{r.label[locale]}</th>
                            <td className="ltr-num font-semibold text-forest-800">{r.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {product.compositionNote && <p className="mt-3 text-sm text-ink-700">{product.compositionNote[locale]}</p>}
                {product.compositionTables?.map((t, i) => (
                  <div key={i} className="mt-4">
                    <DataTableView table={t} locale={locale} />
                  </div>
                ))}
              </section>
            )}

            {product.formulations && (
              <section aria-labelledby="formulations">
                <h2 id="formulations" className="flex items-center gap-2 text-xl font-bold text-forest-900">
                  <Icon name="layers" className="size-5 text-leaf-600" />
                  {d.formulations}
                </h2>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {product.formulations.map((f) => (
                    <li key={f} className="ltr-num rounded-xl bg-white px-4 py-3 text-sm font-semibold text-forest-800 ring-1 ring-sand-200">
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="benefits">
              <h2 id="benefits" className="flex items-center gap-2 text-xl font-bold text-forest-900">
                <Icon name="sprout" className="size-5 text-leaf-600" />
                {d.benefits}
              </h2>
              <ul className="mt-4 space-y-3">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed text-ink-700">
                    <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-leaf-500 text-white">
                      <Icon name="check" className="size-3.5" strokeWidth={3} />
                    </span>
                    {b[locale]}
                  </li>
                ))}
              </ul>
            </section>

            {product.usage && (
              <section aria-labelledby="usage">
                <h2 id="usage" className="flex items-center gap-2 text-xl font-bold text-forest-900">
                  <Icon name="droplet" className="size-5 text-leaf-600" />
                  {d.usage}
                </h2>
                <p className="mt-4 leading-relaxed text-ink-700">{product.usage[locale]}</p>
              </section>
            )}

            {product.rates && (
              <section aria-labelledby="rates">
                <h2 id="rates" className="flex items-center gap-2 text-xl font-bold text-forest-900">
                  <Icon name="flower" className="size-5 text-leaf-600" />
                  {isDilution ? d.dilution : d.rates}
                </h2>
                <div className="mt-4">
                  <DataTableView table={product.rates} locale={locale} />
                </div>
              </section>
            )}

            {product.precautions && (
              <section aria-labelledby="precautions">
                <h2 id="precautions" className="flex items-center gap-2 text-xl font-bold text-forest-900">
                  <Icon name="shield" className="size-5 text-leaf-600" />
                  {d.precautions}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {product.precautions.map((p, i) => (
                    <li key={i} className="flex gap-3 text-ink-700">
                      <Icon name="alert" className="mt-0.5 size-4 shrink-0 text-soil-500" />
                      {p[locale]}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {needs.length > 0 && (
              <section aria-labelledby="needs">
                <h2 id="needs" className="text-sm font-bold text-ink-500">{d.usedFor}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {needs.map((n) => (
                    <li key={n.id}>
                      <Link href={`${href(locale, "/solutions")}#${n.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-forest-800 ring-1 ring-leaf-200 hover:bg-leaf-50">
                        <Icon name={n.icon} className="size-4" />
                        {n.title[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <p className="flex gap-2 rounded-xl bg-sand-100 p-4 text-xs leading-relaxed text-ink-500">
              <Icon name="info" className="size-4 shrink-0" />
              {d.infoNote}
            </p>
          </div>
        </div>
      </section>

      {/* ───────────── Inquiry band ───────────── */}
      <section className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-forest-800 p-8 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-bold">{d.inquiryTitle}</h2>
            <p className="mt-2 text-white/75">{d.inquiryText}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`${href(locale, "/contact")}?product=${product.slug}&type=product`} className="btn btn-leaf">
              {dict.common.requestInfo}
            </Link>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <Icon name="whatsapp" className="size-5" />
                {dict.common.whatsappShort}
              </a>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x py-20" aria-labelledby="related">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="related" className="text-2xl font-bold text-forest-900 sm:text-3xl">{d.related}</h2>
            <Link href={`${href(locale, "/products")}?category=${cat.id}`} className="text-sm font-semibold text-forest-800 hover:underline">
              {dict.common.viewAll} — {cat.name[locale]}
            </Link>
          </div>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <ProductCard item={item} locale={locale} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
