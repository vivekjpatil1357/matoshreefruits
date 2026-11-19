# Media — Cloudinary signing, direct browser uploads, deletion

Media (photos + videos) live in Cloudinary; MongoDB only stores metadata
(`publicId`, `url`, `resourceType`, `resourceType`-aware dimensions where
present) on the `Post.media` array (max 30 items — `sanitizeMedia()` in
[`../src/lib/admin.js`](../src/lib/admin.js)).

Helpers live in [`../src/lib/cloudinary.js`](../src/lib/cloudinary.js).

## Configuration

Three env vars, all required for uploads/deletion:
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
(see [deployment.md](deployment.md)). `isCloudinaryConfigured()` gates every
path — when unset, upload-signature returns `503 { code: "not_configured" }`
and destroys are skipped instead of throwing.

## Signed upload flow (why it's built this way)

The API secret must never reach the browser, and serverless functions have
small body limits — so the browser uploads **directly to Cloudinary** and the
server only signs the request:

1. Admin clicks "Add media" in `PostEditor` → client calls
   `POST /api/admin/upload-signature` (session + same-origin).
2. The route returns `{ cloudName, apiKey, folder, timestamp, signature, uploadUrl }`
   via `uploadSignature()` — folder is `matoshree/posts`.
3. The client `XMLHttpRequest`s the file to
   `https://api.cloudinary.com/v1_1/<cloud>/auto/upload` with that signature,
   reporting per-file progress. Large videos never pass through Vercel, so
   no serverless body-size limit applies.

**Signature algorithm** (`cloudinarySignature()`): drop empty values, sort
the remaining `key=value` params, join with `&`, append the API secret, then
SHA-1 hex — Cloudinary's documented scheme. The signature is only valid for
the params it covers (folder + timestamp), so it cannot be reused to upload
somewhere else or later.

**Client-side size limits** (`MediaUploader.js`):
12 MB per image, 100 MB per video, `accept="image/*,video/*"`.

## Deletion

- `destroyCloudinaryAsset({ publicId, resourceType })` — best-effort single
  delete (signed `POST /<type>/destroy` with `invalidate=true`, 15 s timeout).
  It **never throws**: failures return `{ ok: false }` and log a warning, so
  cleanup paths can't be blocked by a Cloudinary outage.
- `destroyMediaList(media)` — loops the above, returns the count destroyed.
- Callers:
  - `POST /api/admin/media/destroy` — the media picker's "remove" (confirms
    first in the UI); with `postId` it also detaches the record from the post.
  - `DELETE /api/admin/posts/[id]` — deleting a post destroys its media.
  - the expiry cron — see [expiry-cron.md](expiry-cron.md).

## Rendering

Public images go through `next/image` with `res.cloudinary.com` in the
`images.remotePatterns` config of the [locale layout](../src/app/[locale]/layout.js),
so Cloudinary URLs are optimized and sized instead of hot-linked raw.

See also: [api.md](api.md) (`upload-signature`, `media/destroy`),
[admin-dashboard.md](admin-dashboard.md) (where uploads happen),
[testing.md](testing.md) (suites upload and destroy real assets).
