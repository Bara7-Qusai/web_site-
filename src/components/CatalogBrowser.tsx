"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { CategoryId, Locale, NeedId } from "@/data/types";
import { getDictionary } from "@/i18n/dictionaries";
import type { CatalogItem } from "@/lib/catalog";
import { matches } from "@/lib/search";
import { Icon } from "./Icon";
import { ProductCard } from "./ProductCard";

type Sort = "catalog" | "name-asc" | "name-desc" | "category";
const SORTS: Sort[] = ["catalog", "name-asc", "name-desc", "category"];

export interface CatalogFacet<T extends string> {
  id: T;
  label: string;
  count?: number;
}

export function CatalogBrowser({
  locale,
  items,
  categories,
  needs,
  crossListed,
}: {
  locale: Locale;
  items: CatalogItem[];
  categories: CatalogFacet<CategoryId>[];
  needs: CatalogFacet<NeedId>[];
  crossListed: Partial<Record<CategoryId, { slug: string; name: string }[]>>;
}) {
  const dict = getDictionary(locale);
  const t = dict.catalog;
  const pathname = usePathname();

  // Filters live in local state (so the full list is server-rendered for SEO)
  // and are mirrored to the URL so filtered views can be shared and bookmarked.
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [need, setNeed] = useState<NeedId | null>(null);
  const [sort, setSort] = useState<Sort>("catalog");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const c = sp.get("category");
    const n = sp.get("need");
    const s = sp.get("sort") as Sort | null;
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from the URL after hydration */
    if (categories.some((x) => x.id === c)) setCategory(c as CategoryId);
    if (needs.some((x) => x.id === n)) setNeed(n as NeedId);
    if (s && SORTS.includes(s)) setSort(s);
    setQuery(sp.get("q") ?? "");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [categories, needs]);

  function update(next: { category?: CategoryId | null; need?: NeedId | null; sort?: Sort; q?: string }) {
    if ("category" in next) setCategory(next.category ?? null);
    if ("need" in next) setNeed(next.need ?? null);
    if (next.sort) setSort(next.sort);
    if ("q" in next) setQuery(next.q ?? "");
    const sp = new URLSearchParams(window.location.search);
    const set = (k: string, v: string | null | undefined) => (v ? sp.set(k, v) : sp.delete(k));
    if ("category" in next) set("category", next.category);
    if ("need" in next) set("need", next.need);
    if (next.sort) set("sort", next.sort === "catalog" ? null : next.sort);
    if ("q" in next) set("q", next.q?.trim());
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  }

  function clearAll() {
    setCategory(null);
    setNeed(null);
    setSort("catalog");
    setQuery("");
    window.history.replaceState(null, "", pathname);
  }

  const results = useMemo(() => {
    const collator = new Intl.Collator(locale === "ar" ? "ar" : "en", { sensitivity: "base", numeric: true });
    const list = items.filter(
      (p) => (!category || p.category === category) && (!need || p.needs.includes(need)) && matches(p.search, deferredQuery),
    );
    const order = categories.map((c) => c.id);
    switch (sort) {
      case "name-asc":
        return list.sort((a, b) => collator.compare(a.name, b.name));
      case "name-desc":
        return list.sort((a, b) => collator.compare(b.name, a.name));
      case "category":
        return list.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category) || collator.compare(a.name, b.name));
      default:
        return list.sort((a, b) => a.number - b.number);
    }
  }, [items, category, need, deferredQuery, sort, locale, categories]);

  const hasFilters = !!(category || need || query);
  const extra = category ? crossListed[category] : undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
      {/* Filters */}
      <aside aria-label={t.filters} className="lg:sticky lg:top-24 lg:self-start">
        <h2 className="sr-only">{t.filters}</h2>
        <fieldset>
          <legend className="mb-3 text-sm font-bold text-ink-900">{t.category}</legend>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
            {[{ id: null as CategoryId | null, label: t.allCategories, count: items.length }, ...categories].map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id ?? "all"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => update({ category: c.id })}
                  className={`flex shrink-0 items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-start text-sm font-medium transition lg:w-full ${
                    active ? "bg-forest-800 text-white shadow-card" : "bg-white text-ink-700 ring-1 ring-sand-200 hover:ring-leaf-400"
                  }`}
                >
                  <span>{c.label}</span>
                  <span className={`ltr-num rounded-full px-2 text-xs ${active ? "bg-white/15" : "bg-sand-100 text-ink-500"}`}>{c.count}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="card flex flex-col gap-3 p-3 md:flex-row md:items-center">
          <label className="relative flex-1">
            <span className="sr-only">{t.searchLabel}</span>
            <Icon name="search" className="pointer-events-none absolute start-3.5 top-1/2 size-5 -translate-y-1/2 text-ink-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => update({ q: e.target.value })}
              placeholder={t.searchPlaceholder}
              className="field ps-11"
              autoComplete="off"
              enterKeyHint="search"
            />
          </label>
          <div className="grid grid-cols-2 gap-3 md:flex">
            <label className="flex flex-col text-xs font-semibold text-ink-500">
              <span className="sr-only md:not-sr-only md:mb-1">{t.need}</span>
              <select value={need ?? ""} onChange={(e) => update({ need: (e.target.value || null) as NeedId | null })} className="field py-2.5 text-sm md:w-52" aria-label={t.need}>
                <option value="">{t.allNeeds}</option>
                {needs.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col text-xs font-semibold text-ink-500">
              <span className="sr-only md:not-sr-only md:mb-1">{t.sort}</span>
              <select value={sort} onChange={(e) => update({ sort: e.target.value as Sort })} className="field py-2.5 text-sm md:w-44" aria-label={t.sort}>
                <option value="catalog">{t.sortCatalog}</option>
                <option value="name-asc">{t.sortNameAsc}</option>
                <option value="name-desc">{t.sortNameDesc}</option>
                <option value="category">{t.sortCategory}</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink-700" role="status" aria-live="polite">
            {t.results(results.length)}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800 hover:underline"
            >
              <Icon name="close" className="size-4" />
              {t.clear}
            </button>
          )}
        </div>

        {extra && extra.length > 0 && (
          <p className="mt-3 rounded-xl bg-leaf-50 px-4 py-3 text-sm text-ink-700 ring-1 ring-leaf-200">
            {t.alsoListed}{" "}
            {extra.map((x, i) => (
              <span key={x.slug}>
                {i > 0 && (locale === "ar" ? "، " : ", ")}
                <a href={`${pathname}/${x.slug}`} className="font-semibold text-forest-800 underline-offset-4 hover:underline">
                  {x.name}
                </a>
              </span>
            ))}
          </p>
        )}

        {results.length > 0 ? (
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((item, i) => (
              <li key={item.slug}>
                <ProductCard item={item} locale={locale} priority={i < 3} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="card mt-5 flex flex-col items-center gap-3 p-12 text-center">
            <Icon name="search" className="size-10 text-sand-300" />
            <p className="text-ink-700">{t.noResults}</p>
            <button
              type="button"
              onClick={clearAll}
              className="btn btn-outline btn-sm"
            >
              {t.clear}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
