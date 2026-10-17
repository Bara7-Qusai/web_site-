"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/data/types";
import { href } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { COMPARE_MAX, compareActions, useCompareList } from "@/lib/compare-store";
import { Icon } from "./Icon";

export interface CompareProduct {
  slug: string;
  name: string;
  image: string;
  category: string;
  form: string | null;
  formulation: string | null;
  basis: string | null;
  composition: { label: string; value: string }[] | null;
  hasTables: boolean;
  packages: string[] | null;
  keyFeature: string | null;
  benefits: string[];
}

export function CompareView({ locale, products }: { locale: Locale; products: CompareProduct[] }) {
  const dict = getDictionary(locale);
  const d = dict.compare;
  const p = dict.product;
  const base = href(locale, "/compare");
  const saved = useCompareList();
  const [ready, setReady] = useState(false);

  // A shared link (?items=a,b) becomes the saved list; otherwise the saved list is shown.
  useEffect(() => {
    const items = new URLSearchParams(window.location.search).get("items");
    if (items) compareActions.set(items.split(",").filter((s) => products.some((x) => x.slug === s)));
    setReady(true); // eslint-disable-line react-hooks/set-state-in-effect -- render only after reading the URL
  }, [products]);

  const items = saved
    .map((s) => products.find((x) => x.slug === s))
    .filter((x): x is CompareProduct => !!x)
    .slice(0, COMPARE_MAX);

  // Keep the URL shareable.
  const key = items.map((x) => x.slug).join(",");
  useEffect(() => {
    if (!ready) return;
    window.history.replaceState(null, "", key ? `${base}?items=${key}` : base);
  }, [ready, key, base]);

  if (!ready) return <div className="h-64" aria-hidden="true" />;

  if (items.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-4 p-12 text-center">
        <Icon name="compare" className="size-12 text-sand-300" />
        <p className="max-w-md text-ink-700">{d.empty}</p>
        <Link href={href(locale, "/products")} className="btn btn-primary">{dict.common.exploreProducts}</Link>
      </div>
    );
  }

  const dash = "—";
  const rows: { label: string; render: (x: CompareProduct) => React.ReactNode }[] = [
    { label: p.category, render: (x) => x.category },
    { label: p.form, render: (x) => x.form ?? dash },
    { label: p.formulation, render: (x) => <span className="ltr-num">{x.formulation ?? dash}</span> },
    { label: p.basis, render: (x) => <span className="ltr-num">{x.basis ?? dash}</span> },
    {
      label: p.composition,
      render: (x) =>
        x.composition ? (
          <ul className="space-y-1">
            {x.composition.map((r) => (
              <li key={r.label} className="flex justify-between gap-3">
                <span>{r.label}</span>
                <span className="ltr-num font-semibold text-forest-800">{r.value}</span>
              </li>
            ))}
          </ul>
        ) : x.hasTables ? (
          <Link href={href(locale, `/products/${x.slug}`)} className="text-forest-800 underline">{dict.common.viewDetails}</Link>
        ) : (
          dash
        ),
    },
    { label: p.packages, render: (x) => (x.packages ? x.packages.join(" · ") : p.packagesPending) },
    { label: p.keyFeature, render: (x) => x.keyFeature ?? dash },
    {
      label: p.benefits,
      render: (x) => (
        <ul className="list-disc space-y-1 ps-4">
          {x.benefits.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {items.map((x) => (
          <button
            key={x.slug}
            type="button"
            onClick={() => compareActions.remove(x.slug)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 ring-1 ring-sand-200 hover:ring-red-300"
          >
            <Icon name="close" className="size-3.5" />
            {d.remove}: {x.name}
          </button>
        ))}
        <button type="button" onClick={() => compareActions.clear()} className="text-xs font-semibold text-forest-800 underline-offset-4 hover:underline">
          {d.clear}
        </button>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white ring-1 ring-sand-200">
        <table className="w-full min-w-[42rem] border-collapse text-sm">
          <thead>
            <tr>
              <th scope="col" className="w-44 bg-sand-50 p-4 text-start text-xs font-semibold text-ink-500">{d.attribute}</th>
              {items.map((x) => (
                <th key={x.slug} scope="col" className="p-4 text-start align-top">
                  <Link href={href(locale, `/products/${x.slug}`)} className="group block">
                    <span className="relative mb-3 block aspect-square w-28 overflow-hidden rounded-xl bg-sand-50">
                      <Image src={x.image} alt="" fill sizes="112px" className="object-contain p-2" />
                    </span>
                    <span className="block text-base font-bold text-forest-900 group-hover:underline">{x.name}</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-sand-200">
                <th scope="row" className="bg-sand-50 p-4 text-start align-top text-xs font-semibold text-ink-500">{r.label}</th>
                {items.map((x) => (
                  <td key={x.slug} className="p-4 align-top leading-relaxed text-ink-700">{r.render(x)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
