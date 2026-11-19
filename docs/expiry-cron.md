# Expiry — 7-day temporary posts & the daily cleanup cron

Temporary posts are the site's "arrived today" mechanic: they go live for
**7 days**, then disappear — media included, because stored assets cost money.

## The 7-day window

`applyPublishing()` in [`../src/lib/admin.js`](../src/lib/admin.js) stamps
the dates **server-side** when a post goes live (`POST /api/admin/posts` or
`PATCH … { status: "published" }`):

- `publishedAt = now`
- `expiresAt = publishedAt + 7 days` for `type: "temporary"`; `null` for
  `permanent`
- Re-editing or re-publishing an already-live post **never extends the
  window** — `expiresAt` is only set when the post transitions into
  `published` (the client cannot send `expiresAt` at all; the validator
  drops unknown keys).

## Hiding: the live-post filter (why the site is correct between cron runs)

Every public query in [`../src/lib/content.js`](../src/lib/content.js) goes
through `livePostFilter()`:

```js
{ status: "published", $or: [{ type: "permanent" }, { expiresAt: null }, { expiresAt: { $gt: now } }] }
```

So an expired temporary post vanishes from the homepage, gallery and feeds
the moment its time passes — the cron only finishes the cleanup. This split
is deliberate: page reads must never depend on a once-a-day job having run.

## The cron route

[`GET/POST /api/cron/expire-posts`](../src/app/api/cron/expire-posts/route.js):

- **Auth:** `Authorization: Bearer $CRON_SECRET` →
  `401 { code: "unauthorized" }` when the header is missing/wrong,
  `503 { code: "not_configured" }` when `CRON_SECRET` is unset (the route
  refuses to run unauthenticated rather than falling open).
- Runs `expireOverduePosts()` from
  [`../src/lib/expiry.js`](../src/lib/expiry.js), which:
  1. finds `published + temporary + expiresAt < now` posts;
  2. destroys each post's Cloudinary assets (**best-effort per post** — if
     Cloudinary is unreachable the post is kept, still publicly invisible,
     and the next run retries);
  3. removes the post documents;
  4. revalidates the public cache tags.
- Returns `{ removed, destroyed }`. Runs are idempotent — a second run with
  nothing overdue reports zeros.

## Schedule

[`../vercel.json`](../vercel.json) registers the route on Vercel Cron with
`0 0 * * *` (daily, midnight UTC). Vercel Hobby allows one cron run per day,
which is why it is daily rather than hourly — the live-post filter already
covers the correctness gap between runs.

The dashboard warns early: `getAdminOverview()` counts temporary posts
expiring **within 2 days** so the admin can re-shoot or re-post before the
window closes.

## Verifying

`npm run verify:expiry` (27 checks) uploads a real asset, backdates
`expiresAt`, calls the cron, and asserts the asset is destroyed, the post
gone, and live/permanent posts untouched — see [testing.md](testing.md).
