/**
 * Text normalization for bilingual search.
 * Arabic: strips diacritics/tatweel and unifies letter variants (أ إ آ → ا, ى → ي, ة → ه, ؤ → و, ئ → ي).
 * Latin: lower-cases and folds subscript digits (P₂O₅ → p2o5).
 */
const SUBSCRIPTS: Record<string, string> = {
  "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9",
};

export function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\u2066-\u2069\u200e\u200f]/g, "")
    .replace(/[ً-ْٰـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[₀-₉]/g, (c) => SUBSCRIPTS[c] ?? c)
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every whitespace-separated term of the query must appear in the haystack. */
export function matches(haystack: string, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  return q.split(" ").every((term) => haystack.includes(term));
}
