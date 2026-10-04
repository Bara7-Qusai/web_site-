import Link from "next/link";
import type { Locale } from "@/data/types";
import { href } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Icon } from "./Icon";

/** Compact branded header used on inner pages. */
export function PageHero({
  locale,
  title,
  lead,
  crumbs = [],
  children,
}: {
  locale: Locale;
  title: string;
  lead?: string;
  crumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  const dict = getDictionary(locale);
  const trail = [{ label: dict.nav.home, href: href(locale) }, ...crumbs];
  return (
    <section className="relative overflow-hidden bg-forest-800 text-white">
      <div className="brand-arcs pointer-events-none absolute inset-0" />
      <div className="brand-dots pointer-events-none absolute -top-10 start-0 h-56 w-72 opacity-50 [mask-image:radial-gradient(black,transparent_70%)]" />
      <div className="container-x relative py-10 sm:py-14">
        <nav aria-label={dict.product.breadcrumb}>
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/65">
            {trail.map((c, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <Icon name="arrow" className="size-3.5 opacity-60 rtl:-scale-x-100" />}
                {c.href && i < trail.length - 1 ? (
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{lead}</p>}
        {children}
      </div>
      <svg aria-hidden="true" viewBox="0 0 1440 60" preserveAspectRatio="none" className="relative block h-8 w-full sm:h-12">
        <path d="M0 60V40C240 10 480 0 720 0s480 10 720 40v20Z" fill="var(--color-sand-50)" />
        <path d="M0 40C240 10 480 0 720 0s480 10 720 40" fill="none" stroke="var(--color-leaf-500)" strokeWidth="3" />
      </svg>
    </section>
  );
}
