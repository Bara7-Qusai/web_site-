import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { categories } from "@/data/categories";
import { branches, company } from "@/data/company";
import { products, productsInCategory } from "@/data/products";
import type { Locale } from "@/data/types";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang).about;
  return pageMetadata(lang, "/about", { title: d.title, description: company.about[0][lang] });
}

const VALUE_ICONS = ["star", "droplet", "handshake", "leaf"];
const FIELD_ICONS = ["droplet", "atom", "leaf", "shield"];

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const d = dict.about;

  return (
    <>
      <PageHero locale={locale} title={d.title} lead={d.lead} crumbs={[{ label: dict.nav.about }]} />

      <section className="container-x grid gap-12 py-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-16">
        <div className="space-y-5 text-lg leading-relaxed text-ink-700">
          {company.about.map((p, i) => (
            <p key={i} className={i === 0 ? "text-xl font-medium text-ink-900" : ""}>{p[locale]}</p>
          ))}
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-leaf-100 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] bg-white p-5 shadow-lift ring-1 ring-sand-200">
            <Image src="/images/brand/product-lineup.jpg" alt={locale === "ar" ? "مجموعة من منتجات الكنوز" : "A selection of Al-Kunooz products"} width={1400} height={480} className="h-auto w-full" sizes="(min-width: 1024px) 480px, 100vw" />
          </div>
        </div>
      </section>

      <section className="container-x grid gap-5 md:grid-cols-2">
        {[
          { title: d.vision, text: company.vision[locale], icon: "sun" },
          { title: d.mission, text: company.mission[locale], icon: "sprout" },
        ].map((b) => (
          <div key={b.title} className="relative overflow-hidden rounded-3xl bg-forest-800 p-8 text-white sm:p-10">
            <div className="brand-dots pointer-events-none absolute -top-6 end-0 h-32 w-48 opacity-40" />
            <Icon name={b.icon} className="relative size-9 text-leaf-400" />
            <h2 className="relative mt-4 text-2xl font-bold">{b.title}</h2>
            <p className="relative mt-3 text-lg leading-relaxed text-white/85">{b.text}</p>
          </div>
        ))}
      </section>

      <section className="container-x py-20" aria-labelledby="values">
        <h2 id="values" className="text-3xl font-bold text-forest-900">{d.values}</h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {company.values.map((v, i) => (
            <li key={i} className="reveal card p-6">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-leaf-50 text-forest-800 ring-1 ring-leaf-200">
                <Icon name={VALUE_ICONS[i]} className="size-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-forest-900">{v.title[locale]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{v.text[locale]}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white py-20" aria-labelledby="fields">
        <div className="container-x">
          <h2 id="fields" className="text-3xl font-bold text-forest-900">{d.fields}</h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {company.fields.map((f, i) => (
              <li key={i} className="flex items-start gap-4 rounded-2xl bg-sand-50 p-5 ring-1 ring-sand-200">
                <Icon name={FIELD_ICONS[i]} className="mt-1 size-6 shrink-0 text-leaf-600" />
                <div>
                  <h3 className="font-bold text-forest-900">{f.title[locale]}</h3>
                  <p className="mt-1 text-sm text-ink-500">{f.text[locale]}</p>
                </div>
              </li>
            ))}
          </ul>

          <h2 className="mt-20 text-3xl font-bold text-forest-900">{d.portfolio}</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-ink-700">{company.portfolioIntro[locale]}</p>
          <div className="mt-8 overflow-x-auto rounded-xl ring-1 ring-sand-200">
            <table className="data-table bg-white">
              <thead>
                <tr>
                  <th scope="col">{d.groupsTable.section}</th>
                  <th scope="col">{d.groupsTable.group}</th>
                  <th scope="col">{d.groupsTable.count}</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td className="ltr-num text-ink-500">{String(c.section).padStart(2, "0")}</td>
                    <th scope="row">
                      <Link href={`${href(locale, "/products")}?category=${c.id}`} className="font-semibold text-forest-800 hover:underline">
                        {c.name[locale]}
                      </Link>
                    </th>
                    <td className="ltr-num font-semibold">{productsInCategory(c.id).length}</td>
                  </tr>
                ))}
                <tr>
                  <td />
                  <th scope="row" className="font-bold">{d.groupsTable.total}</th>
                  <td className="ltr-num font-bold text-forest-800">{products.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container-x py-20" aria-labelledby="why">
        <h2 id="why" className="text-3xl font-bold text-forest-900">{d.why}</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {company.whyUs.map((w, i) => (
            <li key={i} className="flex gap-3 rounded-2xl bg-white p-5 ring-1 ring-sand-200">
              <Icon name="check" className="mt-0.5 size-5 shrink-0 text-leaf-600" />
              <div>
                <h3 className="font-bold text-forest-900">{w.title[locale]}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-700">{w.text[locale]}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="text-2xl font-bold text-forest-900">{d.management}</h2>
            {company.management.map((m) => (
              <div key={m.name.en} className="mt-5 flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-sand-200">
                <span className="inline-flex size-14 items-center justify-center rounded-full bg-forest-800 text-leaf-400">
                  <Icon name="user" className="size-7" />
                </span>
                <div>
                  <p className="text-lg font-bold text-ink-900">{m.name[locale]}</p>
                  <p className="text-sm text-leaf-600">{m.role[locale]}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-forest-900">{dict.contact.branches}</h2>
            <p className="mt-3 text-ink-700">{company.branchesIntro[locale]}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {branches.map((b) => (
                <li key={b.id} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold ${b.headOffice ? "bg-forest-800 text-white" : "bg-white text-forest-800 ring-1 ring-sand-200"}`}>
                  <Icon name={b.headOffice ? "star" : "pin"} className="size-4" />
                  {b.city[locale]}
                  {b.label && <span className="font-normal opacity-75">· {b.label[locale]}</span>}
                </li>
              ))}
            </ul>
            <Link href={href(locale, "/contact")} className="btn btn-primary mt-6">{dict.common.contactUs}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
