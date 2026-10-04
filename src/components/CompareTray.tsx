"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/data/types";
import { href } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { COMPARE_MAX, compareActions, useCompareList } from "@/lib/compare-store";
import { Icon } from "./Icon";

export type CompareIndex = Record<string, { name: string; image: string }>;

export function CompareTray({ locale, index }: { locale: Locale; index: CompareIndex }) {
  const list = useCompareList().filter((s) => index[s]);
  const pathname = usePathname();
  const dict = getDictionary(locale).compare;
  if (list.length === 0 || /\/compare\/?$/.test(pathname)) return null;

  return (
    <aside aria-label={dict.tray} className="no-print fixed inset-x-0 bottom-4 z-40 px-4">
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-forest-700 bg-forest-900/95 p-3 text-white shadow-lift backdrop-blur animate-rise">
        <Icon name="compare" className="ms-1 hidden size-5 text-leaf-400 sm:block" />
        <ul className="flex flex-1 items-center gap-2 overflow-x-auto">
          {list.map((slug) => (
            <li key={slug} className="flex shrink-0 items-center gap-2 rounded-xl bg-white/10 py-1 ps-1 pe-2">
              <Image src={index[slug].image} alt="" width={36} height={36} className="size-9 rounded-lg bg-white object-contain" />
              <span className="hidden max-w-[9rem] truncate text-xs font-medium md:block">{index[slug].name}</span>
              <button type="button" onClick={() => compareActions.remove(slug)} aria-label={`${dict.remove}: ${index[slug].name}`} className="rounded-full p-1 hover:bg-white/15">
                <Icon name="close" className="size-3.5" />
              </button>
            </li>
          ))}
          <li className="text-xs text-white/60 ltr-num">
            {list.length}/{COMPARE_MAX}
          </li>
        </ul>
        <button type="button" onClick={() => compareActions.clear()} className="hidden text-xs text-white/70 underline-offset-4 hover:underline sm:block">
          {dict.clear}
        </button>
        <Link href={`${href(locale, "/compare")}?items=${list.join(",")}`} className="btn btn-leaf btn-sm">
          {dict.compareNow}
        </Link>
      </div>
    </aside>
  );
}
