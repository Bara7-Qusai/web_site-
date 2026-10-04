import Link from "next/link";
import { siteConfig, telLink } from "@/config/site";
import { categories } from "@/data/categories";
import { branches, company } from "@/data/company";
import type { Locale } from "@/data/types";
import { href } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Icon } from "./Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { navItems } from "./SiteHeader";

export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const tel = telLink();
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-forest-900 text-white/80">
      <div className="brand-dots pointer-events-none absolute inset-y-0 end-0 w-1/3 opacity-40 [mask-image:linear-gradient(to_left,black,transparent)] rtl:[mask-image:linear-gradient(to_right,black,transparent)]" />
      <div className="container-x relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr]">
        <div>
          <Logo locale={locale} variant="white" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">{dict.footer.about}</p>
          <p className="mt-4 text-lg font-semibold text-leaf-400">{company.tagline[locale]}</p>
          <div className="mt-6 flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-white/50">{dict.footer.language}</span>
            <LanguageSwitcher locale={locale} tone="light" />
          </div>
        </div>
        <nav aria-label={dict.footer.links}>
          <h2 className="text-sm font-bold text-white">{dict.footer.links}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navItems(locale).map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="hover:text-leaf-400">{i.label}</Link>
              </li>
            ))}
            <li>
              <Link href={href(locale, "/compare")} className="hover:text-leaf-400">{dict.nav.compare}</Link>
            </li>
            <li>
              <a href={`/downloads/al-kunooz-catalog-${locale}.pdf`} className="hover:text-leaf-400" download>
                {dict.common.downloadCatalog}
              </a>
            </li>
          </ul>
        </nav>
        <nav aria-label={dict.footer.groups}>
          <h2 className="text-sm font-bold text-white">{dict.footer.groups}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                {/* Plain link: forces the catalog to re-read filters even when already on /products */}
                <a href={`${href(locale, "/products")}?category=${c.id}`} className="hover:text-leaf-400">
                  {c.name[locale]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-bold text-white">{dict.footer.contact}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Icon name="pin" className="mt-0.5 size-4 shrink-0 text-leaf-400" />
              <span>
                {dict.contact.addressValue}
                <span className="mt-1 block text-white/55">
                  {branches.filter((b) => !b.headOffice).map((b) => b.city[locale]).join(" · ")}
                </span>
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Icon name="phone" className="size-4 shrink-0 text-leaf-400" />
              {tel ? (
                <a href={tel} className="ltr-num hover:text-leaf-400">{siteConfig.phone}</a>
              ) : (
                <span className="text-white/55">{dict.contact.phone}: {dict.contact.pending}</span>
              )}
            </li>
            <li className="flex items-center gap-2.5">
              <Icon name="mail" className="size-4 shrink-0 text-leaf-400" />
              {siteConfig.email ? (
                <a href={`mailto:${siteConfig.email}`} className="hover:text-leaf-400">{siteConfig.email}</a>
              ) : (
                <span className="text-white/55">{dict.contact.email}: {dict.contact.pending}</span>
              )}
            </li>
            <li className="flex items-center gap-2.5">
              <Icon name="facebook" className="size-4 shrink-0 text-leaf-400" />
              <a href={siteConfig.facebook} target="_blank" rel="noopener noreferrer" className="ltr-num hover:text-leaf-400">
                {siteConfig.facebookLabel}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <span className="ltr-num">{year}</span> {company.name[locale]}. {dict.footer.rights}
          </p>
          <p>{company.tagline.ar} · {company.tagline.en}</p>
        </div>
      </div>
    </footer>
  );
}
