/**
 * Validates the product catalog data. Run after editing src/data/*:
 *   npm run validate:data
 */
import { existsSync } from "node:fs";
import { categories } from "../src/data/categories.ts";
import { products } from "../src/data/products.ts";
import { solutions } from "../src/data/solutions.ts";

const problems: string[] = [];
const slugs = new Set<string>();
const numbers = new Set<number>();

for (const p of products) {
  if (slugs.has(p.slug)) problems.push(`Duplicate slug: ${p.slug}`);
  if (numbers.has(p.number)) problems.push(`Duplicate catalog number: ${p.number}`);
  slugs.add(p.slug);
  numbers.add(p.number);
  if (!/^[a-z0-9-]+$/.test(p.slug)) problems.push(`Invalid slug (use a-z, 0-9, -): ${p.slug}`);
  if (!categories.some((c) => c.id === p.category)) problems.push(`${p.slug}: unknown category ${p.category}`);
  if (!p.name.ar || !p.name.en) problems.push(`${p.slug}: missing Arabic or English name`);
  if (!existsSync(`public${p.image}`)) problems.push(`${p.slug}: image not found at public${p.image}`);
  if (!p.benefits.length) problems.push(`${p.slug}: no benefits listed`);
  for (const b of p.benefits) if (!b.ar || !b.en) problems.push(`${p.slug}: benefit missing a translation`);
}

for (const s of solutions) {
  for (const slug of s.products) if (!slugs.has(slug)) problems.push(`Solution ${s.id}: unknown product ${slug}`);
}

console.log(`Products: ${products.length}`);
for (const c of categories) {
  console.log(`  ${String(c.section).padStart(2, "0")} ${c.name.en.padEnd(42)} ${products.filter((p) => p.category === c.id).length}`);
}
const pending = products.filter((p) => p.packages === null).map((p) => `#${p.number} ${p.name.en}`);
if (pending.length) console.log(`Pack size to be confirmed: ${pending.join(", ")}`);

if (problems.length) {
  console.error(`\n✗ ${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log("\n✓ Catalog data is valid");
