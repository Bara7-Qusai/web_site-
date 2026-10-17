import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { categories } from "../src/data/categories.ts";
import { branches, company } from "../src/data/company.ts";
import { products } from "../src/data/products.ts";
import { solutions } from "../src/data/solutions.ts";

// Counts printed in the company profile's portfolio overview.
const EXPECTED: Record<string, number> = {
  "private-label": 9,
  "fortal-npk": 4,
  micronutrients: 5,
  "calcium-fruit-set": 4,
  "smart-nutrition-protection": 9,
  "smart-organic": 15,
  "growth-regulators": 5,
  "organic-protection": 4,
  pesticides: 4,
};

test("catalog has all 59 products, numbered 1–59", () => {
  assert.equal(products.length, 59);
  assert.deepEqual(
    products.map((p) => p.number),
    Array.from({ length: 59 }, (_, i) => i + 1),
  );
});

test("each group has the documented number of products", () => {
  assert.equal(categories.length, 9);
  for (const [id, n] of Object.entries(EXPECTED)) {
    assert.equal(products.filter((p) => p.category === id).length, n, id);
  }
});

test("slugs are unique and URL-safe", () => {
  const slugs = products.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const s of slugs) assert.match(s, /^[a-z0-9-]+$/);
});

test("every product is bilingual and has an image", () => {
  for (const p of products) {
    assert.ok(p.name.ar && p.name.en, p.slug);
    assert.ok(existsSync(`public${p.image}`), `${p.slug} image`);
    for (const b of p.benefits) assert.ok(b.ar && b.en, `${p.slug} benefit`);
  }
});

test("only products marked 'to be determined' in the source lack pack sizes", () => {
  const pending = products.filter((p) => p.packages === null).map((p) => p.number);
  assert.deepEqual(pending, [5, 18]);
});

test("Arabic NPK formulas are wrapped in LTR isolates", () => {
  const p = products.find((x) => x.slug === "kunooz-npk-18-46-5")!;
  assert.equal(p.name.ar, "كنوز ⁦18-46-5⁩");
});

test("solution guide references existing products", () => {
  const slugs = new Set(products.map((p) => p.slug));
  assert.equal(solutions.length, 12);
  for (const s of solutions) for (const slug of s.products) assert.ok(slugs.has(slug), `${s.id} → ${slug}`);
});

test("company figures match the profile", () => {
  assert.deepEqual(company.stats.map((s) => s.value), [59, 9, 7, 9]);
  assert.equal(branches.length, 7);
  assert.equal(branches.filter((b) => b.headOffice).length, 1);
});
