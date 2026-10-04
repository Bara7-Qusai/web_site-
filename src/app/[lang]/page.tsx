import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig, whatsappLink } from "@/config/site";
import { categories } from "@/data/categories";
import { branches, company } from "@/data/company";
import { productsInCategory } from "@/data/products";
import { solutions } from "@/data/solutions";
import type { Locale } from "@/data/types";
import { href, isLocale, otherLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { catalogItems } from "@/lib/catalog";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "/") : {};
}

const FIELD_ICONS = ["droplet", "atom", "leaf", "shield"];
const WHY_ICONS = ["layers", "droplet", "sprout", "package", "sun"];
const STAGE_ICONS = ["root", "sprout", "flower", "fruit"];

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const h = dict.home;
  const featured = catalogItems(locale).filter((p) => p.category === "private-label").slice(0, 6);
  const wa = whatsappLink(locale === "ar" ? "مرحباً، أرغب في الاستفسار عن منتجات الكنوز." : "Hello, I would like to ask about Al-Kunooz products.");

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name.en,
    alternateName: company.name.ar,
    slogan: company.tagline[locale],
    url: absoluteUrl(href(locale)),
    logo: absoluteUrl("/images/brand/logo-color.png"),
    sameAs: [siteConfig.facebook],
    address: { "@type": "PostalAddress", addressLocality: "Khartoum", addressCountry: "SD" },
    ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
    ...(siteConfig.email ? { email: siteConfig.email } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

      {/* ───────────── Hero ───────────── */}
      <section className="relative overflow-hidden bg-forest-800 text-white">
        <div className="brand-arcs pointer-events-none absolute inset-0" />
        <div className="brand-dots pointer-events-none absolute top-6 start-4 h-48 w-80 opacity-60 [mask-image:radial-gradient(black,transparent_70%)]" />
        <div className="container-x relative grid items-center gap-10 pb-28 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:pb-36 lg:pt-20">
          <div className="animate-rise">
            <p className="eyebrow !text-leaf-400">{h.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.15] sm:text-5xl lg:text-6xl">
              {h.title}
              <span className="mt-2 block text-leaf-400">{h.titleAccent}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">{h.lead}</p>
            <p className="mt-3 max-w-xl text-sm text-white/55" lang={otherLocale(locale)} dir={locale === "ar" ? "ltr" : "rtl"}>
              {h.leadEn}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={href(locale, "/products")} className="btn btn-leaf">
                {dict.common.exploreProducts}
                <Icon name="arrow" className="size-4 rtl:-scale-x-100" />
              </Link>
              <Link href={href(locale, "/contact")} className="btn btn-ghost-light">
                {dict.common.contactUs}
              </Link>
              <a href={`/downloads/al-kunooz-catalog-${locale}.pdf`} className="btn btn-ghost-light" download>
                <Icon name="download" className="size-4" />
                {dict.common.browseCatalog}
              </a>
            </div>
          </div>
          <div className="relative animate-rise [animation-delay:150ms]">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-leaf-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] bg-white p-4 shadow-2xl ring-1 ring-white/20 sm:p-6">
              <Image
                src="/images/brand/product-lineup.jpg"
                alt={locale === "ar" ? "مجموعة من منتجات الكنوز" : "A selection of Al-Kunooz products"}
                width={1400}
                height={480}
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="h-auto w-full"
              />
              <div className="mt-3 flex items-center justify-between border-t border-sand-200 pt-3 text-sm">
                <span className="font-semibold text-forest-800">{company.tagline[locale]}</span>
                <span className="text-ink-500" lang={otherLocale(locale)}>
                  {company.tagline[otherLocale(locale)]}
                </span>
              </div>
            </div>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 1440 90" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 block h-14 w-full sm:h-20">
          <path d="M0 90V60C240 15 480 0 720 0s480 15 720 60v30Z" fill="var(--color-sand-50)" />
          <path d="M0 60C240 15 480 0 720 0s480 15 720 60" fill="none" stroke="var(--color-leaf-500)" strokeWidth="4" />
        </svg>
      </section>

      {/* ───────────── Stats ───────────── */}
      <section aria-label={h.statsLabel} className="container-x relative z-10 -mt-14 sm:-mt-16">
        <dl className="grid grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-sand-200 md:grid-cols-4">
          {company.stats.map((s, i) => (
            <div key={i} className={`flex flex-col-reverse p-6 text-center sm:p-8 ${i % 2 === 0 ? "border-e border-sand-200" : ""} ${i < 2 ? "border-b border-sand-200 md:border-b-0" : ""} md:border-e md:last:border-e-0`}>
              <dt className="mt-1 text-sm text-ink-500">{s.label[locale]}</dt>
              <dd className="ltr-num text-4xl font-bold text-forest-800 sm:text-5xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ───────────── Intro + fields ───────────── */}
      <section className="container-x py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="reveal">
            <SectionHeading eyebrow={dict.about.title} title={company.tagline[locale]} text={company.about[0][locale]} />
            <p className="mt-4 leading-relaxed text-ink-700">{company.about[1][locale]}</p>
            <Link href={href(locale, "/about")} className="btn btn-outline mt-8">
              {dict.common.learnMore}
              <Icon name="arrow" className="size-4 rtl:-scale-x-100" />
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {company.fields.map((f, i) => (
              <li key={i} className="reveal card p-6 transition hover:-translate-y-0.5 hover:shadow-lift">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-leaf-50 text-forest-800 ring-1 ring-leaf-200">
                  <Icon name={FIELD_ICONS[i]} className="size-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-forest-900">{f.title[locale]}</h3>
                <p className="mt-1 text-sm text-ink-500">{f.text[locale]}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── Categories ───────────── */}
      <section className="bg-white py-20 sm:py-24" aria-labelledby="cats-title">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading id="cats-title" eyebrow={h.categoriesEyebrow} title={h.categoriesTitle} text={h.categoriesText} />
            <Link href={href(locale, "/products")} className="btn btn-outline">
              {dict.common.viewAll}
              <Icon name="arrow" className="size-4 rtl:-scale-x-100" />
            </Link>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const count = productsInCategory(c.id).length;
              return (
                <li key={c.id} className="reveal">
                  <Link
                    href={`${href(locale, "/products")}?category=${c.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-sand-200 bg-sand-50 transition duration-300 hover:-translate-y-1 hover:border-leaf-400 hover:shadow-lift"
                  >
                    <div className="relative aspect-[16/7] overflow-hidden bg-white">
                      <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-contain p-3 transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="ltr-num text-leaf-600">{String(c.section).padStart(2, "0")}</span>
                        <span className="rounded-full bg-forest-800 px-2.5 py-1 text-white">
                          {dict.catalog.results(count)}
                        </span>
                      </div>
                      <h3 className="mt-3 text-xl font-bold text-forest-900">{c.name[locale]}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-700">{c.description[locale]}</p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-forest-800">
                        {dict.common.exploreProducts}
                        <Icon name="arrow" className="size-4 transition group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ───────────── Featured private label ───────────── */}
      <section className="container-x py-20 sm:py-24" aria-labelledby="featured-title">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="featured-title" eyebrow={h.featuredEyebrow} title={h.featuredTitle} text={h.featuredText} />
          <Link href={`${href(locale, "/products")}?category=private-label`} className="btn btn-outline">
            {dict.common.viewAll}
            <Icon name="arrow" className="size-4 rtl:-scale-x-100" />
          </Link>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <li key={item.slug} className="reveal">
              <ProductCard item={item} locale={locale} />
            </li>
          ))}
        </ul>
      </section>

      {/* ───────────── Growth stages + solutions ───────────── */}
      <section className="relative overflow-hidden bg-forest-900 py-20 text-white sm:py-24" aria-labelledby="sol-title">
        <div className="brand-arcs pointer-events-none absolute inset-0 opacity-70" />
        <div className="container-x relative">
          <SectionHeading id="sol-title" tone="light" eyebrow={h.solutionsEyebrow} title={h.solutionsTitle} text={h.solutionsText} />

          <div className="mt-12">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">{h.stagesTitle}</h3>
            <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {h.stages.map((s, i) => (
                <li key={i} className="reveal relative rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-leaf-500 text-forest-950">
                      <Icon name={STAGE_ICONS[i]} className="size-5" />
                    </span>
                    <span className="ltr-num text-2xl font-bold text-white/25">0{i + 1}</span>
                  </div>
                  <p className="mt-4 font-bold">{s.title}</p>
                  <p className="mt-1 text-sm text-white/70">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`${href(locale, "/solutions")}#${s.id}`}
                  className="group flex h-full items-center gap-3 rounded-2xl bg-white p-4 text-ink-900 transition hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-forest-800 ring-1 ring-leaf-200 transition group-hover:bg-forest-800 group-hover:text-white">
                    <Icon name={s.icon} className="size-5" />
                  </span>
                  <span className="text-sm font-semibold leading-snug">{s.title[locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── Why Al-Kunooz + values ───────────── */}
      <section className="container-x py-20 sm:py-24" aria-labelledby="why-title">
        <SectionHeading id="why-title" eyebrow={h.whyEyebrow} title={h.whyTitle} align="center" />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {company.whyUs.map((w, i) => (
            <li key={i} className="reveal card p-6 text-center">
              <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-forest-800 text-leaf-400">
                <Icon name={WHY_ICONS[i]} className="size-6" />
              </span>
              <h3 className="mt-4 font-bold text-forest-900">{w.title[locale]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{w.text[locale]}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 rounded-3xl bg-leaf-50 p-8 ring-1 ring-leaf-200 sm:p-10">
          <h3 className="text-xl font-bold text-forest-900">{h.valuesTitle}</h3>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {company.values.map((v, i) => (
              <div key={i}>
                <dt className="flex items-center gap-2 font-bold text-forest-800">
                  <Icon name="check" className="size-5 text-leaf-600" />
                  {v.title[locale]}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-ink-700">{v.text[locale]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───────────── Branches ───────────── */}
      <section className="bg-white py-20 sm:py-24" aria-labelledby="branches-title">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <SectionHeading id="branches-title" eyebrow={h.branchesEyebrow} title={h.branchesTitle} text={company.branchesIntro[locale]} />
            <Link href={href(locale, "/contact")} className="btn btn-primary mt-8">
              {dict.common.contactUs}
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {branches.map((b) => (
              <li
                key={b.id}
                className={`reveal flex items-start gap-4 rounded-2xl p-5 ${b.headOffice ? "bg-forest-800 text-white sm:col-span-2" : "bg-sand-50 ring-1 ring-sand-200"}`}
              >
                <span className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full ${b.headOffice ? "bg-leaf-500 text-forest-950" : "bg-white text-forest-800 ring-1 ring-sand-200"}`}>
                  <Icon name={b.headOffice ? "star" : "pin"} className="size-5" />
                </span>
                <div>
                  <p className="text-lg font-bold">{b.city[locale]}</p>
                  {b.label && <p className={`text-sm font-semibold ${b.headOffice ? "text-leaf-400" : "text-leaf-600"}`}>{b.label[locale]}</p>}
                  {b.covers && (
                    <p className={`mt-0.5 text-sm ${b.headOffice ? "text-white/70" : "text-ink-500"}`}>
                      {dict.contact.covers}: {b.covers[locale]}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── CTA ───────────── */}
      <section className="container-x py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest-800 to-forest-950 p-8 text-white sm:p-14">
          <div className="brand-arcs pointer-events-none absolute inset-0" />
          <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold leading-tight sm:text-4xl">{h.ctaTitle}</h2>
              <p className="mt-4 text-white/75 sm:text-lg">{h.ctaText}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href={`${href(locale, "/contact")}?type=product`} className="btn btn-leaf">
                {dict.common.requestInfo}
              </Link>
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                  <Icon name="whatsapp" className="size-5" />
                  {dict.common.whatsapp}
                </a>
              )}
              <Link href={`${href(locale, "/contact")}?type=distributor`} className="btn btn-ghost-light">
                <Icon name="handshake" className="size-5" />
                {h.ctaDistributor}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
