import type { Metadata } from "next";
import Image from "next/image";
import { DataTableView } from "@/components/DataTableView";
import { PrintButton } from "@/components/PrintButton";
import { categories } from "@/data/categories";
import { company, branches } from "@/data/company";
import { productsInCategory } from "@/data/products";
import type { Locale } from "@/data/types";
import { isLocale, otherLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

/** Print-optimized full catalog. Used to generate /downloads/al-kunooz-catalog-{ar,en}.pdf. */
export async function generateMetadata({ params }: PageProps<"/[lang]/catalog">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return { ...pageMetadata(lang, "/catalog", { title: d.catalog.title }), robots: { index: false, follow: true } };
}

export default async function PrintableCatalog({ params }: PageProps<"/[lang]/catalog">) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const p = dict.product;
  const other = otherLocale(locale);

  return (
    <div className="catalog-print bg-white">
      <div className="no-print container-x flex justify-end py-4">
        <PrintButton label={locale === "ar" ? "طباعة / حفظ PDF" : "Print / Save as PDF"} />
      </div>

      {/* Cover */}
      <section className="print-page relative flex min-h-[90vh] flex-col justify-between overflow-hidden bg-forest-800 p-12 text-white print:h-[268mm] print:min-h-0">
        <div className="brand-arcs absolute inset-0" />
        <div className="relative">
          <Image src="/images/brand/logo-white.png" alt={company.name[locale]} width={1614} height={511} className="h-20 w-auto" />
        </div>
        <div className="relative">
          <p className="text-leaf-400">{locale === "ar" ? "الملف التعريفي ودليل المنتجات" : "Company Profile & Product Catalog"}</p>
          <h1 className="mt-3 text-5xl font-bold">{company.name[locale]}</h1>
          <p className="mt-2 text-2xl text-white/80">{company.tagline[locale]}</p>
          <p className="mt-1 text-lg text-white/60" lang={other}>{company.tagline[other]}</p>
        </div>
        <div className="relative rounded-2xl bg-white p-4">
          <Image src="/images/brand/product-lineup.jpg" alt="" width={1400} height={480} className="h-auto w-full" />
        </div>
      </section>

      {/* About */}
      <section className="print-page mx-auto max-w-4xl px-10 py-12">
        <h2 className="text-3xl font-bold text-forest-900">{dict.about.title}</h2>
        {company.about.map((a, i) => (
          <p key={i} className="mt-4 leading-relaxed text-ink-700">{a[locale]}</p>
        ))}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-leaf-50 p-5">
            <h3 className="font-bold text-forest-800">{dict.about.vision}</h3>
            <p className="mt-2 text-sm">{company.vision[locale]}</p>
          </div>
          <div className="rounded-xl bg-leaf-50 p-5">
            <h3 className="font-bold text-forest-800">{dict.about.mission}</h3>
            <p className="mt-2 text-sm">{company.mission[locale]}</p>
          </div>
        </div>
        <h3 className="mt-8 font-bold text-forest-900">{dict.contact.branches}</h3>
        <p className="mt-2 text-sm text-ink-700">
          {branches.map((b) => `${b.city[locale]}${b.label ? ` (${b.label[locale]})` : ""}`).join(" · ")}
        </p>
      </section>

      {categories.map((c) => (
        <section key={c.id} className="mx-auto max-w-4xl px-10 py-8 print:break-before-page">
          <div className="rounded-2xl bg-forest-800 px-6 py-5 text-white">
            <p className="ltr-num text-sm text-leaf-400">{String(c.section).padStart(2, "0")}</p>
            <h2 className="text-2xl font-bold">{c.name[locale]}</h2>
            <p className="mt-1 text-sm text-white/75">{c.description[locale]}</p>
          </div>
          {productsInCategory(c.id).map((prod) => (
            <article key={prod.slug} className="mt-6 grid grid-cols-[7rem_1fr] gap-5 border-b border-sand-200 pb-6 break-inside-avoid">
              <div className="relative size-28 overflow-hidden rounded-xl bg-sand-50">
                <Image src={prod.image} alt="" fill sizes="112px" className="object-contain p-1.5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-forest-900">
                  <span className="ltr-num text-sm text-ink-500">#{String(prod.number).padStart(2, "0")}</span> {prod.name[locale]}
                </h3>
                <p className="text-sm text-ink-500" lang={other}>{prod.name[other]}</p>
                <p className="mt-2 text-sm">
                  {prod.formulation && (
                    <>
                      <strong>{p.formulation}:</strong> <span className="ltr-num">{prod.formulation}</span> ·{" "}
                    </>
                  )}
                  <strong>{p.packages}:</strong> {prod.packages ? prod.packages.map((k) => k[locale]).join("، ") : p.packagesPending}
                </p>
                {prod.composition && (
                  <p className="mt-1 text-sm">
                    <strong>{p.composition}{prod.basis ? ` (${prod.basis})` : ""}:</strong>{" "}
                    {prod.composition.map((r) => `${r.label[locale]} ${r.value}`).join(" · ")}
                  </p>
                )}
                {prod.formulations && (
                  <p className="mt-1 text-sm">
                    <strong>{p.formulations}:</strong> <span className="ltr-num">{prod.formulations.join(" · ")}</span>
                  </p>
                )}
                {prod.compositionTables?.map((t, i) => (
                  <div key={i} className="mt-2 text-xs">
                    <DataTableView table={t} locale={locale} />
                  </div>
                ))}
                <ul className="mt-2 list-disc space-y-0.5 ps-5 text-sm text-ink-700">
                  {prod.benefits.map((b, i) => (
                    <li key={i}>{b[locale]}</li>
                  ))}
                </ul>
                {prod.rates && (
                  <div className="mt-2 text-xs">
                    <DataTableView table={prod.rates} locale={locale} />
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>
      ))}

      <section className="mx-auto max-w-4xl px-10 py-10 print:break-before-page">
        <p className="rounded-xl bg-sand-100 p-4 text-xs text-ink-500">{p.infoNote}</p>
      </section>
    </div>
  );
}
