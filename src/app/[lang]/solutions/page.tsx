import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { categoryById } from "@/data/categories";
import { getProduct } from "@/data/products";
import { solutions } from "@/data/solutions";
import type { Locale } from "@/data/types";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/solutions">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang).solutions;
  return pageMetadata(lang, "/solutions", { title: d.title, description: d.lead });
}

export default async function SolutionsPage({ params }: PageProps<"/[lang]/solutions">) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const d = dict.solutions;

  return (
    <>
      <PageHero locale={locale} title={d.title} lead={d.lead} crumbs={[{ label: dict.nav.solutions }]} />

      <div className="container-x pb-24 pt-8">
        <div role="note" className="flex gap-3 rounded-2xl bg-amber-50 p-5 text-amber-950 ring-1 ring-amber-200">
          <Icon name="info" className="mt-0.5 size-5 shrink-0" />
          <p className="text-sm leading-relaxed">{d.disclaimer}</p>
        </div>

        <nav aria-label={d.title} className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {solutions.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-ink-700 ring-1 ring-sand-200 hover:text-forest-800 hover:ring-leaf-400">
              <Icon name={s.icon} className="size-4 text-leaf-600" />
              {s.title[locale]}
            </a>
          ))}
        </nav>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {solutions.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="reveal card scroll-mt-28 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-forest-800 text-leaf-400">
                  <Icon name={s.icon} className="size-7" />
                </span>
                <div>
                  <h2 id={`${s.id}-title`} className="text-xl font-bold text-forest-900">{s.title[locale]}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{s.description[locale]}</p>
                </div>
              </div>
              <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-ink-500">{d.suggested}</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {s.products.map((slug) => {
                  const p = getProduct(slug);
                  if (!p) return null;
                  return (
                    <li key={slug}>
                      <Link href={href(locale, `/products/${slug}`)} className="group flex items-center gap-3 rounded-xl bg-sand-50 p-2 ring-1 ring-sand-200 transition hover:bg-white hover:ring-leaf-400">
                        <Image src={p.image} alt="" width={56} height={56} className="size-14 shrink-0 rounded-lg bg-white object-contain p-1" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-ink-900 group-hover:text-forest-800">{p.name[locale]}</span>
                          <span className="block truncate text-xs text-ink-500">{categoryById[p.category].name[locale]}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
                {s.categories?.map((c) => (
                  <li key={c}>
                    <Link href={`${href(locale, "/products")}?category=${c}`} className="flex h-full items-center gap-3 rounded-xl bg-leaf-50 p-3 ring-1 ring-leaf-200 hover:ring-leaf-500">
                      <Icon name="layers" className="size-6 shrink-0 text-forest-800" />
                      <span className="text-sm">
                        <span className="block text-xs text-ink-500">{d.alsoGroup}</span>
                        <span className="font-semibold text-forest-800">{categoryById[c].name[locale]}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl bg-forest-800 p-10 text-center text-white">
          <Icon name="user" className="size-10 text-leaf-400" />
          <p className="max-w-xl text-lg">{dict.product.inquiryText}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={`${href(locale, "/contact")}?type=technical`} className="btn btn-leaf">{d.askExpert}</Link>
            <Link href={href(locale, "/products")} className="btn btn-ghost-light">{d.browseByCategory}</Link>
          </div>
        </div>
      </div>
    </>
  );
}
