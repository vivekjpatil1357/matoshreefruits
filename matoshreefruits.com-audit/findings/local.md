# Local SEO Audit Findings - Matoshree Fruits

> **Status vs repo (`ab454ed`, verified 2026-11-11):**
> - **Zero `LocalBusiness` schema** — *Still open* (no JSON-LD in `src/`).
> - **"Testimonials are hardcoded"** — *Stale.* Home/feedback testimonial walls now render admin-approved `Feedback` documents from MongoDB (`src/app/[locale]/page.js`, `feedback/page.js`); they are still not schema-marked.
> - **Google Maps embed on `/contact`** — *Still open* (no iframe/embed in `src/`).
> - **NAP source** — Contact details come from `NEXT_PUBLIC_*` env vars via `src/lib/site.js`, not from `src/messages/*.json` (locale JSON still has no address — the table above remains accurate on that point).
> - **GBP / directories** — *Still open*, outside the repo (business-side actions).
> - **`Review` schema** — *Still open* (repo-side, no JSON-LD).

## Executive Summary
- **Business Type:** Farmer-direct B2B wholesale supplier in Sarola, Burhanpur
- **Industry:** Wholesale Agriculture (Banana)
- **Local SEO Score:** 15/100
- **Primary Issue:** Zero structured data, no active Google Business Profile (GBP) integration, no local citations.

## NAP Consistency
| Source | Business Name | Address | Phone |
| :--- | :--- | :--- | :--- |
| Website | Matoshree Fruits | Shreekrishna toll kata, Sarola, Burhanpur, Madhya Pradesh | +91 7000687576 |
| Locale JSON | Matoshree Fruits | (Address missing in source) | +91 7000687576 |

## Critical Findings
1. **GBP Status:** No evidence of a claimed Google Business Profile. Critical for "banana wholesaler near me" searches.
2. **Schema:** Zero `LocalBusiness` structured data. Search engines lack context on location/hours.
3. **Review Signals:** Testimonials are hardcoded and not schema-marked; no integration with Google/external review APIs.
4. **Localization:** High-quality multi-lingual content (EN, HI, MR), but lack of localized meta tags (geo-tagging).

## Prioritized Action Plan
1. **[Critical]** Create/Claim Google Business Profile for "Matoshree Fruits" at the Sarola location.
2. **[Critical]** Implement `LocalBusiness` JSON-LD schema (including address, phone, and geo coordinates).
3. **[High]** Add Google Maps embed to `/contact` page.
4. **[High]** Register on major Indian B2B directories (Justdial, IndiaMART).
5. **[Medium]** Add structured `Review` schema for existing testimonials to help SERP rich results.

*Note: Assessment limited to free web-available data and site content audit. No paid SEO tools used.*
