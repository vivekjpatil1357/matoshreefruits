# Testing — verification suites & model tests

## Model smoke test

```bash
npm run test:models
```

[`scripts/test-models.js`](../scripts/test-models.js) — CRUD round-trip for
all four Mongoose models (`Admin`, `Post`, `Stock`, `Feedback`) against the
database in `.env.local`. Needs MongoDB running.

## Live end-to-end suites

Both suites run against a **production build** (not `next dev`), against a
running server, and clean up the data they create:

```bash
npm run build
npm run start -- -p 3005        # production server
npm run verify:site             # 61 checks
npm run verify:expiry           # 27 checks
```

Check counts are static properties of
[`scripts/verify-site.mjs`](../scripts/verify-site.mjs) (61 `check(...)`
call sites incl. loops) and
[`scripts/verify-expiry.mjs`](../scripts/verify-expiry.mjs) (27).

### `verify:site` — 61 checks

Public pages for every locale, the proxy gate for `/admin`, 401s on admin
APIs, login/session/logout, CSRF rejection, rate limits, post + stock CRUD
and public visibility, Cloudinary upload (signature recomputed locally and
matched against the issued one, then a real upload), the feedback wall
(approve → publish → delete), a no-price scan across public pages, and the
final rate-limit exhaustion.

### `verify:expiry` — 27 checks

Sitemap/robots, cron auth (401 without a secret, 401 with a wrong one), then
a real upload → backdate `expiresAt` → call the cron → assert the asset is
destroyed and the post deleted; live and permanent posts survive; a second
cron run is a no-op (`removed: 0`).

## Notes & gotchas

- **Credentials:** both suites read `.env.local` for `ADMIN_EMAIL` /
  `ADMIN_PASSWORD` and `CRON_SECRET`; MongoDB must be running.
  `verify:expiry` additionally needs valid `CLOUDINARY_*` keys — without them
  its upload checks cannot pass.
- **Rate limiter is shared:** the login limiter (8 failed / 10 min / IP,
  in-memory) is exhausted by `verify:site` at the end of its run. Back-to-back
  runs still work: a successful login clears the counter, and
  `verify:expiry` sends its own per-run sentinel `X-Forwarded-For` IP so the
  earlier lockout doesn't block it.
- **Cache settle:** test feedback is approved → wall-published → deleted
  inside the suite; the pre-approve wall fetch is followed by a short settle
  so Next's background revalidation finishes before `revalidateTag` fires
  (see the comment in `scripts/verify-site.mjs`). Same reason the CRUD checks
  re-fetch after writes — see [admin-dashboard.md](admin-dashboard.md) for
  the caching model.
- The suites assume a happy path: they fail if the DB is down or Cloudinary
  is misconfigured, by design.
