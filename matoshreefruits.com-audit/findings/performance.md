# Performance Audit Findings - 2026-11-11

> **Status vs repo (`ab454ed`, verified 2026-11-11):**
> - **§1 footer `min-height`** — *Still open.* `src/app/[locale]/components/Footer.js:36` still has no `min-h-*`.
> - **§2 render-blocking CSS / §3 unused JS** — *Not verifiable from source.* Depends on build output; `next.config.mjs` has no related tuning.
> - **§4 HSTS `includeSubDomains`/`preload`, CSP/COOP** — *Still open.* No `headers()` anywhere (`next.config.mjs`, `vercel.json`).
> - **§4 `cacheComponents` + `partialPrefetching`** — *Confirmed current* (`next.config.mjs:4-5`).

## Summary
The desktop site suffers from a 0.429 CLS, primarily caused by the footer component on initial load. Mobile performance is excellent (99/100).

## 1. Desktop CLS Culprit: Footer
The footer element is not reserved a fixed height or minimum height in the parent layout, causing the footer to shift elements once its content loads or the page finishes rendering.

**Recommendation:** Add `min-height` to the footer or its immediate wrapper to ensure space is reserved.

**Fix (src/app/[locale]/components/Footer.js):**
Update the `footer` element in `Footer.js`:
```javascript
<footer className="mt-auto border-t border-line bg-surface min-h-[400px]">
```
*(Adjust the 400px based on the actual height of the footer content to match your design).*

## 2. Render-blocking Resource
The CSS chunk `3nyr0ytmsmu0r.css` is flagged as render-blocking.

**Recommendation:** Inline the critical CSS or defer non-critical styles. Since this is an auto-generated Next.js chunk, verify if Tailwind is injecting large amounts of unused CSS.

## 3. Unused JavaScript
Several chunks contain unused JavaScript (~30KiB).

**Recommendation:** Audit components for large dependencies (e.g., icons, shared utility libraries) that might be imported globally but used selectively.

## 4. Infrastructure & Cache
- **HSTS:** Missing `includeSubDomains` and `preload` directives in security headers.
- **CSP/COOP:** No Content Security Policy or Cross-Origin Opener Policy found.
- **Next.js Config:** `cacheComponents` and `partialPrefetching` are enabled in `next.config.mjs`, which is good. Ensure Vercel headers (e.g., `Cache-Control`) are explicitly set in `vercel.json` if standard caching isn't aggressive enough for static assets.
