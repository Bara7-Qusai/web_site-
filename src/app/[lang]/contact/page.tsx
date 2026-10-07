import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { siteConfig, telLink, whatsappLink } from "@/config/site";
import { branches, company } from "@/data/company";
import { products } from "@/data/products";
import type { Locale } from "@/data/types";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang).contact;
  return pageMetadata(lang, "/contact", { title: d.title, description: d.lead });
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const d = dict.contact;
  const tel = telLink();
  const wa = whatsappLink(locale === "ar" ? "مرحباً، أرغب في الاستفسار عن منتجات الكنوز." : "Hello, I would like to ask about Al-Kunooz products.");
  const productOptions = products.map((p) => ({ slug: p.slug, name: `${p.name[locale]} (#${p.number})` }));

  const rows = [
    {
      icon: "phone",
      label: d.phone,
      value: tel ? <a href={tel} className="ltr-num font-semibold text-forest-800 hover:underline">{siteConfig.phone}</a> : null,
    },
    {
      icon: "mail",
      label: d.email,
      value: siteConfig.email ? <a href={`mailto:${siteConfig.email}`} className="font-semibold text-forest-800 hover:underline">{siteConfig.email}</a> : null,
    },
    { icon: "pin", label: d.address, value: <span className="font-semibold">{d.addressValue}</span> },
    {
      icon: "facebook",
      label: d.facebook,
      value: (
        <a href={siteConfig.facebook} target="_blank" rel="noopener noreferrer" className="ltr-num font-semibold text-forest-800 hover:underline">
          {siteConfig.facebookLabel}
        </a>
      ),
    },
  ];

  return (
    <>
      <PageHero locale={locale} title={d.title} lead={d.lead} crumbs={[{ label: dict.nav.contact }]} />

      <div className="container-x grid gap-8 pb-24 pt-8 lg:grid-cols-[1fr_1.5fr]">
        <div className="space-y-6">
          <section className="card p-6 sm:p-8" aria-labelledby="details">
            <h2 id="details" className="text-xl font-bold text-forest-900">{d.details}</h2>
            <ul className="mt-5 space-y-4">
              {rows.map((r) => (
                <li key={r.label} className="flex items-start gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-forest-800 ring-1 ring-leaf-200">
                    <Icon name={r.icon} className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-ink-500">{r.label}</p>
                    <div className="mt-0.5 break-words">
                      {r.value ?? <span className="text-sm italic text-ink-500">{d.pending}</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {(wa || tel) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                    <Icon name="whatsapp" className="size-5" />
                    {dict.common.whatsapp}
                  </a>
                )}
                {tel && (
                  <a href={tel} className="btn btn-outline">
                    <Icon name="phone" className="size-5" />
                    {d.phone}
                  </a>
                )}
              </div>
            )}
            <div className="mt-6 border-t border-sand-200 pt-5">
              <p className="text-xs font-semibold text-ink-500">{d.management}</p>
              <p className="mt-1 font-bold text-ink-900">{company.management[0].name[locale]}</p>
            </div>
          </section>

          <section className="rounded-3xl bg-forest-800 p-6 text-white sm:p-8" aria-labelledby="distributors">
            <Icon name="handshake" className="size-8 text-leaf-400" />
            <h2 id="distributors" className="mt-3 text-xl font-bold">{d.distributorTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{d.distributorText}</p>
          </section>
        </div>

        <InquiryForm locale={locale} products={productOptions} />
      </div>

      <section className="bg-white py-20" aria-labelledby="branches">
        <div className="container-x">
          <h2 id="branches" className="text-3xl font-bold text-forest-900">{d.branches}</h2>
          <p className="mt-3 max-w-3xl text-ink-700">{company.branchesIntro[locale]}</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((b) => (
              <li key={b.id} className={`rounded-2xl p-6 ${b.headOffice ? "bg-forest-800 text-white sm:col-span-2 lg:col-span-1" : "bg-sand-50 ring-1 ring-sand-200"}`}>
                <div className="flex items-center gap-3">
                  <Icon name={b.headOffice ? "star" : "pin"} className={`size-6 ${b.headOffice ? "text-leaf-400" : "text-leaf-600"}`} />
                  <h3 className="text-xl font-bold">{b.city[locale]}</h3>
                </div>
                {b.label && <p className={`mt-2 text-sm font-semibold ${b.headOffice ? "text-leaf-400" : "text-leaf-600"}`}>{b.label[locale]}</p>}
                {b.covers && (
                  <p className={`mt-1 text-sm ${b.headOffice ? "text-white/75" : "text-ink-700"}`}>
                    {d.covers}: {b.covers[locale]}
                  </p>
                )}
                <p className="mt-4 text-xs">
                  {b.mapUrl ? (
                    <a href={b.mapUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">{d.openMap}</a>
                  ) : (
                    <span className={b.headOffice ? "text-white/60" : "text-ink-500"}>{d.mapPending}</span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
