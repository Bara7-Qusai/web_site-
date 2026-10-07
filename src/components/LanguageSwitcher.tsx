"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/data/types";
import { LOCALE_COOKIE, otherLocale, switchLocalePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Icon } from "./Icon";

export function LanguageSwitcher({ locale, className = "", tone = "dark" }: { locale: Locale; className?: string; tone?: "dark" | "light" }) {
  const pathname = usePathname();
  const to = otherLocale(locale);
  const dict = getDictionary(locale);
  const target = switchLocalePath(pathname || "/", to);

  return (
    <a
      href={target}
      hrefLang={to}
      lang={to}
      aria-label={dict.nav.switchLangLabel}
      onClick={(e) => {
        // Keep the current query string (e.g. catalog filters) and remember the choice.
        document.cookie = `${LOCALE_COOKIE}=${to}; path=/; max-age=31536000; samesite=lax`;
        e.preventDefault();
        window.location.assign(target + window.location.search + window.location.hash);
      }}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
        tone === "dark" ? "border border-sand-300 text-forest-800 hover:border-forest-800" : "border border-white/30 text-white hover:bg-white/10"
      } ${className}`}
    >
      <Icon name="globe" className="size-4" />
      <span>{dict.nav.switchLang}</span>
    </a>
  );
}
