# 🍌 Matoshree Fruits — matoshreefruits.com

Wholesale banana trading website: fresh arrivals, live stock, photo/video gallery,
WhatsApp enquiries and a trilingual experience (मराठी / हिन्दी / English).

> "Fresh arrivals. Trusted quality. Direct connection."

## Tech stack

| Component | Technology |
| --- | --- |
| Frontend + backend | Next.js 16 (App Router, JavaScript/JSX) |
| Styling | Tailwind CSS v4 |
| Database | MongoDB (local dev → Atlas in production) + Mongoose |
| Media storage | Cloudinary (Phase 3) |
| Hosting | Vercel (Phase 5) |

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in your values
npm run create-admin               # seed the admin account
npm run dev
```

- Site: http://localhost:3000 (redirects to /hi — or your last-used language
  via the `NEXT_LOCALE` cookie)
- Health check: http://localhost:3000/api/health

### Local MongoDB (current default)

`.env.local` points at a local MongoDB:

```
MONGODB_URI=mongodb://127.0.0.1:27017/matoshreefruits
```

Start it manually (installed service is currently unstable):

```powershell
Start-Process "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" `
  -ArgumentList '--dbpath', "$env:LOCALAPPDATA\mongodb-data", '--port', '27017', '--bind_ip', '127.0.0.1' `
  -WindowStyle Hidden
```

To switch to Atlas later, just replace `MONGODB_URI` with the `mongodb+srv://` string.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build (`npm run build` first) |
| `npm run lint` | ESLint |
| `npm run create-admin` | Create/update the admin account from `.env.local` |
| `npm run test:models` | CRUD smoke test for all Mongoose models |
| `npm run seed` | Insert sample stock + announcement posts (Phase 2 content) |
| `npm run seed:demo` | Demo gallery posts with real Cloudinary media + approved feedback (needs `CLOUDINARY_*`; safe to re-run) |
| `npm run verify:site` | 61-check end-to-end suite against a running server (Phase 5) |
| `npm run verify:expiry` | 27-check expiry-cron suite (Phase 5) |

## Project structure

```
src/
  app/[locale]/        Public site — hi (default), mr, en
    components/        Header, Footer, BottomBar, HeroPrints, LanguageSwitcher,
                       StockCard, PostCard, GalleryClient, FeedbackForm,
                       WhatsAppButton, Icons…
    stock/ gallery/ contact/ feedback/   Public pages
    layout.js          Fonts, generateMetadata (title/description/hreflang), skip link
  app/api/             Route handlers — see docs/api.md
  app/admin/           Admin dashboard — login + guarded panel
    (panel)/           Session-gated: dashboard, posts, stock, feedback
    components/        AdminShell, AdminNav, PostEditor, MediaUploader,
                       StockManager, FeedbackManager, ui helpers
  app/ globals.css robots.js sitemap.js icon.png   Design tokens + SEO metadata
  lib/                 db, content (cached queries), admin-data (uncached),
                       session (HMAC admin session), admin (validation),
                       cloudinary (signing + destroy), expiry (cron cleanup),
                       i18n, localize, translate, whatsapp, site, media
  messages/            mr.json, hi.json, en.json translation dictionaries
  models/              Admin, Post, Stock, Feedback
  proxy.js             Locale redirect ("/" → last used language, else /hi)
                       + session gate for /admin/*
scripts/               create-admin, test-models, seed, seed:demo, seed-ai-demo,
                       verify-site.mjs (61 checks), verify-expiry.mjs (27 checks)
vercel.json            Daily cron for /api/cron/expire-posts
```

## Roadmap

- [x] **Phase 1** — Project setup, MongoDB models, admin bootstrap, i18n foundation
- [x] **Phase 2** — Public website & UI (homepage, stock, gallery, contact, feedback, language switcher)
- [x] **Phase 3** — Admin dashboard & Cloudinary media uploads
- [x] **Phase 4** — Automatic media expiry (7-day temporary posts) & business features
- [x] **Phase 5a** — Verification suites (`verify:site`, `verify:expiry`), production build green
- [ ] **Phase 5b** — Vercel deployment + matoshreefruits.com domain

## About the business

One website, one admin. Matoshree Fruits is a small *vyapari*: it buys banana
lots **directly from farmers' farms** and supplies them onward in bulk to
bigger traders and wholesalers (B2B). The admin publishes photos/videos of the
lots; buyers enquire on WhatsApp.

**No price is ever displayed publicly** — the `Stock` model has no price field,
pages only show quantity, quality, location and availability, and every page
carries a "rates on request" note plus WhatsApp enquiry buttons.

## Documentation

| Doc | Covers |
| --- | --- |
| [docs/README.md](docs/README.md) | Documentation hub — one line per doc |
| [docs/i18n.md](docs/i18n.md) | Locales (hi default), proxy redirect, messages, language switcher |
| [docs/admin-auth.md](docs/admin-auth.md) | Login, `mf_session` cookie, 3-layer guard, rate limits, setup flow |
| [docs/admin-dashboard.md](docs/admin-dashboard.md) | Panel screens, editors, data flow, validation |
| [docs/media.md](docs/media.md) | Cloudinary signing, direct browser upload, deletion |
| [docs/expiry-cron.md](docs/expiry-cron.md) | 7-day expiry, live-post filter, daily cron |
| [docs/api.md](docs/api.md) | Full API reference + curl examples |
| [docs/seo.md](docs/seo.md) | Sitemap, robots, hreflang, known gaps |
| [docs/testing.md](docs/testing.md) | Verification suites (61 / 27 checks) and how to run them |
| [docs/deployment.md](docs/deployment.md) | Phase 5b checklist, env vars, Atlas, Vercel, domain |
| [docs/design-system.md](docs/design-system.md) | Tokens, typography, layout, conventions ([DESIGN.md](DESIGN.md) points here) |

Admin quick start: `/admin/login` (first run: `/admin/setup`) — details in
[docs/admin-auth.md](docs/admin-auth.md).
