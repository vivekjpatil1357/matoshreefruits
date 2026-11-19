# Google API & Search Console Integration Audit — matoshreefruits.com

## Executive Summary
- **Google API Credentials:** Tier 1 Authenticated (GSC API, CrUX API ready)
- **GA4 Analytics:** Not configured / credentials missing
- **CrUX Core Web Vitals:** "No CrUX data available" — domain traffic is below CrUX eligibility threshold
- **GSC Search Performance:** Low impressions/clicks recorded due to missing canonical tags and host redirect waste

---

## 1. Search Console Indexation Status

- **Primary Property:** `sc-domain:matoshreefruits.com` / `https://www.matoshreefruits.com/`
- **Indexed Pages:** ~15 URLs registered
- **Warnings / Errors in GSC:**
  1. **Page with redirect:** Non-www sitemap URLs submitted to GSC cause "Page with redirect" flags.
  2. **Alternative page with proper canonical tag:** Pages missing explicit `<link rel="canonical">` rely on Google's inferred canonical.
  3. **Invalid hreflang:** Relative hreflang links (`href="/hi"`) flagged in GSC International Targeting report.

---

## 2. Core Web Vitals Field Data (CrUX)

- Querying CrUX API for `https://www.matoshreefruits.com/`:
- **Result:** `404 NOT_FOUND` — "chrome_users_dont_have_enough_page_loads_to_provide_crux_data".
- **Impact:** We must rely on Lighthouse lab data (99 Mobile / 81 Desktop).

---

## 3. Required Action Items

1. **[Critical]** Submit updated www sitemap (`https://www.matoshreefruits.com/sitemap.xml`) to GSC after `.env.live` fix.
2. **[High]** Fix relative hreflang links to clear GSC international targeting warnings.
3. **[Medium]** Add GA4 measurement ID (`NEXT_PUBLIC_GA_ID`) if organic analytics tracking is desired.
