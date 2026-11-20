# XML Sitemap & Robots.txt Audit — matoshreefruits.com

> **Implementation status updated 2026-11-20:** The sitemap now includes
> `x-default` in code. The host mismatch remains a deployment configuration
> issue until Vercel Production uses
> `NEXT_PUBLIC_SITE_URL=https://www.matoshreefruits.com`. See
> [`../STATUS-UPDATE-2026-11-20.md`](../STATUS-UPDATE-2026-11-20.md).

## Executive Summary
- **Sitemap Status:** Valid XML, reachable at `https://matoshreefruits.com/sitemap.xml`
- **Critical Finding (F1):** The sitemap and `robots.txt` declare all URLs as non-www (`https://matoshreefruits.com/...`), but the live site canonical is www (`https://www.matoshreefruits.com/`). Every single URL in the sitemap results in a `308 Permanent Redirect`.
- **Hreflang in Sitemap (F3):** No `x-default` alternate link in sitemap entries.

---

## 1. Sitemap Contents Analysis

The sitemap dynamically generated at `src/app/sitemap.js` contains 15 entries (5 pages × 3 locales):

| URL in Sitemap | HTTP Status | Final Destination | Note |
|----------------|-------------|-------------------|------|
| `https://matoshreefruits.com/hi` | 308 Redirect | `https://www.matoshreefruits.com/hi` | Redirect waste |
| `https://matoshreefruits.com/hi/stock` | 308 Redirect | `https://www.matoshreefruits.com/hi/stock` | Redirect waste |
| `https://matoshreefruits.com/hi/gallery` | 308 Redirect | `https://www.matoshreefruits.com/hi/gallery` | Redirect waste |
| `https://matoshreefruits.com/hi/contact` | 308 Redirect | `https://www.matoshreefruits.com/hi/contact` | Redirect waste |
| `https://matoshreefruits.com/hi/feedback` | 308 Redirect | `https://www.matoshreefruits.com/hi/feedback` | Redirect waste |
| *(Repeated for `/mr` and `/en`)* | 308 Redirect | `https://www.matoshreefruits.com/...` | All 15 redirect |

---

## 2. Root Cause Analysis

1. **Environment Variable Configuration (`.env.live`):**
   - Line 14: `NEXT_PUBLIC_SITE_URL=https://matoshreefruits.com`
   - `src/app/sitemap.js:3` imports `NEXT_PUBLIC_SITE_URL` as base URL.
   - `src/app/robots.js:1` imports `NEXT_PUBLIC_SITE_URL` to declare `Sitemap: ${BASE}/sitemap.xml`.
2. **Missing `x-default`:**
   - `sitemap.js` emits alternate language links for `hi`, `mr`, `en`, but omits `x-default`.

---

## 3. Required Fixes (Repo Code + Deployment)

### 1. Update Environment Variable
In `.env.live` and Vercel Project Environment Variables:
```env
NEXT_PUBLIC_SITE_URL=https://www.matoshreefruits.com
```

### 2. Update `src/app/sitemap.js`
Ensure `x-default` is included in the alternates object:
```javascript
alternates: {
  languages: {
    hi: `${BASE}/hi${route}`,
    mr: `${BASE}/mr${route}`,
    en: `${BASE}/en${route}`,
    'x-default': `${BASE}/hi${route}`,
  },
}
```

### 3. Verify `src/app/robots.js`
Ensure `Sitemap` point to www canonical: `https://www.matoshreefruits.com/sitemap.xml`.
