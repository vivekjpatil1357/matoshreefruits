# Documentation

Feature docs for Matoshree Fruits. For a 60-second start, see the
[README](../README.md).

| Doc | Covers |
| --- | --- |
| [i18n.md](i18n.md) | Trilingual site (hi default / mr / en): routing, proxy redirect, messages, language switcher, localized data |
| [admin-auth.md](admin-auth.md) | Login, `mf_session` HMAC cookie, the 3-layer guard, rate limits, first-run setup, CSRF/Origin |
| [admin-dashboard.md](admin-dashboard.md) | Panel screens, shell/navigation, overview stats, post/stock/feedback editors, uncached-vs-cached data flow, validation |
| [media.md](media.md) | Cloudinary config, SHA-1 request signing, direct browser uploads, destroy paths, image allow-list |
| [expiry-cron.md](expiry-cron.md) | 7-day temporary-post window, live-post filter, `/api/cron/expire-posts` + `CRON_SECRET`, Vercel schedule |
| [api.md](api.md) | Full endpoint table, validation rules, error codes, curl examples |
| [seo.md](seo.md) | Sitemap, robots, metadata/hreflang, known gaps |
| [testing.md](testing.md) | `verify:site` (61 checks), `verify:expiry` (27 checks), model tests, how to run |
| [deployment.md](deployment.md) | Phase 5b checklist, environment variables, Atlas, Vercel cron, domain |
| [design-system.md](design-system.md) | Tokens, typography, layout, surfaces, a11y, component conventions ([DESIGN.md](../DESIGN.md) points here) |
