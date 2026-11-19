# Technical SEO Audit — matoshreefruits.com
**Date:** 2026-11-11  
**Crawl:** 15 locale pages (hi/mr/en × 5 paths)  
**Stack:** Next.js 16.4.2 (Vercel, prerendered/SSR)

> **Status vs repo (`ab454ed`, verified 2026-11-11):**
> - **§1 non-www sitemap/robots host** — *Still open.* `src/app/sitemap.js:3` and `src/app/robots.js:1` still take their base from `NEXT_PUBLIC_SITE_URL`; the fix is the env value itself (`.env.live` is not readable by docs — unverified).
> - **§1 `x-default` in sitemap** — *Still open.* `src/app/sitemap.js` emits `alternates.languages` for `LOCALES` only, no `x-default`.
> - **§1 IndexNow endpoints** — *Still open.* No IndexNow file or route exists in the repo.
> - **§2 canonical / `metadataBase` / absolute hreflang / `x-default` in head** — *Still open.* `src/app/[locale]/layout.js:22-24` still emits relative `/hi`-style alternates and no canonical; `next.config.mjs` has no `metadataBase`.
> - **§3 security headers** — *Still open.* No `headers()` in `next.config.mjs`; `vercel.json` defines only the cron.
> - **§4 redirects** — `/admin` → `/admin/login` (proxy) and cron 401 remain correct in code; the non-www 308 is Vercel-side (not verifiable from the repo).
> - **§5 favicon** — *Partly addressed.* `src/app/icon.png` exists (Next serves the `<link rel="icon">` automatically); `/favicon.ico` is still absent from `public/`.
> - **§6 structured data** — *Still open.* No `application/ld+json` anywhere in `src/`.

---

## 1. Crawlability

| Check | Status | Evidence |
|-------|--------|----------|
| robots.txt reachable | PASS | 200 OK, `User-Agent: *`, `Disallow: /admin /api`, `Sitemap: https://matoshreefruits.com/sitemap.xml` |
| Sitemap.xml reachable | PASS | 200 OK, 5 URLs × 3 locales = 15 entries |
| Sitemap host matches canonical | **FAIL (Critical)** | Sitemap uses `https://matoshreefruits.com/...` (non-www); live site 308-redirects to `www`. robots.txt also declares non-www sitemap. |
| `x-default` hreflang in sitemap | **FAIL (Critical)** | 0 `xhtml:link rel="alternate" hreflang="x-default"` entries |
| IndexNow endpoint | **FAIL (High)** | `/indexnow.xml` 404, `/indexnow.json` 404 — Bing/Yandex/Naver cannot auto-index |

**Root causes:**
- `src/app/sitemap.js:6` — `BASE = process.env.NEXT_PUBLIC_SITE_URL` (non-www from `.env.live:14`)
- `src/app/robots.js:8` — `sitemap: \`${BASE}/sitemap.xml\`` (same non-www)
- `.env.live:14` — `NEXT_PUBLIC_SITE_URL=https://matoshreefruits.com` (no www)
- `src/app/sitemap.js` — no `x-default` alternate generated (lines 16-22)
- Next.js `metadata.alternates.languages` in layout (line 25) emits relative paths `/hi` — invalid per RFC 8288

---

## 2. Indexability

| Check | Status | Evidence |
|-------|--------|----------|
| Canonical tags on pages | **FAIL (Critical)** | 0/15 pages have `<link rel="canonical">` in rendered HTML |
| `metadataBase` in Next config | **FAIL (Critical)** | `next.config.mjs` lacks `metadataBase` — Next emits relative `hrefLang` alternates (`/hi`, `/mr`, `/en`) |
| `hreflang` in HTML head | **FAIL (High)** | Present but **relative URLs** (`href="/hi"`) — invalid; must be absolute |
| `x-default` in HTML head | **FAIL (High)** | Missing on all 15 pages |
| Thin content | PASS | All pages have locale-specific title + description (>50 words rendered without JS) |

**Root causes:**
- `src/app/[locale]/layout.js:25` — `alternates.languages` uses relative paths `/${l}`; no `metadataBase` to resolve
- `next.config.mjs` — no `metadataBase: "https://www.matoshreefruits.com"` (line 1-15)
- No `<link rel="canonical">` generated — Next.js requires `metadataBase` + canonical via `generateMetadata` or layout export

---

## 3. Security Headers

| Header | Status | Value / Notes |
|--------|--------|---------------|
| `Strict-Transport-Security` | PASS | `max-age=63072000` (set by Vercel) |
| `X-Content-Type-Options` | **FAIL (High)** | Missing — MIME sniffing risk |
| `Referrer-Policy` | **FAIL (High)** | Missing — defaults to `strict-origin-when-cross-origin` |
| `X-Frame-Options` | **FAIL (Medium)** | Missing — clickjacking exposure |
| `Content-Security-Policy` | **FAIL (High)** | Missing — no CSP; inline scripts/styles from Next.js will be blocked if added later |
| `Permissions-Policy` | **FAIL (Medium)** | Missing |

**Root cause:** Next.js on Vercel does not inject security headers by default. Must add via `next.config.mjs` `headers()` or `vercel.json` `headers`.

---

## 4. URL Structure & Redirects

| Path | Chain | Status |
|------|-------|--------|
| `https://matoshreefruits.com/` | 308 → `https://www.matoshreefruits.com/` → 307 → `/hi` | **FAIL (Critical)** — non-www in sitemap/robots, double redirect |
| `https://www.matoshreefruits.com/` | 307 → `/hi` | OK (locale default) |
| `/admin` (no auth) | 307 → `/admin/login` | PASS (protected by proxy) |
| `/api/cron/expire-posts` | 401 | PASS (protected) |

**Root causes:**
- `.env.live:14` non-www canonical URL
- Vercel project likely has "Redirect non-www to www" enabled (308 at edge)
- `src/proxy.js:70-71` redirects `/` → `/${locale}` (307) — correct

---

## 5. Mobile & Core Web Vitals Risks

| Factor | Status | Notes |
|--------|--------|-------|
| Viewport meta | PASS | `width=device-width, initial-scale=1, viewport-fit=cover` (layout.js:31) |
| Touch targets | PASS | Semantic `<a>`, `<button>`; Header/Footer use proper spacing |
| LCP candidates | **RISK (Medium)** | Hero/logo preloaded but no `priority` on LCP image; `next/image` unconfigured for priority above fold |
| INP risks | **RISK (Low)** | Minimal JS (no heavy hydration); edge proxy only |
| CLS risks | **RISK (Low)** | Font `display: swap` not confirmed; `viewport-fit=cover` safe |
| Favicon | **FAIL (Low)** | `/favicon.ico` 404 — browser requests anyway; use `/icon.png` via `<link rel="icon">` (already present) |

---

## 6. Structured Data

| Type | Status |
|------|--------|
| `application/ld+json` | **FAIL (Medium)** — 0 schemas on any page (Organization, WebSite, BreadcrumbList, ItemList for stock) |

---

## 7. JavaScript Rendering

| Check | Status |
|-------|--------|
| Server-rendered content | PASS — 325 words without JS (agentic.json) |
| SPA shell | PASS — No SPA shell; RSC + SSR |
| Hydration mismatch | Not observed |

---

## 8. Per-Page Summary (15 pages)

| URL | Code | Title | Desc | Canonical | Hreflang (HTML) |
|-----|------|-------|------|-----------|-----------------|
| /hi | 200 | मातोश्री फ्रूट्स | ✓ | MISSING | relative /hi /mr /en |
| /hi/stock | 200 | उपलब्ध स्टॉक | ✓ | MISSING | relative /hi /mr /en |
| /hi/gallery | 200 | फोटो और वीडियो | ✓ | MISSING | relative /hi /mr /en |
| /hi/contact | 200 | संपर्क करें | ✓ | MISSING | relative /hi /mr /en |
| /hi/feedback | 200 | प्रतिक्रिया | ✓ | MISSING | relative /hi /mr /en |
| /mr | 200 | मातोश्री फ्रूट्स | ✓ | MISSING | relative /hi /mr /en |
| /mr/stock | 200 | उपलब्ध माल | ✓ | MISSING | relative /hi /mr /en |
| /mr/gallery | 200 | फोटो व व्हिडिओ | ✓ | MISSING | relative /hi /mr /en |
| /mr/contact | 200 | संपर्क | ✓ | MISSING | relative /hi /mr /en |
| /mr/feedback | 200 | अभिप्राय | ✓ | MISSING | relative /hi /mr /en |
| /en | 200 | Matoshree Fruits | ✓ | MISSING | relative /hi /mr /en |
| /en/stock | 200 | Available stock | ✓ | MISSING | relative /hi /mr /en |
| /en/gallery | 200 | Photo & video gallery | ✓ | MISSING | relative /hi /mr /en |
| /en/contact | 200 | Contact us | ✓ | MISSING | relative /hi /mr /en |
| /en/feedback | 200 | Feedback | ✓ | MISSING | relative /hi /mr /en |

---

## 9. Repo Fix Map (file:line)

| Finding | File:Line | Fix |
|---------|-----------|-----|
| Non-www in sitemap/robots/env | `.env.live:14` | Change `NEXT_PUBLIC_SITE_URL=https://www.matoshreefruits.com` |
| Sitemap uses BASE from env | `src/app/sitemap.js:6` | Will auto-fix via env; add `x-default` alternate: `[DEFAULT_LOCALE, \`${BASE}/${DEFAULT_LOCALE}${suffix}\`]` |
| Robots sitemap URL | `src/app/robots.js:8` | Auto-fix via env |
| Missing `metadataBase` | `next.config.mjs` (new) | Add `metadataBase: new URL("https://www.matoshreefruits.com")` |
| Relative hreflang in layout | `src/app/[locale]/layout.js:25` | With `metadataBase`, Next resolves to absolute; keep `alternates.languages` object |
| No canonical tags | `src/app/[locale]/layout.js` | Add `generateMetadata` return `alternates.canonical: \`/${locale}${suffix}\`` (resolved by metadataBase) |
| No x-default hreflang | `src/app/[locale]/layout.js:25` | Add `"x-default": \`/${DEFAULT_LOCALE}\`` to `alternates.languages` |
| Security headers | `next.config.mjs` | Add `async headers()` returning HSTS, X-Content-Type-Options, Referrer-Policy, X-Frame-Options, CSP (report-only), Permissions-Policy |
| IndexNow | `public/indexnow.xml` + `indexnow.json` | Create with key + API submission (Bing/Yandex/Naver) |
| Structured data | `src/app/[locale]/layout.js` or page files | Add `jsonLd` in `generateMetadata` for Organization, WebSite, BreadcrumbList |
| Favicon 404 | `public/` | Add `favicon.ico` or ensure `<link rel="icon" href="/icon.png">` suffices (already present) |

---

## 10. Technical Score

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Crawlability | 20% | 40 | 8.0 |
| Indexability | 25% | 20 | 5.0 |
| Security | 15% | 30 | 4.5 |
| URL Structure | 10% | 50 | 5.0 |
| Mobile/CWV | 10% | 80 | 8.0 |
| Structured Data | 10% | 0 | 0.0 |
| JS Rendering | 10% | 90 | 9.0 |
| **Total** | 100% | — | **39.5 / 100** |

---

## Priority Fix Order

1. **Critical** — `.env.live:14` www canonical; `next.config.mjs` metadataBase; `sitemap.js` x-default
2. **High** — Security headers (next.config.mjs); canonical tags + absolute hreflang + x-default (layout.js)
3. **Medium** — IndexNow endpoints; Structured data (Organization, WebSite, BreadcrumbList)
4. **Low** — Favicon.ico; CSP tuning; Font display swap