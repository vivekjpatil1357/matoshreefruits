# Design system

> "Fresh arrivals. Trusted quality. Direct connection."

The design direction: a fresh, premium agricultural-trading look — not a
typical green-template business website. Warm cream backgrounds, rich
banana-leaf green, soft yellow accents; real arrival photos, clear
availability and quick WhatsApp enquiries. The repeat-visit mechanic is fresh
content ("Latest Arrivals", recent posts), not decorative animation.

Reference sites used for direction:

- [Mahakissan Agro Farms](https://mahakissanagrofarms.com/)
- Coragrofrut (Awwwards nominee — visual reference)

This document describes **what is actually implemented** — the tokens in
[`../src/app/globals.css`](../src/app/globals.css) and the conventions the
components follow. When docs and code disagree, the CSS wins. The root
[`DESIGN.md`](../DESIGN.md) is a short pointer to this file (a comment in
`globals.css` references DESIGN.md by name).

## Color tokens

Defined as CSS variables on `:root` and mapped to Tailwind v4 theme colors via
`@theme inline`, so components use classes like `bg-brand`, never raw hex.

| CSS variable | Value | Tailwind class | Use |
| --- | --- | --- | --- |
| `--background` | `#fdf8ec` | `bg-background` | warm cream page background |
| `--foreground` | `#1c2a1e` | `text-foreground` | default text (deep leaf-shadow) |
| `--surface` | `#fffdf5` | `bg-surface` | cards, footer, elevated panels |
| `--brand-green` | `#2f6b30` | `bg-brand` / `text-brand` | primary actions, links, focus ring, browser theme color |
| `--brand-green-dark` | `#1f4a21` | `bg-brand-dark` / `text-brand-dark` | headings, hover state, leaf-field base |
| `--brand-green-soft` | `#eaf2e4` | `bg-brand-soft` | soft green fills (published pills, ghost hover) |
| `--brand-yellow` | `#f5c542` | `bg-accent` | soft ripe-yellow accents |
| `--brand-yellow-soft` | `#fdf0c9` | `bg-accent-soft` | accent fills (draft/pending pills) |
| `--muted` | `#6b7264` | `text-muted` | secondary text |
| `--border` | `#e7e0cc` | `border-line` | hairline borders |
| `--field-deep` | `#143019` | `bg-field` | deep leaf field — hero only |

Danger/spam states use Tailwind reds directly (e.g. `btnDanger`, the `spam`
status pill in `src/app/admin/components/ui.js`).

## Typography

- **Fonts via `next/font` (Google)** in the
  [locale layout](../src/app/[locale]/layout.js), both covering Devanagari
  and Latin so mr/hi/en render identically:
  - `Mukta` (400/500/600/700) — body face, exposed as `--font-mukta` and
    mapped to `--font-sans` (with a system-stack fallback so a late font
    never blocks paint).
  - `Baloo_2` — display face for `h1`–`h4`, rounded and friendly
    (`--font-baloo` → `--font-display`).
- Page `h1` / section `h2`: `font-bold tracking-tight text-brand-dark`,
  `text-2xl sm:text-3xl` (`SectionHeading`, admin `pageH1`).
- Body copy: `text-sm`/`text-base leading-relaxed text-muted`.
- Micro labels (admin): `text-[11px] font-semibold uppercase tracking-wide`.
- A `font-mono` theme stack exists for code-like values.

## Layout & spacing

- Public pages wrap content in `mx-auto max-w-6xl px-4 sm:px-6`; section
  rhythm is `py-10 sm:py-14` … `sm:py-16`.
- `body` is a flex column (`flex min-h-full flex-col`) with `mt-auto` on the
  footer, so the footer sticks to the bottom even on short pages.
- Header height `h-16`; grids use `gap-5` … `gap-10`.
- Cards: `rounded-2xl border border-line bg-surface shadow-sm` (admin shares
  the `card` / `cardPad` strings from `ui.js`).
- Inputs: `rounded-lg border border-line` + `px-4 py-3` (public forms) or
  `px-3 py-2` (admin `input`), with `focus:border-brand` and
  `focus:ring-2 focus:ring-brand/20`.
- Primary pill CTA: `rounded-full bg-brand px-5 py-2.5 text-sm font-semibold
  text-white hover:bg-brand-dark`; admin buttons are squared-off `rounded-lg`
  variants (`btnPrimary`, `btnGhost`, `btnDanger`).
- Status badges: one `pill` primitive + a `statusPill` map (published, draft,
  temporary, approved, spam, …) so every screen colors states identically.

## Surfaces & ornament

- **Fixed grain**: a `body::after` SVG-noise overlay at 5% opacity sits above
  content (`z-10`) but below all chrome (header, bottom bar, lightbox) — it
  breaks the digital flatness of the cream field. `pointer-events: none`.
- **`.leaf-field`**: a drawn banana-leaf pattern in brand colors used as the
  hero's fallback surface until the first admin photo exists (subject-drawn,
  not decoration — it disappears behind real photographs).
- **Hero prints** (`HeroPrints.js`): the principal hero photo slot crossfades
  the newest lots like light shifting in a room; without JS the first print
  stays, reduced-motion stops the rotation, and it pauses while the tab is
  hidden.
- **Mobile bottom bar** (`BottomBar.js`): fixed WhatsApp / Call / Stock
  shortcuts below `lg` (the header carries the same actions on larger
  screens); items without an href are dropped, and `body` gets matching
  bottom padding (`4rem + safe-area`).

## Interaction & accessibility

- Global focus ring: `:focus-visible` → 2px `--brand-green` outline, 2px
  offset — one consistent ring everywhere, invisible on mouse clicks.
- Skip-to-content link, semantic landmarks (`header`/`nav`/`main`/`footer`)
  and h1 → h2 heading order are built into `[locale]/layout.js`.
- Mobile-first details: `-webkit-text-size-adjust: 100%`, notch safe-area
  padding on `body`, `viewport-fit: cover` and brand-green `themeColor`
  (the `viewport` export in the locale layout).
- `overflow-x: hidden` on `html/body` — long words/URLs never cause
  horizontal scroll.
- Anchor jumps glide (`scroll-behavior: smooth`) only under
  `prefers-reduced-motion: no-preference`.
- Motion is intentionally minimal: freshness of content, not animation, is
  what brings buyers back.

## Component conventions

- Public pages are Server Components; interactivity lives in small client
  islands (`GalleryClient`, `StockBrowser`, `FeedbackForm`,
  `LanguageSwitcher`, `HeroPrints`, `BottomBar`, the header menu).
- Shared public building blocks: `SectionHeading`, `EmptyState`, `StockCard`,
  `PostCard`, `Stars`, `WhatsAppButton`, `Icons`.
- The admin area keeps its own shared class strings in
  `src/app/admin/components/ui.js` (card, label, input, buttons, pills) —
  admin screens never hand-roll form styles.
- Images are `next/image` restricted to the allow-listed `res.cloudinary.com`
  host (see [media.md](media.md)).
- All copy comes from `src/messages/<locale>.json` through the `[locale]`
  layout — no hardcoded strings in components, so mr/hi/en stay in sync
  (see [i18n.md](i18n.md)).
- **No prices anywhere.** Stock cards show quantity, quality, location and
  availability only; every conversion path is a WhatsApp button.

## Known gap

The footer credit link uses `text-muted/50` (~2:1 contrast on `--surface`) —
below WCAG AA for text. Not yet fixed in
[`../src/app/[locale]/components/Footer.js`](../src/app/[locale]/components/Footer.js).
