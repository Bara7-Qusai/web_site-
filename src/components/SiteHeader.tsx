import Link from "next/link";
import type { Locale } from "@/data/types";
import { href } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Icon } from "./Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { NavLinks, type NavItem } from "./NavLinks";

export function navItems(locale: Locale): NavItem[] {
  const d = getDictionary(locale).nav;
  return [
    { href: href(locale), label: d.home },
    { href: href(locale, "/about"), label: d.about },
    { href: href(locale, "/products"), label: d.products },
    { href: href(locale, "/solutions"), label: d.solutions },
    { href: href(locale, "/contact"), label: d.contact },
  ];
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const items = navItems(locale);
  return (
    <header className="sticky top-0 z-50 border-b border-sand-200/80 bg-sand-50/90 backdrop-blur-md supports-[backdrop-filter]:bg-sand-50/75">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-forest-800 focus:px-4 focus:py-2 focus:text-white"
      >
        {dict.nav.skip}
      </a>
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-6">
        <Logo locale={locale} />
        <nav aria-label={dict.nav.menu} className="hidden lg:block">
          <NavLinks
            items={items}
            className="flex items-center gap-1"
            itemClassName="relative px-3.5 py-2 text-[0.95rem] font-semibold transition-colors after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-leaf-500 after:transition-transform hover:after:scale-x-100"
          />
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} className="hidden sm:inline-flex" />
          <Link href={href(locale, "/contact")} className="btn btn-primary btn-sm hidden lg:inline-flex">
            {dict.common.requestInfo}
          </Link>
          <MobileNav items={items} menuLabel={dict.nav.menu} closeLabel={dict.nav.close}>
            <LanguageSwitcher locale={locale} className="justify-center py-3 sm:hidden" />
            <Link href={href(locale, "/products")} className="btn btn-outline">
              <Icon name="leaf" className="size-4" />
              {dict.common.exploreProducts}
            </Link>
            <Link href={href(locale, "/contact")} className="btn btn-primary">
              {dict.common.requestInfo}
            </Link>
          </MobileNav>
        </div>
      </div>
    </header>
  );
}
