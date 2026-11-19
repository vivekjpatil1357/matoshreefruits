# Admin auth — login, `mf_session` session, guards

One admin account, no self-service signup. The login URL is
`/admin/login` — unlisted: the public site never links to it. Three entry
points exist: `/admin/login` (sign in), `/admin/setup` (first-run bootstrap),
and everything else under `/admin/*` which requires a valid session.

## Session token

[`../src/lib/session.js`](../src/lib/session.js) implements a **stateless
HMAC-SHA256 signed cookie** — no extra dependency, no server-side store.

| Property | Value |
| --- | --- |
| Cookie name | `mf_session` |
| Format | `<base64url payload>.<base64url hmac>` |
| Payload | `{ id, email, name, exp }` |
| Signing key | `SESSION_SECRET` (throws if unset) |
| Lifetime | 7 days (`exp` checked on every read) |
| Flags | `httpOnly`, `sameSite=lax`, `secure` in production, `path=/` |
| Verification | `crypto.timingSafeEqual` (constant time) |

`verifySession()` returns `null` for missing, expired, or tampered tokens.
Route Handlers read it with `getRequestSession(request)`; Server Components
use `getSession()` (must sit behind a `<Suspense>` boundary — see the panel
layout).

## The 3-layer guard

1. **[`../src/proxy.js`](../src/proxy.js)** — before any `/admin/*` page
   renders, the proxy re-verifies the HMAC with Web Crypto (edge-safe) and
   redirects to `/admin/login` on failure. This runs *before* rendering
   because a layout-level guard can still let Next serialize page data (live
   DB reads) into the RSC payload of the blocked response.
   Exempt paths: `/admin/login` and `/admin/setup`.
2. **`AdminShell`** ([`../src/app/admin/components/AdminShell.js`](../src/app/admin/components/AdminShell.js))
   — the panel shell calls `getSession()` server-side and
   `redirect("/admin/login")` when it is missing, so `(panel)` pages are only
   ever rendered with a session.
3. **`adminGuard(request)`** in [`../src/lib/session.js`](../src/lib/session.js)
   — every admin API route calls it first: `401 { code: "unauthorized" }`
   without a valid cookie, and for non-GET/HEAD requests a mismatched
   `Origin` header gets `403 { code: "csrf" }` (the origin must match the
   request host; browsers always send `Origin` on cross-site writes).

## Login — `POST /api/admin/login`

[`../src/app/api/admin/login/route.js`](../src/app/api/admin/login/route.js):

- Email + password validated (length caps), compared with `bcryptjs`
  against `Admin.passwordHash`. Unknown emails still pay the bcrypt cost
  (pre-computed dummy hash) so response time doesn't reveal whether the
  account exists; the error is always a generic 401.
- **Rate limit:** 8 *failed* attempts per 10 minutes per IP (in-memory map,
  keyed by the first `X-Forwarded-For` hop). Over the budget →
  `429 { code: "rate_limited" }` with a `Retry-After` header. A successful
  login clears the IP's counter.
- Success sets `mf_session` and stamps `Admin.lastLoginAt`.
- `POST /api/admin/logout` clears the cookie (`maxAge: 0`); it needs no
  session. `GET /api/admin/session` returns the identity or 401 — used by
  the login page to skip straight to the dashboard when already signed in.

## First-run setup — `/admin/setup`

For bringing the site up against an empty database (e.g. fresh Atlas)
without shell access:

- `GET /api/admin/setup` reports `{ configured, secretRequired }`.
- `POST /api/admin/setup` creates the **first** admin only while the
  `admins` collection is empty; afterwards every call returns
  `403 { code: "already_configured" }` and the page shows "already set up".
  A unique-email race (`11000`) makes double-signup impossible — the loser
  gets `already_configured`.
- Optional `ADMIN_SETUP_SECRET`: when set, the form must also present it
  (constant-time compare → `403 bad_secret`), throttled by the same
  8-failed/10-min/IP budget. Leave it unset to rely on first-run locking.
- Password: 8–200 chars, stored as bcrypt **cost 12**. On success the route
  sets `mf_session`, so the operator lands in the dashboard immediately.

Alternative to the setup page: `npm run create-admin` (reads
`ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` from `.env.local`; safe to
re-run — it updates the password of an existing email).

## Security notes

- Admin passwords exist only as bcrypt hashes (`Admin` model has no plaintext
  field); login never reveals whether an email is registered.
- `.env.local` is git-ignored — never commit secrets. All variable names and
  placeholders are documented in `.env.local.example` and in
  [deployment.md](deployment.md).
- Rate limiters and the login attempt map are **in-memory** — per server
  instance. Enough for a single-admin site; tests rely on the same behavior
  (see [testing.md](testing.md)).
