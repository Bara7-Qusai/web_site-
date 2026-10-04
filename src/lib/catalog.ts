import { categoryById } from "@/data/categories";
import { products } from "@/data/products";
import { solutions } from "@/data/solutions";
import type { CategoryId, Locale, NeedId, Product, Solution } from "@/data/types";
import { normalize } from "./search";

/** Solutions (crop needs) in which a product is suggested. */
export function needsForProduct(p: Product): Solution[] {
  return solutions.filter((s) => s.products.includes(p.slug) || s.categories?.includes(p.category));
}

/** A short, display-ready formulation string for cards. */
export function headlineSpec(p: Product): string | null {
  if (p.formulation) return p.formulation;
  if (p.formulations?.length) return `${p.formulations.length} × NPK`;
  if (p.composition?.length) {
    return p.composition
      .slice(0, 3)
      .map((r) => `${shortLabel(r.label.en)} ${r.value}`)
      .join(" · ");
  }
  return null;
}

function shortLabel(en: string): string {
  const m = en.match(/\(([^)]+)\)\s*$/);
  return m ? m[1] : en;
}

/** Serializable product summary for client-side catalog filtering. */
export interface CatalogItem {
  slug: string;
  number: number;
  category: CategoryId;
  categoryName: string;
  name: string;
  altName: string;
  image: string;
  spec: string | null;
  basis: string | null;
  packages: string[] | null;
  benefit: string;
  needs: NeedId[];
  pesticide: boolean;
  search: string;
}

export function catalogItems(locale: Locale): CatalogItem[] {
  const other: Locale = locale === "ar" ? "en" : "ar";
  return products.map((p) => {
    const cat = categoryById[p.category];
    const haystack = [
      p.name.ar,
      p.name.en,
      p.subtitle?.ar,
      p.subtitle?.en,
      cat.name.ar,
      cat.name.en,
      p.formulation,
      ...(p.formulations ?? []),
      ...(p.composition ?? []).flatMap((r) => [r.label.ar, r.label.en, r.value]),
      ...(p.compositionTables ?? []).flatMap((t) => t.rows.flat().map((c) => (typeof c === "string" ? c : `${c.ar} ${c.en}`))),
      ...p.benefits.flatMap((b) => [b.ar, b.en]),
      p.keyFeature?.ar,
      p.keyFeature?.en,
      String(p.number),
    ]
      .filter(Boolean)
      .join(" | ");
    return {
      slug: p.slug,
      number: p.number,
      category: p.category,
      categoryName: cat.name[locale],
      name: p.name[locale],
      altName: p.name[other],
      image: p.image,
      spec: headlineSpec(p),
      basis: p.basis ?? null,
      packages: p.packages ? p.packages.map((x) => x[locale]) : null,
      benefit: (p.keyFeature ?? p.benefits[0])[locale],
      needs: needsForProduct(p).map((s) => s.id),
      pesticide: !!p.pesticide,
      search: normalize(haystack),
    };
  });
}
