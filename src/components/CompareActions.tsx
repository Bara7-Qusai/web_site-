"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/data/types";
import { href } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { compareActions, useCompareList } from "@/lib/compare-store";
import { Icon } from "./Icon";

/**
 * Keeps the compare URL (?items=…) and the saved compare list in sync:
 * - visiting /compare without items shows the saved list;
 * - visiting a shared /compare?items=… link adopts that list.
 */
export function CompareActions({ locale, items }: { locale: Locale; items: { slug: string; name: string }[] }) {
  const slugs = items.map((i) => i.slug);
  const router = useRouter();
  const saved = useCompareList();
  const d = getDictionary(locale).compare;
  const base = href(locale, "/compare");
  const savedKey = saved.join(",");
  const urlKey = slugs.join(",");

  useEffect(() => {
    if (urlKey) {
      if (urlKey !== savedKey) compareActions.set(slugs);
    } else if (savedKey) {
      router.replace(`${base}?items=${savedKey}`);
    }
    // Only react to URL changes; saved-list changes are handled by the buttons below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey]);

  if (slugs.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map(({ slug: s, name }) => (
        <button
          key={s}
          type="button"
          onClick={() => {
            compareActions.remove(s);
            const next = slugs.filter((x) => x !== s);
            router.replace(next.length ? `${base}?items=${next.join(",")}` : base);
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 ring-1 ring-sand-200 hover:ring-red-300"
        >
          <Icon name="close" className="size-3.5" />
          {d.remove}: {name}
        </button>
      ))}
      <button
        type="button"
        onClick={() => {
          compareActions.clear();
          router.replace(base);
        }}
        className="text-xs font-semibold text-forest-800 underline-offset-4 hover:underline"
      >
        {d.clear}
      </button>
    </div>
  );
}
