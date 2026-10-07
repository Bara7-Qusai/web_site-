/**
 * Content types for the Al-Kunooz catalog.
 *
 * All business content lives in `src/data/*` and is kept separate from UI code.
 * Arabic text is taken from the official company profile (the source of truth).
 * English text is a translation of that Arabic source and should be reviewed by
 * the company (see MISSING_INFORMATION.md).
 */

export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** A bilingual string. */
export type L = { ar: string; en: string };

export type CategoryId =
  | "private-label"
  | "fortal-npk"
  | "micronutrients"
  | "calcium-fruit-set"
  | "smart-nutrition-protection"
  | "smart-organic"
  | "growth-regulators"
  | "organic-protection"
  | "pesticides";

export type NeedId =
  | "balanced-growth"
  | "roots-flowering"
  | "flowering-fruit-set"
  | "fruit-set-temperature"
  | "fruit-quality-calcium"
  | "drought-stress"
  | "micronutrient-deficiency"
  | "fungal-diseases"
  | "soil-salinity"
  | "insects"
  | "weeds"
  | "rooting-cuttings";

/** A single "element → amount" composition line. Values are language-neutral (e.g. "20%"). */
export interface SpecRow {
  label: L;
  value: string;
}

export type Cell = L | string;

export interface DataTable {
  caption?: L;
  columns: L[];
  rows: Cell[][];
}

export interface Category {
  id: CategoryId;
  /** Section number used in the printed catalog (03–11). */
  section: number;
  name: L;
  description: L;
  image: string;
}

export interface Product {
  /** Catalog number from the company's Full Product Index (1–59). */
  number: number;
  slug: string;
  category: CategoryId;
  /** Other groups the catalog explicitly lists this product under. */
  alsoIn?: CategoryId[];
  name: L;
  /** Short descriptor printed next to the name in the catalog. */
  subtitle?: L;
  image: string;
  /** Concentration basis printed in the catalog: W/W, W/V, EC, SL. */
  basis?: string;
  form?: L;
  formulation?: string;
  /** `null` means the package size is not yet confirmed in the source ("[يُحدد لاحقاً]"). */
  packages: L[] | null;
  composition?: SpecRow[];
  compositionNote?: L;
  compositionTables?: DataTable[];
  /** Available formulations (Fortal ranges). */
  formulations?: string[];
  keyFeature?: L;
  benefits: L[];
  usage?: L;
  rates?: DataTable;
  precautions?: L[];
  /** Product is a registered pesticide – show label-use warning. */
  pesticide?: boolean;
}

export interface Solution {
  id: NeedId;
  title: L;
  description: L;
  icon: string;
  /** Product slugs recommended in the "Quick Selection Guide" of the company profile. */
  products: string[];
  /** Whole groups referenced by the guide (e.g. "Fortal"). */
  categories?: CategoryId[];
}
