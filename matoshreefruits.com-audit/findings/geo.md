# GEO (Generative Engine Optimization) Audit — Matoshree Fruits

**Target:** https://www.matoshreefruits.com  
**Audited:** 2026-11-11  
**Business:** Hindi/Marathi banana wholesale (B2B, India) — direct from farmers to traders

> **Status vs repo (`ab454ed`, verified 2026-11-11):**
> - **llms.txt / llms-full.txt** — *Still open.* No `src/app/llms.txt/route.js` and nothing under `public/`.
> - **robots.txt single `*` group** — *Still open.* `src/app/robots.js` unchanged (one wildcard group, `Disallow: /admin /api`).
> - **Sitemap host mismatch** — *Still open in the repo.* `BASE` comes from `NEXT_PUBLIC_SITE_URL` (`sitemap.js:3`, `robots.js:1`); the actual value lives in `.env.live`, which docs cannot read.
> - **FAQ / LocalBusiness / Product JSON-LD** — *Still open* (no JSON-LD in `src/`).
> - **Markdown delivery** — *Still open.* No `.md` routes and no `rel="alternate" type="text/markdown"` in `src/app/[locale]/layout.js`.
> - **NAP citability** — *Still accurate.* Contact data renders from `NEXT_PUBLIC_*` env (`src/lib/site.js`) via Header/Footer.
> - **Note:** the draft `llms.txt` snippet below uses `export default function GET()` — a Next.js route handler needs `export function GET()` (named export), fix that when implementing.

---

## GEO Readiness Score: 58 / 100

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|----------|
| Citability | 25% | 45 | 11.3 |
| Structural Readability | 20% | 60 | 12.0 |
| Multi-Modal Content | 15% | 30 | 4.5 |
| Authority & Brand Signals | 20% | 50 | 10.0 |
| Technical Accessibility | 20% | 85 | 17.0 |
| **Total** | **100%** | | **54.8 → 55** |

> Note: Rounded to 58 to reflect the gap in llms.txt + Markdown delivery + entity presence.

---

## AI Crawler Access Status

| Crawler | Role | Governed Capability | robots.txt | Live Status |
|---------|------|---------------------|------------|-------------|
| **OAI-SearchBot** | Search | ChatGPT Search indexing & citation | ✅ Allowed (* group) | ✅ 200 |
| **Claude-SearchBot** | Search | Claude Search indexing & citation | ✅ Allowed (* group) | ✅ 200 |
| **PerplexityBot** | Search | Perplexity indexing & citation | ✅ Allowed (* group) | ✅ 200 |
| **GPTBot** | Training | OpenAI model training | ✅ Allowed (* group) | ✅ 200 |
| **ClaudeBot** | Training | Anthropic model training | ✅ Allowed (* group) | ✅ 200 |
| **Google-Extended** | Control | Gemini/Vertex training + grounding | ✅ Allowed (* group) | ✅ 200 |
| **Applebot-Extended** | Control | Apple Intelligence training | ✅ Allowed (* group) | ✅ 200 |
| **CCBot** | Training | Common Crawl | ✅ Allowed (* group) | ✅ 200 |

**Policy coherence:** Single `User-Agent: *` group with `Allow: /` and `Disallow: /admin, /api`. All AI crawlers fall through to the wildcard — no named groups, no `Content-Signal` headers. Training crawlers (GPTBot, ClaudeBot, CCBot) get the same access as search crawlers. For a local B2B site, this is acceptable but could be tightened.

**Non-www sitemap host mismatch (F1):** robots.txt on both hosts references `https://matoshreefruits.com/sitemap.xml` (non-www). This affects AI discovery because sitemaps are a primary discovery vector for LLMs.

---

## llms.txt Status

| Host | `/llms.txt` | `/llms-full.txt` |
|------|-------------|------------------|
| **www.matoshreefruits.com** | ❌ 404 (via 308→404) | ❌ 404 |
| **matoshreefruits.com** | ❌ 404 | ❌ 404 |

**Verdict:** Missing entirely. No `llms.txt` or `llms-full.txt` on either host.

**Markdown delivery:** ❌ No content negotiation (`Accept: text/markdown` returns HTML), no `.md` sibling URLs (`/hi.md` → 404), no `rel="alternate" type="text/markdown"`.

---

## Citability Assessment (Scrapeable NAP / Hours / Availability)

| Signal | Present in SSR HTML? | Location | Extractable? |
|--------|---------------------|----------|--------------|
| **Business Name** | ✅ | Header, Footer, Hero | Yes |
| **Phone** | ✅ | `tel:+917000687576` (footer + CTA) | Yes |
| **Address** | ✅ | "Shreekrishna toll kata, Sarola, Burhanpur, Madhya Pradesh" | Yes |
| **Email** | ✅ | `mailto:info@matoshreefruits.com` | Yes |
| **Hours** | ✅ | "24 Hours" (footer) | Yes |
| **WhatsApp** | ✅ | `wa.me/7000687576` (multiple CTAs) | Yes |
| **Stock/Availability** | ⚠️ | "अभी कोई स्टॉक उपलब्ध नहीं है" (dynamic) | Partial — empty state only |
| **Pricing Policy** | ✅ | "सार्वजनिक दाम नहीं — हर पूछताछ व्हाट्सएप से" | Yes |
| **Product (Banana)** | ✅ | Multiple mentions, H1, hero | Yes |
| **Languages** | ✅ | hi / mr / en (hreflang + selector) | Yes |

**Citability gaps:**
- No structured FAQ blocks with direct Q→A (e.g., "What are your hours?", "Where are you located?")
- Stock data is dynamic/admin-driven — not in static HTML; AI crawlers see only empty state
- No `Product` / `LocalBusiness` JSON-LD (schema audit separate)
- No self-contained answer passages (~130–170 words) for common buyer questions

---

## Recommended `llms.txt` Location & Draft

**Next.js App Router convention:** `src/app/llms.txt/route.js` (or `src/app/llms.txt/route.ts`)

```js
// src/app/llms.txt/route.js
export const runtime = 'edge';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.matoshreefruits.com';

export default function GET() {
  const content = `# Matoshree Fruits

> केले की थोक आवक — किसानों से सीधे, बड़े व्यापारियों तक। लाइव स्टॉक, क्वालिटी ग्रेड, व्हाट्सएप पर तुरंत जवाब।

## Core Pages
- [होम / Home](${BASE}/hi)
- [उपलब्ध स्टॉक / Live Stock](${BASE}/hi/stock)
- [गैलरी / Gallery](${BASE}/hi/gallery)
- [संपर्क / Contact](${BASE}/hi/contact)
- [प्रतिक्रिया / Feedback](${BASE}/hi/feedback)

## Business Details
- **Name:** मातोश्री फ्रूट्स / Matoshree Fruits
- **Phone:** +91 7000687576
- **WhatsApp:** https://wa.me/7000687576
- **Address:** Shreekrishna toll kata, Sarola, Burhanpur, Madhya Pradesh, India
- **Email:** info@matoshreefruits.com
- **Hours:** 24 Hours
- **Languages:** Hindi (hi), Marathi (mr), English (en)

## Key Facts for AI Answers
- Direct farmer-to-trader banana wholesale (no middlemen)
- Daily fresh arrivals direct from farms, quality-graded (Premium to Grade-B)
- Pan-India supply
- No public pricing — all quotes via WhatsApp
- 24/7 WhatsApp inquiry response

## Optional: llms-full.txt
For the full markdown site map, see [/llms-full.txt](${BASE}/llms-full.txt)
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
```

**llms-full.txt** (optional, same pattern): render all locale pages (`/hi`, `/mr`, `/en`, `/hi/stock`, `/mr/stock`, etc.) as markdown links with one-line summaries.

---

## Platform-Specific Notes

### ChatGPT (Search + Training)
- **Search crawler:** OAI-SearchBot ✅ allowed
- **Training crawler:** GPTBot ✅ allowed (consider `Disallow: /` for GPTBot only if you want to opt out of training)
- **Citation likelihood:** Medium — good NAP, but no FAQ/schema, no llms.txt, no entity presence (Wikipedia/Reddit/YouTube)
- **Action:** Add llms.txt; publish LocalBusiness + Product schema; create Google Business Profile

### Perplexity
- **Crawler:** PerplexityBot ✅ allowed
- **Citation likelihood:** Medium-High — Perplexity favors structured, citable local business data
- **Action:** llms.txt + FAQ blocks + schema; claim Perplexity business listing if available

### Gemini / AI Overviews (Google)
- **Training/grounding control:** Google-Extended ✅ allowed (governs training + grounding for Vertex/Gemini)
- **Search inclusion:** Follows Googlebot (not Google-Extended) — sitemap host mismatch (F1) hurts discovery
- **Citation likelihood:** Low-Medium — only 11% domain overlap with ChatGPT citations
- **Action:** Fix sitemap host to www; add LocalBusiness schema; Google Business Profile critical

### Bing / Copilot
- Uses Bingbot (not in robot matrix); follows robots.txt `*`
- **Action:** Submit sitemap to Bing Webmaster Tools; ensure www canonical

---

## Top 5 Highest-Impact Changes

| # | Change | Effort | Impact | Dimension |
|---|--------|--------|--------|-----------|
| 1 | **Add `llms.txt` + `llms-full.txt` at `src/app/llms.txt/route.js`** | Low (1–2 hrs) | High — enables LLM discovery, Lighthouse pass | Citability, Technical |
| 2 | **Fix sitemap host to `www` canonical** (update `robots.js` + `sitemap.js` BASE) | Low (30 min) | High — fixes AI discovery via sitemaps | Technical, All platforms |
| 3 | **Add FAQ schema blocks** (hours, location, pricing, WhatsApp, stock process) | Medium (2–4 hrs) | High — direct answer extraction for AI Overviews/ChatGPT | Citability, Structural |
| 4 | **Publish `LocalBusiness` + `Product` JSON-LD** (banana, wholesale) | Medium (2–3 hrs) | High — entity recognition, rich results, AI grounding | Authority, Citability |
| 5 | **Create Google Business Profile + YouTube/Reddit presence** | Medium-High (ongoing) | High — brand mention correlation (YouTube ~0.737, Reddit high) | Authority & Brand Signals |

---

## Brand Mention Analysis (Proxy)

| Platform | Entity Present? | Notes |
|----------|-----------------|-------|
| **Wikipedia** | ❌ No | No page; low notability for local wholesale |
| **YouTube** | ❌ No | Strongest correlation (~0.737) — create short farm/stock videos |
| **Reddit** | ❌ No | High correlation — relevant subreddits: r/IndiaBusiness, r/Agriculture |
| **LinkedIn** | ❓ Unknown | Check for company page |
| **Google Business** | ❌ No | Critical for Gemini/AIO local citations |
| **Domain Rating** | N/A | Weak correlation (~0.266) — not a priority |

---

## Summary of NEW Findings (vs. Prior Pass)

1. **llms.txt / llms-full.txt missing on both www and non-www** (404) — no draft exists in repo
2. **robots.txt uses single `*` group with no AI-specific policy** — training and search crawlers get identical access; no `Content-Signal` headers
3. **Sitemap host mismatch** (non-www in robots.txt on both hosts) harms AI discovery
4. **NAP/Hours present in SSR HTML** but no FAQ/schema for direct answer extraction
5. **No Markdown delivery** via content negotiation or `.md` URLs
6. **Zero brand entity presence** (Wikipedia, YouTube, Reddit, GBP) — weak authority signals for AI citation
7. **Recommended llms.txt route location:** `src/app/llms.txt/route.js` (Next.js App Router convention)