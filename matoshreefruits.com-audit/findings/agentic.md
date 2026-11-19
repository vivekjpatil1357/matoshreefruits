# Agentic Browsing Readiness — matoshreefruits.com

> **Status vs repo (`ab454ed`, verified 2026-11-11):**
> - **P0 robots AI groups** — *Still open* (`src/app/robots.js` still one `*` group).
> - **P1 llms.txt** — *Still open* (no llms.txt route/file in the repo).
> - **P1 markdown delivery** — *Still open* (no `.md` alternates or content negotiation in `src/`).
> - **P1 Content-Signal** — *Still open* (no `Content-Signal` anywhere).
> - **P1 hreflang** — *Still open.* `src/app/[locale]/layout.js:22-24` still emits relative URLs with no `x-default`; `next.config.mjs` still has no `metadataBase`.
> - **P2 webmcp-tools** — *Still 0* `registerTool` call sites in `src/`.
> - **P2/P3 `.well-known` / ai-catalog** — *Still absent* (nothing under `public/.well-known`).
> - **Footer link contrast (`text-muted/50`)** — *Still open.* `src/app/[locale]/components/Footer.js:133` still uses `text-[11px] text-muted/50`.

## Lighthouse Agentic Browsing
Mobile: **0/0** (Lighthouse 13.6.0) — no agentic audits ran  
Desktop: **0/0** (Lighthouse 13.6.0) — no agentic audits ran  
*Note: Lighthouse Agentic Browsing fraction is not yet part of standard PSI output; the `lighthouse_agentic.py` script would populate this. PSI reports standard scores: Performance 99/81, Accessibility 96/96, Best Practices 100/100, SEO 91/91.*

## Agent-UX Heuristic (accessibility-tree)
**Status: partial** — landing page has landmarks (`main`, `footer`, `nav`), logical heading order (h1 → h2 sections), skip link present. Fails: color-contrast audit score 0 (footer link #b5b7ac on #fffdf5 = 1.99:1). No form controls on home page.

## Findings by Priority

### P0 — robots-ai-groups (info)
**Evidence**: robots.txt has one `User-agent: *` group; all 16 known AI agents fall through to it. No named groups for training vs search vs user-triggered.  
**Fix**: Add deliberate groups in `src/app/robots.js:6-11`, e.g.:
```js
rules: [
  { userAgent: "GPTBot", disallow: "/" },
  { userAgent: "OAI-SearchBot", allow: "/" },
  { userAgent: "ClaudeBot", disallow: "/" },
  { userAgent: "Claude-SearchBot", allow: "/" },
  { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
],
```

### P1 — llms.txt (info)
**Evidence**: `/llms.txt` returns 404 (agentic.json:llms.status=404).  
**Fix**: Add `src/app/[locale]/llms.txt.js` (or static file in `public/`) with H1, `>` summary, and Markdown links per llmstxt.org.

### P1 — markdown-delivery (info)
**Evidence**: No `Accept: text/markdown` negotiation (`vary_accept: false`), no `.md` sibling (404), no `rel="alternate" type="text/markdown"`.  
**Fix**: In `src/app/[locale]/layout.js`, add a `rel="alternate"` link for `.md` or implement content negotiation via middleware.

### P1 — content-signal (info)
**Evidence**: No `Content-Signal` header in robots.txt groups.  
**Fix**: Optional — add `Content-Signal: search=yes, ai-input=yes, ai-train=no` to search-crawler group in `robots.js`.

### P1 — hreflang (failed audit, score 0)
**Evidence**: Lighthouse flags invalid hreflang (mobile + desktop). Current: `<link rel="alternate" hreflang="hi" href="/hi" />` etc. — missing `x-default` and absolute URLs.  
**Fix**: In `src/app/[locale]/layout.js:22-24`, emit absolute URLs and add `x-default`:
```js
alternates: {
  languages: {
    ...Object.fromEntries(LOCALES.map(l => [l, `${BASE}/${l}`])),
    "x-default": `${BASE}/hi`,
  },
},
```

### P2 — webmcp-tools (info)
**Evidence**: 0 `registerTool` call sites, 0 forms on home page.  
**Fix**: Optional — if search/checkout forms added, register tools via `navigator.modelContext.registerTool()` in client components.

### P2 — well-known files (na)
**Evidence**: `/.well-known/api-catalog`, `oauth-protected-resource`, `oauth-authorization-server`, `agent-card.json`, `ucp` all 404.  
**Fix**: Not needed unless operating matching services.

### P3 — ai-catalog.json (na)
**Evidence**: `/.well-known/ai-catalog.json` 404, not signalled.  
**Fix**: Only if publishing MCP/A2A resources.

## Access Policy (robots.txt groups)
- **Training**: GPTBot, ClaudeBot, CCBot → currently allowed (fall through to `*`)
- **Search**: OAI-SearchBot, Claude-SearchBot, PerplexityBot, Google-Extended → currently allowed
- **User-triggered**: ChatGPT-User, Claude-User, Perplexity-User, Google-Agent → currently allowed (vendor behaviour varies)

## Standards Status (checked 2026-09-23)
- **Content-Signal**: Cloudflare CC0 + IETF draft; Google ignores
- **llms.txt**: Community spec (llmstxt.org); Lighthouse checks, Google ignores
- **WebMCP**: W3C CG draft; WebKit opposes, Mozilla neutral
- **ai-catalog.json (ARD)**: ARD spec 1.0; Lighthouse 13.5 `ard-schema`
- **robots.txt AI groups**: RFC 9309

## Next.js 16 Fix Pointers
- `src/app/robots.js:6-11` — add named AI agent groups
- `src/app/[locale]/layout.js:22-24` — fix hreflang with absolute URLs + x-default
- `src/app/[locale]/llms.txt.js` (new) — add llms.txt route
- `src/app/[locale]/layout.js:49-56` — color contrast: change footer link `text-muted/50` (--muted #6b7264 at 50% opacity on --surface #fffdf5) to meet 4.5:1; use `text-muted` or darker token
- `src/app/[locale]/layout.js` — add `rel="alternate" type="text/markdown"` link or middleware for Markdown delivery