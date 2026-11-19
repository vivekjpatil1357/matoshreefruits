# Deployment — Phase 5b checklist

Actual deployment needs the owner's accounts; the repo is prepared for it.

1. **Vercel project** — import the repo (Next.js is auto-detected).
2. **Environment variables** (Project → Settings → Environment Variables) —
   the full table is below; placeholders for all of them live in
   `.env.local.example`.
3. **Cron** — [`../vercel.json`](../vercel.json) already schedules
   `expire-posts` daily (Vercel Hobby allows one cron run per day); no extra
   setup. Set `CRON_SECRET` to a long random hex and keep it only in Vercel.
4. **MongoDB Atlas** — free M0 cluster → database user → allow access from
   Vercel (or `0.0.0.0/0`) → paste the connection string into `MONGODB_URI`
   → create the first admin by either running `npm run create-admin` once
   with the production env values, **or** visiting `/admin/setup` on the
   deployed site.
5. **Domain (matoshreefruits.com)** — buy it (any registrar), then in Vercel
   → Project → Settings → Domains add it; point the registrar's DNS at
   Vercel (A record `@` → `76.76.21.21`, CNAME `www` →
   `cname.vercel-dns.com`). Vercel provisions HTTPS automatically.
6. **Replace placeholders before launch**: WhatsApp number (all
   `919999999999`), contact phone/address/hours/email, and the admin password.

## Environment variables

`.env.local` is git-ignored — never commit secrets. Set these in Vercel
(production) and in `.env.local` (dev); names are fixed by code usage.

| Variable | Purpose | Required |
| --- | --- | --- |
| `MONGODB_URI` | Mongo connection string (`mongodb+srv://…` in prod) | yes |
| `ADMIN_EMAIL` | Admin login email (used by `create-admin`, suites) | yes |
| `ADMIN_PASSWORD` | Admin login password (bcrypt-hashed on write) | yes |
| `ADMIN_NAME` | Display name for the admin account | yes |
| `SESSION_SECRET` | HMAC key for the `mf_session` cookie (throws if unset) | yes |
| `ADMIN_SETUP_SECRET` | Optional extra key for `/admin/setup` | no |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (`https://www.matoshreefruits.com`) | yes |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp enquiry number | yes |
| `NEXT_PUBLIC_PHONE` | Contact phone | yes |
| `NEXT_PUBLIC_ADDRESS` | Contact address | yes |
| `NEXT_PUBLIC_BUSINESS_HOURS` | Shown in contact/footer | yes |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | Contact email | yes |
| `NEXT_PUBLIC_INSTAGRAM` | Instagram URL (empty hides the icon) | no |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud (uploads/destroy) | yes (media) |
| `CLOUDINARY_API_KEY` | Cloudinary key (signing) | yes (media) |
| `CLOUDINARY_API_SECRET` | Cloudinary secret (server-only signing) | yes (media) |
| `CRON_SECRET` | Bearer token for `/api/cron/expire-posts` | yes (cron) |
| `DEMO_ASSETS` | Dev-only asset map for `npm run seed:demo` | no (dev only) |

18 variables total (matches `.env.local.example`). `DEMO_ASSETS` is not
needed on Vercel.

## Post-deploy smoke check

- `https://www.matoshreefruits.com/api/health` → 200 with counts.
- `/` redirects to `/hi` for a first-time visitor.
- `/admin/login` reachable, `/admin` redirects when signed out.
- `/sitemap.xml` and `/robots.txt` resolve with the production base URL
  (see [seo.md](seo.md)).
- The daily cron shows as scheduled in Vercel → Project → Cron Jobs.

Security posture for the deployed admin (cookies, rate limits, setup
lock) is in [admin-auth.md](admin-auth.md).
