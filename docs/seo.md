# SEO — sitemap, robots, metadata, known gaps

## What ships

- **[`../src/app/sitemap.js`](../src/app/sitemap.js)** → `/sitemap.xml`:
  one entry per page (`""`, `stock`, `gallery`, `contact`, `feedback`) for the
  default locale URL, each with `alternates.languages` hreflang entries for
  all three locales (`hi`, `mr`, `en`). Base URL comes from
  `NEXT_PUBLIC_SITE_URL` (falls back to `http://localhost:3000`). Home is
  `priority 1 / changeFrequency daily`; subpages `0.7 / weekly`.
- **[`../src/app/robots.js`](../src/app/robots.js)** → `/robots.txt`:
  allows `/` for all user agents, disallows `/admin` and `/api`, points at
  the sitemap.
- **Per-page metadata**: the [locale layout](../src/app/[locale]/layout.js)
  and [`../src/lib/metadata.js`](../src/lib/metadata.js) build localized
  titles, descriptions, absolute canonical URLs, `alternates.languages`
  hreflang links (including `x-default`), and Open Graph/Twitter cards.
  Public subpages call the shared helper with their route path so each page
  points to its own canonical and hreflang URLs. The layout also sets
  `<html lang={locale}>`.
- **Admin is never indexed**: [`../src/app/admin/layout.js`](../src/app/admin/layout.js)
  sets `robots: { index: false, follow: false }`.
- **Icon**: [`../src/app/icon.png`](../src/app/icon.png) is served as the
  site favicon/app icon by convention.

## Known gaps (current code, not yet implemented)

- Production URL configuration still depends on
  `NEXT_PUBLIC_SITE_URL` being set to the canonical `www` domain in Vercel.
  The local fallback is intended for development only.
- Social cards currently reuse `public/hero-leaves.jpg`; a dedicated 1200x630
  social image could improve sharing previews.
- The sitemap and JSON-LD schemas use English labels for some structural names;
  localized schema labels could be added if search testing shows a benefit.
