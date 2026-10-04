/**
 * Generates the downloadable PDF catalogs from the printable catalog page.
 *
 *   npm run build && npm run start   # in one terminal (or any running instance)
 *   npm run catalog:pdf              # in another
 *
 * Output: public/downloads/al-kunooz-catalog-ar.pdf and -en.pdf
 * Requires Playwright (`npm i -D playwright`) or a globally available Chromium.
 */
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(process.env.PLAYWRIGHT_MODULE ?? import.meta.url);
const { chromium } = require("playwright");

const base = process.env.CATALOG_BASE_URL ?? "http://localhost:3000";
const executablePath = process.env.CHROMIUM_PATH || undefined;

await mkdir("public/downloads", { recursive: true });
const browser = await chromium.launch(executablePath ? { executablePath } : {});
try {
  for (const lang of ["ar", "en"]) {
    const page = await browser.newPage();
    await page.goto(`${base}/${lang}/catalog`, { waitUntil: "networkidle" });
    // Make sure every lazy image is loaded before printing.
    await page.evaluate(async () => {
      for (const img of Array.from(document.images)) {
        img.loading = "eager";
        if (!img.complete) await new Promise((r) => img.addEventListener("load", r, { once: true }));
      }
    });
    const out = `public/downloads/al-kunooz-catalog-${lang}.pdf`;
    await page.pdf({ path: out, format: "A4", printBackground: true, margin: { top: "12mm", bottom: "12mm", left: "10mm", right: "10mm" } });
    console.log("✓", out);
    await page.close();
  }
} finally {
  await browser.close();
}
