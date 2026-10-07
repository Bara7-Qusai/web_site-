import Image from "next/image";
import Link from "next/link";
import { whatsappLink } from "@/config/site";
import type { Locale } from "@/data/types";
import { href } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { CatalogItem } from "@/lib/catalog";
import { CompareToggle } from "./CompareToggle";
import { Icon } from "./Icon";

export function ProductCard({ item, locale, priority = false }: { item: CatalogItem; locale: Locale; priority?: boolean }) {
  const dict = getDictionary(locale);
  const detail = href(locale, `/products/${item.slug}`);
  const wa = whatsappLink(dict.product.whatsappMessage(`${item.name} (#${item.number})`));

  return (
    <article className="group card relative flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link href={detail} className="relative block aspect-[5/4] overflow-hidden bg-gradient-to-b from-sand-100 to-white" tabIndex={-1} aria-hidden="true">
        <Image
          src={item.image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-5 transition duration-500 group-hover:scale-[1.04]"
        />
        <span className="ltr-num absolute top-3 start-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.7rem] font-bold text-forest-800 shadow-sm">
          #{String(item.number).padStart(2, "0")}
        </span>
        {item.pesticide && (
          <span className="absolute top-3 end-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[0.7rem] font-semibold text-amber-900">
            <Icon name="alert" className="size-3.5" />
            <span className="sr-only">{item.categoryName}</span>
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold text-leaf-600">{item.categoryName}</p>
        <h3 className="mt-1.5 text-lg font-bold leading-snug text-ink-900">
          <Link href={detail} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {item.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-sm text-ink-500" lang={locale === "ar" ? "en" : "ar"}>
          {item.altName}
        </p>
        {item.spec && (
          <p className="mt-3">
            <span className="ltr-num inline-block rounded-md bg-leaf-50 px-2 py-1 text-xs font-semibold text-forest-800 ring-1 ring-leaf-200">
              {item.spec}
            </span>
          </p>
        )}
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-700">{item.benefit}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-ink-500">
          <Icon name="package" className="size-4 text-leaf-600" />
          {item.packages ? (
            item.packages.map((p) => (
              <span key={p} className="rounded-full border border-sand-200 px-2 py-0.5">
                {p}
              </span>
            ))
          ) : (
            <span className="italic">{dict.product.packagesPending}</span>
          )}
        </div>
        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-2 pt-5">
          <Link href={detail} className="btn btn-primary btn-sm">
            {dict.common.viewDetails}
          </Link>
          {wa ? (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm" aria-label={`${dict.common.whatsapp}: ${item.name}`}>
              <Icon name="whatsapp" className="size-4" />
              <span className="sr-only sm:not-sr-only">{dict.common.whatsappShort}</span>
            </a>
          ) : (
            <Link href={`${href(locale, "/contact")}?product=${item.slug}&type=product`} className="btn btn-outline btn-sm" aria-label={`${dict.common.requestInfo}: ${item.name}`}>
              {dict.common.requestInfo}
            </Link>
          )}
        </div>
        <div className="relative z-10 mt-3">
          <CompareToggle slug={item.slug} locale={locale} />
        </div>
      </div>
    </article>
  );
}
