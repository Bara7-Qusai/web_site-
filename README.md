# Al-Kunooz Agricultural Solutions — Website

**الكنوز للحلول الزراعية — شريكك في النمو · Your Partner in Growth**

Bilingual (Arabic RTL / English LTR) corporate website and product catalog for Al-Kunooz
Agricultural Solutions. All business content comes from the company profile
*Al-Kunooz Company Profile & Product Catalog*; nothing has been invented. See
[`MISSING_INFORMATION.md`](./MISSING_INFORMATION.md) for what the company still needs to supply.

## Features

| Area | What's included |
|---|---|
| **Pages** | Home, About, Product catalog, 59 product detail pages, Agricultural solutions, Contact, Product comparison, printable catalog — each in Arabic and English (139 pre-rendered pages) |
| **Catalog** | All 59 products in the 9 documented groups. Instant bilingual search (name, formulation, nutrient, benefit; Arabic letter-variant tolerant), group filter, crop-need filter, 4 sort orders, filters kept in the URL so views can be shared |
| **Product pages** | Composition tables, available formulations, packs, key feature, benefits, usage, application-rate tables, precautions, pesticide label warning, related products, "suggested for" crop needs |
| **Solutions** | The profile's 12-goal *Quick Selection Guide*, with a clear "general information, not agronomic advice" notice |
| **Inquiries** | Validated inquiry form (product / distributor / wholesale / technical / general) with product pre-fill, honeypot, rate limiting and same-origin check; delivery by SMTP email and/or webhook |
| **WhatsApp & phone** | Buttons appear automatically once a verified number is configured; hidden until then |
| **Comparison** | Compare up to 3 products side by side (saved in the browser, shareable URL) |
| **Downloads** | Arabic and English PDF catalogs (`public/downloads/`), generated from the printable catalog page |
| **SEO** | Per-page bilingual titles/descriptions, canonical + `hreflang` alternates, Open Graph, `sitemap.xml`, `robots.txt`, JSON-LD (Organization, Product, BreadcrumbList), semantic headings |
| **Accessibility** | Skip link, keyboard-navigable menus/filters, visible focus rings, `aria-live` result counts, labelled form fields with linked error messages, reduced-motion support |
| **Performance** | Static generation, `next/image` (AVIF/WebP, responsive sizes, lazy loading), self-hosted fonts, CSS-only scroll animations |

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Zod** (shared client/server validation), **Nodemailer** (SMTP delivery)
- Fonts: IBM Plex Sans Arabic + Manrope, self-hosted via Fontsource

## Getting started

Requirements: **Node.js 22.6+** and npm.

```bash
npm install
cp .env.example .env.local      # optional; fill in values you have
npm run dev                     # http://localhost:3000 → redirects to /ar or /en
```

Production:

```bash
npm run build
npm run start                   # serves on port 3000 (PORT=xxxx to change)
```

## Configuration

All settings are environment variables — see [`.env.example`](./.env.example).

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL (canonical links, sitemap). **Set this in production.** |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Enables WhatsApp buttons (digits only, international format) |
| `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_EMAIL` | Shown on contact page and footer |
| `SMTP_*`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL` | Email delivery of inquiries (server-only) |
| `INQUIRY_WEBHOOK_URL` | Alternative/extra delivery as JSON POST (server-only) |

`NEXT_PUBLIC_*` values are embedded at **build time** — rebuild after changing them.
SMTP credentials and the webhook URL are only read in the API route and never reach the browser.

**Inquiry form behaviour:** if neither SMTP nor a webhook is configured, the API returns
`503` in production and the form tells visitors that online inquiries are not enabled yet
(pointing them to Facebook and the branches). In development, inquiries are logged to the
server console instead.

## Project structure

```
src/
  app/
    [lang]/                 # every page, for /ar and /en
      page.tsx              # home
      about/ products/ products/[slug]/ solutions/ contact/ compare/ catalog/
      layout.tsx            # <html lang dir>, header, footer, compare tray
    api/inquiry/route.ts    # inquiry endpoint (validation, rate limit, delivery)
    sitemap.ts robots.ts manifest.ts icon.png global-not-found.tsx
  components/               # UI components (header, cards, catalog browser, form…)
  config/site.ts            # contact config read from env
  data/                     # ← ALL business content (edit here)
    products.ts             # 59 products
    categories.ts           # 9 product groups
    solutions.ts            # quick selection guide (needs → products)
    company.ts              # about, vision, mission, values, branches, management
    types.ts
  i18n/
    config.ts               # locales, RTL/LTR, path helpers
    dictionaries.ts         # all UI strings in Arabic and English
  lib/                      # search, validation, SEO, catalog helpers, delivery
  proxy.ts                  # redirects "/" to the visitor's language
public/images/              # product, category and brand images
public/downloads/           # generated PDF catalogs
scripts/                    # data validator, PDF generator
tests/                      # unit tests + e2e smoke test
```

## Editing products

Products live in `src/data/products.ts` — no UI code needs to change.

1. Add the image to `public/images/products/<slug>.jpg` (square-ish, ≥ 800 px, light background).
2. Add/edit an entry. Each text field is bilingual: `t("نص عربي", "English text")`.
   Pack sizes use the `pk()` helper, e.g. `pk("L", 1, 5, 20)`; use `packages: null` if unknown.
3. Run `npm run validate:data` (checks unique slugs, images, translations, solution links).
4. Rebuild. The product automatically appears in the catalog, search, sitemap, its group,
   the comparison tool and the printable catalog.
5. Regenerate the PDFs if needed (below).

UI text (buttons, labels, messages) is in `src/i18n/dictionaries.ts`.

## Testing

```bash
npm run typecheck        # TypeScript
npm run lint             # ESLint (Next.js core-web-vitals rules)
npm test                 # unit tests: catalog data (59 products, group counts…), search, validation
npm run validate:data    # catalog data report

# End-to-end smoke test (needs Playwright: npm i -D playwright && npx playwright install chromium)
npm run build && npm run start        # terminal 1
npm run test:e2e                      # terminal 2
```

The e2e test covers locale redirect, RTL/LTR, search, filters + URL sync, crop-need filter,
language switching on a product page, comparison, form validation/pre-fill/submission, and 404s.

## Regenerating the PDF catalogs

The PDFs are printed from `/ar/catalog` and `/en/catalog` with headless Chromium:

```bash
npm run build && npm run start        # terminal 1
npm run catalog:pdf                   # terminal 2 → public/downloads/al-kunooz-catalog-{ar,en}.pdf
```

Set `CATALOG_BASE_URL` to print from another host, or `PLAYWRIGHT_MODULE` / `CHROMIUM_PATH`
to use a global Playwright/Chromium install.

## Deployment

**Vercel (simplest):** import the repository, set the environment variables, deploy.
Node.js runtime is required for the inquiry API (no static export).

**Any Node host / VPS:**

```bash
npm ci && npm run build
NODE_ENV=production PORT=3000 npm run start   # behind Nginx/Caddy with HTTPS
```

Use a process manager (pm2, systemd) and a reverse proxy that forwards `X-Forwarded-For`
(used by the inquiry rate limiter).

**Checklist before going live**

- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain
- [ ] Phone / WhatsApp / email confirmed and set
- [ ] SMTP or webhook configured, then a test inquiry sent
- [ ] Branch map links added in `src/data/company.ts`
- [ ] English translations reviewed (see `MISSING_INFORMATION.md`)
- [ ] Domain added to Google Search Console and `sitemap.xml` submitted
