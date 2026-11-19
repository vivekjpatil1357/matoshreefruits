# API reference

All handlers live under [`../src/app/api/`](../src/app/api) and return JSON.
Success is always `{ "ok": true, … }`; errors are
`{ "ok": false, "code": "…" }` with codes `unauthorized`, `csrf`, `invalid`,
`rate_limited`, `not_found`, `not_configured`, `server`, plus the route
specific `already_configured`, `bad_secret`, `unavailable`.

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | none | MongoDB status + document counts (503 when DB down) |
| POST | `/api/feedback` | none — honeypot + 5/IP/10 min | Public feedback; stored with `approved: false` |
| POST | `/api/admin/login` | none — 8 failed/IP/10 min | bcrypt login → sets `mf_session` (429 with `Retry-After` when limited) |
| POST | `/api/admin/logout` | none | Clears `mf_session` |
| GET | `/api/admin/session` | session | Current admin identity, 401 when signed out |
| GET/POST | `/api/admin/setup` | first-run only (+ optional `ADMIN_SETUP_SECRET`) | Create the very first admin; 403 `already_configured` afterwards |
| GET/POST | `/api/cron/expire-posts` | `Authorization: Bearer $CRON_SECRET` | Expire overdue temporary posts (503 if secret unset); returns `{ removed, destroyed }` |
| GET | `/api/admin/posts` | session | List up to 200 posts incl. drafts |
| POST | `/api/admin/posts` | session + same-origin | Create post (201); publishing stamps `publishedAt`/`expiresAt` |
| GET/PATCH/DELETE | `/api/admin/posts/[id]` | session + same-origin | Read / update / delete (delete destroys Cloudinary media) |
| GET/POST | `/api/admin/stock` | session + same-origin | List up to 300 lots / create (201; never accepts a price) |
| PATCH/DELETE | `/api/admin/stock/[id]` | session + same-origin | Update / delete a lot |
| GET/PATCH/DELETE | `/api/admin/feedback` | session + same-origin | Moderate: list, approve/spam, delete |
| POST | `/api/admin/upload-signature` | session + same-origin | Signed params for direct browser → Cloudinary upload (503 when not configured) |
| POST | `/api/admin/media/destroy` | session + same-origin | Destroy one asset; `postId` also detaches it from the post |
| POST | `/api/admin/translate` | session + same-origin | Translate English fields → Marathi/Hindi (`{ fields }` → `{ translated }`, 502 when the upstream is down) |

"Same-origin" means a non-GET request may not present an `Origin` that
doesn't match the request host — a mismatch is rejected with
`403 { code: "csrf" }` (browsers always send `Origin` on cross-site writes).
Session verification and the guard layers are documented in
[admin-auth.md](admin-auth.md).

## Validation rules (selected)

- **Posts** (`validatePostInput`, [`../src/lib/admin.js`](../src/lib/admin.js)):
  `title` required (≤ 200), `body` ≤ 2000, trilingual variants `titleMr/titleHi/bodyMr/bodyHi`
  capped the same way, `type` ∈ `temporary | permanent`, `status` ∈
  `draft | published | unpublished`, media ≤ 30 entries. `publishedAt` /
  `expiresAt` are never accepted from the client — stamped server-side by
  `applyPublishing()` (see [expiry-cron.md](expiry-cron.md)).
- **Stock**: `variety` required (≤ 120), `quantity` ≥ 0, `unit` ∈
  `crate | box | kg | quintal | truck | bunch`, `quality` ∈
  `premium | grade-a | grade-b | ripening | mixed`, optional `location`,
  `available` boolean, trilingual `notes`. **No price key exists** — unknown
  keys are dropped, so a client-sent `price` never reaches the model.
- **Feedback**: `name` (≤ 80), `message` (≤ 1000), `rating` 1–5, `language` ∈
  the three locales, honeypot field `website` must be empty (bots fill it →
  silently accepted but never shown), 5 submissions / IP / 10 min.
- **Translate**: `fields` object limited to `title`, `body`, `variety`,
  `notes` with per-field char caps mirroring the schema
  (200 / 2000 / 120 / 1000).

## Curl examples (fake data)

```bash
# Public feedback — the honeypot field "website" must stay empty:
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Buyer","message":"Please share today rates on WhatsApp","rating":5,"language":"en","website":""}'

# Admin login — the response sets the mf_session cookie:
curl -i -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"fake-password"}'

# Authenticated, same-origin write (paste the token from the login response):
curl -i -X POST http://localhost:3000/api/admin/stock \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -H "Cookie: mf_session=PASTE_SIGNED_TOKEN_HERE" \
  -d '{"variety":"Robusta","quantity":120,"unit":"crate","quality":"grade-a","location":"Sarola farm","available":true}'

# Expiry cron (local run):
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/expire-posts
```
