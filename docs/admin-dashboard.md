# Admin dashboard — panel, screens, data flow

The panel lives under [`../src/app/admin`](../src/app/admin). It is a
**separate root layout** (multi-root pattern — there is no `app/layout.js`):
English-only, own metadata, and `robots: { index: false, follow: false }` so
the admin area is never indexed.

## Screens

| URL | File | What it shows / does |
| --- | --- | --- |
| `/admin/login` | `login/page.js` | Public sign-in (outside the panel group) |
| `/admin/setup` | `setup/page.js` | Public first-run bootstrap (self-disables) |
| `/admin` | `(panel)/page.js` | Dashboard: stat cards + recent activity |
| `/admin/posts` | `(panel)/posts/page.js` | All posts incl. drafts, row actions |
| `/admin/posts/new`, `/admin/posts/[id]` | `posts/new`, `posts/[id]` | Post editor (create / edit) |
| `/admin/stock` | `(panel)/stock/page.js` | Stock table + inline create/edit |
| `/admin/feedback` | `(panel)/feedback/page.js` | Moderation list (approve / spam / delete) |

Routing and auth for these screens are covered in
[admin-auth.md](admin-auth.md).

## Shell & navigation

- [`(panel)/layout.js`](<../src/app/admin/(panel)/layout.js>) wraps the panel in
  `<Suspense>` (session reads require a boundary under Cache Components) with
  `export const instant = false` — a login gate is allowed to block
  navigation.
- `AdminShell` resolves the session server-side (redirect when absent) and
  renders `AdminNav`: sidebar on desktop, horizontal nav on mobile, plus the
  logout button (`POST /api/admin/logout` → replace to `/admin/login`).

## Dashboard overview

`getAdminOverview()` in [`../src/lib/admin-data.js`](../src/lib/admin-data.js)
returns nine counts — published/draft/total posts, **temporary posts expiring
within 2 days** (drives the "review these" warning), stock lots/available,
feedback pending/approved/spam — plus the 5 most recently updated posts and
the 5 newest unapproved feedback items.

## Content screens

**Posts** — `PostEditor` (client): trilingual title/body
(`title`/`titleMr`/`titleHi`, `body`/…), type `temporary` vs `permanent`,
status `draft` / `published` / `unpublished`, the media uploader, and an
**Auto-translate** button that fills the Mr/Hi fields via
`POST /api/admin/translate` (whitelisted fields `title`, `body`, `variety`,
`notes` with the same character caps as the schema; `502 unavailable` if the
upstream translator fails). The endpoint calls
[`../src/lib/translate.js`](../src/lib/translate.js), which uses Google's
public Translate endpoint — free, no API key. That endpoint is unofficial,
so it is isolated in that one helper; if it ever breaks, manual entry and
the existing fields keep working. The button asks before replacing existing
translations. `PostRowActions` offers publish / unpublish /
edit / delete — delete always confirms and warns that the cloud media goes
too.

**Stock** — `StockManager`: table + inline form. Units
`crate | box | kg | quintal | truck | bunch`, qualities
`premium | grade-a | grade-b | ripening | mixed`, trilingual variety/notes,
availability toggle, Auto-translate for the variants.
**There is no price field anywhere** — the validator rejects unknown keys and
the `Stock` model has none (see [api.md](api.md)).

**Feedback** — `FeedbackManager`: filters (all / pending / approved / spam),
approve publishes the message on the public feedback wall, spam hides it,
delete confirms. Optimistic local updates + `router.refresh()`.

Shared class strings (card, label, input, buttons, status pills) live in
[`ui.js`](../src/app/admin/components/ui.js) so every admin screen styles
itself identically — see [design-system.md](design-system.md).

## Data flow: uncached admin vs cached public

- **Admin reads never cache.** Every getter in
  [`../src/lib/admin-data.js`](../src/lib/admin-data.js) starts with
  `connection()` (opting out of prerendering), so the dashboard always
  reflects the current database — there is no static shell to keep stale.
- **Public reads are cached.** [`../src/lib/content.js`](../src/lib/content.js)
  uses Next.js 16 Cache Components (`"use cache"`) with `cacheLife("minutes")`
  and the tags `posts`, `stock`, `feedback`.
- **Writes invalidate.** Each admin route calls `revalidateTag(...)` on its
  tag (posts / stock / feedback) after a successful mutation, so the public
  site refreshes immediately. Background revalidation can still race a
  read — the verification suites deliberately settle before asserting (see
  [testing.md](testing.md)).

## Input validation (why the client can't mass-assign)

All admin payloads go through [`../src/lib/admin.js`](../src/lib/admin.js):

- `validatePostInput()` / `validateStockInput()` build a fresh `data` object
  — internal fields (`publishedAt`, `expiresAt`, `ip`, …) are never accepted
  from the client.
- `sanitizeMedia()` caps media at 30 items and requires valid
  `publicId` / `url` / `resourceType`.
- `applyPublishing()` decides `publishedAt`/`expiresAt` server-side
  (rules in [expiry-cron.md](expiry-cron.md)).
