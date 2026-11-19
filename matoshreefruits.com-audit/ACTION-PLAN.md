# Action Plan: Matoshree Fruits SEO & AI Readiness

Prioritized implementation roadmap based on the comprehensive SEO audit.

---

## Phase 1: Critical Fixes (Week 1)
*Impact: Unblocks indexing, stops redirect waste, establishes core identity.*

1. **Fix Host Canonical Mismatch (`.env.live`)**
   - **Action:** Change `NEXT_PUBLIC_SITE_URL=https://matoshreefruits.com` to `https://www.matoshreefruits.com` in `.env.live` and in the Vercel project settings dashboard.
   - **Files:** `.env.live:14`, Vercel Environment Variables.
2. **Configure `metadataBase` & Canonical Tags**
   - **Action:** Add `metadataBase` to `next.config.mjs` and configure explicit canonical URLs and absolute hreflang alternates in `src/app/[locale]/layout.js`.
   - **Files:** `next.config.mjs`, `src/app/[locale]/layout.js`.
3. **Inject LocalBusiness & Organization Schema**
   - **Action:** Add the JSON-LD `@graph` script block (LocalBusiness, Organization, WebSite) into the root layout (`src/app/[locale]/layout.js`).
   - **Files:** `src/app/[locale]/layout.js`.

---

## Phase 2: High-Impact Improvements (Weeks 2–3)
*Impact: Enhances security, AI discoverability, and UX performance.*

1. **Add Security Headers**
   - **Action:** Configure `headers()` in `next.config.mjs` for `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, and CSP.
   - **Files:** `next.config.mjs`.
2. **Add `llms.txt` and `llms-full.txt`**
   - **Action:** Create an Edge route handler at `src/app/llms.txt/route.js` serving LLM-friendly markdown summaries of the business and stock pages.
   - **Files:** `src/app/llms.txt/route.js`.
3. **Fix Desktop Footer CLS**
   - **Action:** Add `min-h-[400px]` (or appropriate height) to the footer element in `src/app/[locale]/components/Footer.js`.
   - **Files:** `src/app/[locale]/components/Footer.js`.
4. **Optimize Homepage Title Tag**
   - **Action:** Update locale translation JSON files (`messages/hi.json`, `mr.json`, `en.json`) to include wholesale keyword modifiers in the site title.
   - **Files:** `messages/*.json`.

---

## Phase 3: Content & Local Authority (Month 2)
*Impact: Drives local pack rankings and AI search citations.*

1. **Claim & Optimize Google Business Profile**
   - **Action:** Set up/claim GBP at "Shreekrishna toll kata, Sarola, Burhanpur, MP" with primary category "Wholesaler / Fruit & Vegetable Wholesaler".
2. **Register on Indian B2B Directories**
   - **Action:** Create verified business profiles on IndiaMART, Justdial, and TradeIndia.
3. **Add FAQ Schema & Sections**
   - **Action:** Add an FAQ section addressing minimum order quantities, transport, and WhatsApp inquiry processes with `FAQPage` JSON-LD schema.

---

## Phase 4: Monitoring & Iteration (Ongoing)
*Impact: Sustains long-term growth and traffic.*

1. **Google Search Console Monitoring**
   - Verify indexation clearance of redirect URLs and hreflang warning resolution.
2. **AI Citation Tracking**
   - Test queries in ChatGPT Search and Perplexity to verify brand visibility and llms.txt parsing.
