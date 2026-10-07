# Information & assets the company needs to supply

The website only shows information found in the company profile
(*Al-Kunooz Company Profile & Product Catalog*). The items below are missing from that
document or need confirmation. Nothing has been invented to fill these gaps.

## 1. Contact details (high priority)

| Item | Status in source | Where to add it |
|---|---|---|
| Phone / WhatsApp number | `[أدخل رقم الهاتف]` placeholder | `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_WHATSAPP_NUMBER` env vars |
| Email address | `[أدخل البريد الإلكتروني]` placeholder | `NEXT_PUBLIC_EMAIL` env var |
| Head-office street address (Khartoum) | `[أدخل عنوان الشركة]` placeholder | `src/i18n/dictionaries.ts` → `contact.addressValue` |
| Google Maps links for the 7 branches | `[رابط الموقع يُضاف لاحقاً]` for every branch | `src/data/company.ts` → `branches[].mapUrl` |
| Branch phone numbers / opening hours | Not in source | `src/data/company.ts` (add fields) |
| Inbox for website inquiries (SMTP account or webhook) | — | `.env` (see `.env.example`) |

Until these are provided, WhatsApp and phone buttons are hidden, the contact page shows
"Coming soon", and the inquiry form tells visitors that online inquiries are not enabled yet.

## 2. Product data to confirm

| # | Product | Issue |
|---|---|---|
| 05 | Al-Kunooz Liquid NPK 11-8-6 | Pack size marked "to be determined" (`[يُحدد لاحقاً]`). Product photo in the profile is a "photo coming soon" placeholder. |
| 18 | Power Boron B 15% | Pack size marked "to be determined". Concentration basis (W/W or W/V) not stated. |
| 03 | Kunooz NPK 18-46-5 | Composition printed as N / P / K (not P₂O₅ / K₂O) and no W/W or W/V basis — please confirm. |
| 07 | PHOSPHORO 0-60-5 + T.E | Potassium printed as "K" (not K₂O) — please confirm. |
| 38 | AMINOFERT Manganese | Composition printed as "N 1.2%, **Zn** 6%, Amino Acid 12%" — likely should be **Mn**; shown exactly as printed until confirmed. |
| 11 | Fortal Suspension NPK | Labelled W/V but pack sizes are in kg (1, 5, 15, 20 kg) — please confirm units. |
| 01–02 | Al-Kunooz Soluble NPK | "1 كجم" vs. "كغم" elsewhere — normalized display only. |
| 47–51 | Growth regulators | No application rates in the source (only Endolin has dilution ratios). |
| Most products | — | Application rates, timings and safety precautions are only documented for a few products (#01, #02, #04, #05, #08, #51). The site shows rate tables only where the source provides them. |
| 56–59 | Pesticides | Registration numbers and pre-harvest intervals are only given for AGROMETHRIN (reg. no. 1678, India). Please supply label data for AGROCEL, SAADSATE and AGROGOAL. |
| 54 | NEMAGUARD | The profile says it is approved by OMRI ("مجاز من هيئة الزراعة العضوية OMRI"). Please provide the OMRI listing or certificate before relying on this publicly. |

## 3. Translation review

- All English descriptive text (benefits, usage, rates, category descriptions, company texts)
  is a translation of the Arabic source and should be reviewed by the company.
  Product pages tell English readers that the Arabic version prevails.
- English spelling of the General Manager's name ("Saad Abdalla Altoum") is a transliteration
  of سعد عبد الله التوم — please confirm the preferred spelling.
- Region names in English (e.g. "Eastern region" for ولاية الشرق) — please confirm.

## 4. Brand & media assets

- **Farm and field photography.** The site currently uses the product photos and catalog
  artwork from the profile. Authentic photos of the team, branches, warehouses, field days or
  customers' crops would strengthen the home and about pages.
- High-resolution product photos (current images are ~280 px wide for most products, taken
  from the Word document). Recommended: ≥ 1200 px, consistent background.
- Vector logo (SVG) and an English/Latin version of the logo, if one exists.
- Product labels / technical data sheets (PDF) per product, if available for download.

## 5. Not included (needs business decision)

- Prices, stock availability, online ordering.
- Customer testimonials, certifications, awards, company history/founding year —
  none are in the source, so none are shown.
- A web-based admin panel. Product content is edited in `src/data/products.ts`
  (see README → "Editing products"). A headless CMS can be added later if non-developers
  need to edit content.
