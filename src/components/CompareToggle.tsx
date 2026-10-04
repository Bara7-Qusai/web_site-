"use client";

import { useState } from "react";
import type { Locale } from "@/data/types";
import { getDictionary } from "@/i18n/dictionaries";
import { compareActions, useCompareList } from "@/lib/compare-store";
import { Icon } from "./Icon";

export function CompareToggle({ slug, locale, variant = "chip" }: { slug: string; locale: Locale; variant?: "chip" | "button" }) {
  const list = useCompareList();
  const dict = getDictionary(locale).product;
  const active = list.includes(slug);
  const [full, setFull] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-pressed={active}
        onClick={() => {
          const ok = compareActions.toggle(slug);
          setFull(!ok);
          if (!ok) window.setTimeout(() => setFull(false), 2500);
        }}
        className={
          variant === "chip"
            ? `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                active ? "bg-forest-800 text-white" : "bg-sand-100 text-ink-700 hover:bg-sand-200"
              }`
            : `btn ${active ? "btn-primary" : "btn-outline"}`
        }
      >
        <Icon name={active ? "check" : "compare"} className="size-4" />
        {active ? dict.removeCompare : dict.addCompare}
      </button>
      <span role="status" aria-live="polite" className={full ? "absolute bottom-full start-0 z-10 mb-2 w-max max-w-[14rem] rounded-lg bg-ink-900 px-3 py-2 text-xs text-white shadow-lg" : "sr-only"}>
        {full ? dict.compareFull : ""}
      </span>
    </span>
  );
}
