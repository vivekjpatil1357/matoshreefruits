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
  `generateMetadata()` builds `title` (with a `%s | …` template) and
  `description` from the messages (`meta` section of
  [`../src/messages/`](../src/messages)), `alternates.languages` (hreflang
  links for the three locales in the `<head>`), and `<html lang={locale}>`.
- **Admin is never indexed**: [`../src/app/admin/layout.js`](../src/app/admin/layout.js)
  sets `robots: { index: false, follow: false }`.
- **Icon**: [`../src/app/icon.png`](../src/app/icon.png) is served as the
  site favicon/app icon by convention.

## Known gaps (current code, not yet implemented)

- No `metadataBase` — relative canonical/OG URLs resolve against the request
  host; absolute URL generation for social cards is therefore not configured.
- No `canonical` link emitted for any page (hreflang alternates exist in the
  sitemap only, not in page `<head>`).
- No JSON-LD structured data (`ld+json` appears nowhere in `src/`) — no
  Organization / Product / FAQ schema for rich results.
- No Open Graph / Twitter card images configured per page.

These are candidate follow-ups, documented here so the next pass can pick
them up without re-reading the source.
