# stevebrock.bio — site reference

Steve's personal bio / landing site. This file is the working reference for anyone (human or Claude) touching the site — read it first.

## Where it lives
- **Local:** `~/Developer/stevebrock-bio`
- **Remote:** `github.com/stevebrock91387/stevebrock-bio`
- **Live:** `https://stevebrock.bio` (custom domain via `CNAME`), served by **GitHub Pages**.

## How it's built (this is the important part)
It's a **static site generated from data** — do NOT hand-edit the generated HTML:

```
content.json   →   build.mjs   →   index.html   →   GitHub Pages   →   stevebrock.bio
 (the content)     (the builder,      (GENERATED —
                    holds the HTML     never edit
                    template + head)   by hand)
```

- **`content.json`** — all the site's *content* (text, links, headshot URL, etc.).
- **`build.mjs`** — the Node builder. It holds the full HTML template, including the `<head>` (title, meta, Open Graph, **favicons**, fonts) and the page structure/CSS. Regenerate with `node build.mjs`.
- **`index.html`** — **GENERATED and committed. NEVER edit it directly** — a rebuild overwrites it. To change the page, edit `content.json` (content) or `build.mjs` (structure/head/styles), then run `node build.mjs`.
- **`/admin`** — **Sveltia CMS** (Git-based, GitHub OAuth). Editing content there commits `content.json`.
- **`functions/`** — DigitalOcean serverless functions (the contact form posts here → **Resend** emails Steve). Deployed via `doctl`; `functions/.deployed/` is local state (gitignored).

## Deploy flow (automatic)
Push to `main` → `.github/workflows/build.yml` fires **when `content.json`, `build.mjs`, or the workflow change**: it runs `node build.mjs`, regenerates `index.html`, and commits it (that index.html commit is path-excluded so it doesn't re-trigger). Then GitHub Pages builds and the live site updates in ~1–2 min. Editing in `/admin` commits `content.json` → same flow, hands-free.

**So: to change the site, either edit in `/admin`, or edit `content.json`/`build.mjs` and push.** You can run `node build.mjs` locally to preview/commit the regenerated `index.html`, but the workflow will also do it on push.

## Favicon
- Files live in the repo **root**: `favicon.ico` (multi-res 16/32/48), `favicon-16x16.png`, `-32x32.png`, `-48x48.png`, `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`. Source was a headshot at `~/Downloads/favicon.png`, resized with Python Pillow.
- The `<link>` tags live in **`build.mjs`'s `<head>` template** (added 2026-07-14) — NOT only in the generated `index.html` — so they survive every rebuild. (They were briefly only in `index.html`, which would have been wiped on the next content edit.)
- **Gotcha:** browsers cache favicons hard. After a deploy, hard-refresh (⇧⌘R) or bust with `?v=2` to see a change — "not showing" is usually the cache, not the repo.

## Gotchas / rules of thumb
1. **Never edit `index.html` directly.** Edit `content.json` or `build.mjs`, then `node build.mjs`.
2. Anything in the `<head>` (meta, favicons, fonts) goes in **`build.mjs`**, not the generated file.
3. Contact form runs on DO functions + Resend — a server-side flow, not a mailto.
4. Node is available locally (`/opt/homebrew/bin/node`).
