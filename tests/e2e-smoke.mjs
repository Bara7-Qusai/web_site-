/**
 * End-to-end smoke test against a running server (default http://localhost:3000).
 *   npm run build && npm run start   # terminal 1
 *   npm run test:e2e                 # terminal 2
 * Uses Playwright (`npm i -D playwright`, or set PLAYWRIGHT_MODULE to a global install).
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(process.env.PLAYWRIGHT_MODULE ?? import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
const step = (name) => console.log("•", name);

try {
  step("root redirects to a locale");
  await page.goto(BASE + "/");
  assert.match(page.url(), /\/(ar|en)\/?$/);

  step("Arabic home is RTL, English home is LTR");
  await page.goto(BASE + "/ar");
  assert.equal(await page.getAttribute("html", "dir"), "rtl");
  await page.goto(BASE + "/en");
  assert.equal(await page.getAttribute("html", "dir"), "ltr");

  step("catalog lists all 59 products");
  await page.goto(BASE + "/en/products");
  const count = () => page.locator("main ul > li article").count();
  assert.equal(await count(), 59);

  step("search filters by formulation and by Arabic name");
  await page.fill('input[type="search"]', "20-20-20");
  await page.waitForTimeout(300);
  assert.ok((await count()) >= 2 && (await count()) < 59);
  await page.fill('input[type="search"]', "كال ماك");
  await page.waitForTimeout(300);
  assert.ok(await page.getByRole("heading", { name: /CAL MAG/ }).first().isVisible());
  assert.match(page.url(), /q=/);

  step("category filter + URL sync");
  await page.getByRole("button", { name: "Clear filters" }).first().click();
  await page.getByRole("button", { name: /Pesticides/ }).click();
  await page.waitForTimeout(200);
  assert.equal(await count(), 4);
  assert.match(page.url(), /category=pesticides/);
  await page.reload();
  await page.waitForTimeout(300);
  assert.equal(await count(), 4, "filter restored from URL");

  step("crop-need filter");
  await page.goto(BASE + "/en/products?need=weeds");
  await page.waitForTimeout(300);
  assert.equal(await count(), 2);

  step("product page + language switch keeps the product");
  await page.goto(BASE + "/en/products/cal-mag");
  assert.ok(await page.getByRole("heading", { level: 1, name: /CAL MAG/ }).isVisible());
  await page.getByRole("link", { name: "التبديل إلى العربية" }).first().click();
  await page.waitForURL(/\/ar\/products\/cal-mag/);
  assert.equal(await page.getAttribute("html", "lang"), "ar");

  step("compare: add two products and open the comparison");
  await page.goto(BASE + "/en/products/cal-mag");
  await page.getByRole("button", { name: "Add to compare" }).first().click();
  await page.goto(BASE + "/en/products/microfert-cal");
  await page.getByRole("button", { name: "Add to compare" }).first().click();
  await page.getByRole("link", { name: "Compare now" }).click();
  await page.waitForURL(/compare\?items=/);
  assert.equal(await page.locator("thead th").count(), 3);

  step("inquiry form validates and pre-fills from the product link");
  await page.goto(BASE + "/en/contact?product=cal-mag&type=wholesale");
  await page.waitForTimeout(300);
  assert.equal(await page.inputValue('select[name="product"]'), "cal-mag");
  assert.ok(await page.locator('input[value="wholesale"]').isChecked());
  await page.getByRole("button", { name: "Send inquiry" }).click();
  assert.ok(await page.getByText("Please enter your name").isVisible());
  await page.fill('input[name="name"]', "Test Farmer");
  await page.fill('input[name="phone"]', "+249 912 345 678");
  await page.fill('textarea[name="message"]', "Please send prices for Cal Mag 1 L.");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  // Either delivered (configured / dev logging) or a clear "not enabled yet" message in production.
  await page.waitForSelector("text=/Thank you|not enabled yet/", { timeout: 10000 });

  step("unknown product → 404");
  const res = await page.goto(BASE + "/en/products/does-not-exist");
  assert.equal(res.status(), 404);

  assert.deepEqual(errors, [], "no uncaught page errors");
  console.log("\n✓ e2e smoke test passed");
} finally {
  await browser.close();
}
