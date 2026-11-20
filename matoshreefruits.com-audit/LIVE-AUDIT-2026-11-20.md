# Live SEO Audit — 2026-11-20

**Domain:** `https://www.matoshreefruits.com`  
**Site status:** Public, crawlable, HTTPS, and canonicalized to `www`  
**Overall assessment:** The critical 2026-11-11 technical issues are resolved.
The remaining work is verification, local authority, content accuracy, and
ongoing monitoring rather than foundational metadata repair.

## Passed

| Area | Result |
|---|---|
| Canonical host | Bare domain redirects with `308` to `https://www.matoshreefruits.com/` |
| Public locale routes | 15/15 sampled routes returned `200` |
| Canonicals | All 15 sampled routes use their matching route-specific `www` canonical |
| Hreflang | All 15 routes emit `hi`, `mr`, `en`, and `x-default` alternates |
| Sitemap | 200; all 15 URLs use `www` and include four-way alternates |
| Robots | 200; valid crawler groups and canonical sitemap URL |
| Open Graph | Route-specific canonical, title, description, locale, and image are present |
| Twitter cards | Large-image cards are present |
| Page headings | The 15 sampled routes each render one `<h1>` |
| Structured data | Root `@graph` plus page, breadcrumb, stock, gallery, contact, and FAQ JSON-LD are emitted |
| Security headers | CSP, HSTS, nosniff, frame protection, referrer policy, and permissions policy are live |
| Crawl fallbacks | Unknown paths return `404`; `/admin` redirects; `/api/health` returns `200` |
| AI discovery | `/llms.txt` and `/llms-full.txt` both return `200` |
| Core assets | `/icon.png`, `/hero-leaves.jpg`, and `/logo.png` return `200` |

## Live technical evidence

- Homepage `/` redirects to `/hi` and returns `200`.
- `/en/stock` canonical:
  `https://www.matoshreefruits.com/en/stock`
- `/en/stock` OG URL:
  `https://www.matoshreefruits.com/en/stock`
- `/en/stock` OG image:
  `https://www.matoshreefruits.com/hero-leaves.jpg`
- `/en/stock` title:
  `Available stock | Matoshree Fruits`
- Bare host `https://matoshreefruits.com/` returns `308`.
- Live representative stock page and all locale route samples pass metadata and
  heading checks.

## 2026-11-20 implementation update

- A dedicated branded 1200x630 social card is now served as
  `/social-card.jpg`, and all public metadata uses it.
- The gallery initial-post lightbox state now initializes during state creation
  rather than through an effect. `npm run lint` passes.

## Remaining priorities

### P0 — Search Console and live indexing verification

1. Add or verify the `https://www.matoshreefruits.com/` property in Google
   Search Console.
2. Submit `https://www.matoshreefruits.com/sitemap.xml`.
3. Inspect the 15 sitemap URLs for HTTP status and canonical consistency.
4. Request indexing for the three localized homepages and four primary
   subpage types.
5. Monitor duplicate, alternate-page, crawl, mobile usability, and hreflang
   reports for 2-4 weeks.

### P1 — Verify business facts shown in visible text and structured data

Confirm or replace any unverified values currently used by the contact FAQ:

- `24 Hours`
- `200+ crates` as a typical minimum
- transport assistance policy
- exact address formatting
- exact phone, email, WhatsApp number, and business hours
- exact map coordinates

The FAQPage minimum-order and transport answers are only useful if the numbers
and services are accurate for the business.

### P1 — Local authority

- Claim or complete the Google Business Profile for Sarola/Burhanpur.
- Keep the profile NAP and website URL consistent with the site.
- Create or update verified IndiaMART, Justdial, and TradeIndia listings.
- Publish at least one consistent set of owner/management details and real
  reviews across official profiles.

### P2 — Social and rich-result quality

- Maintain `/social-card.jpg` and replace it when the business brand or offer
  changes. The card is already a verified 1200x630 asset.
- Validate Product/Offer, FAQPage, BreadcrumbList, and LocalBusiness markup with
  Google's Rich Results Test.
- Confirm whether FAQ rich results are desired: avoid including FAQs whose
  answers are generic or not stable.

### P2 — Code quality and robustness

- Fix the lint error in
  `src/app/[locale]/components/GalleryClient.js:58`, caused by synchronous
  `setState` in an effect.
- Resolve or validate the `SearchAction` in the `WebSite` JSON-LD. The
  template uses a placeholder `{locale}` and should only exist if a real
  site-wide query interface is implemented.
- Add HSTS `includeSubDomains` and `preload` only after all subdomains are
  HTTPS-ready.

### P2 — Freshness and crawl value

- The stock page currently says "No stock listed right now" in live output.
- Keep fresh stock posts active, add accurate quantities/varieties/grades, and
  avoid stale gallery or testimonial content.
- Add or verify `lastUpdated`/real publish metadata for indexable content where
  it is materially useful.

## Estimated remaining SEO health

The current code-level SEO health is approximately **90-95/100**.

The missing 5-10 points are mainly outside crawlable code:

- Google/Bing search-console verification and submission
- Google Business Profile and citation consistency
- live business-fact accuracy
- fresh stock and review content
- external validation of rich results
