# stevebrock.bio — Design Spec

*Design date: 2026-07-10 · Author: Code (with Steve). Status: awaiting Steve's review.*

## Goal

A personal "all about me" showcase site for **Steve Brock** — actor, singer-songwriter,
filmmaker, screenwriter. **Minimalist-*looking*** (clean, spare, lots of air) but **not basic**:
real substance under every section, not a link dump. Replaces the earlier link-in-bio brief,
which was structure-without-content.

## Concept: "The Program"

The site is a beautifully typeset **theatrical program / playbill** for Steve — a metaphor that's
literally true (he's a stage performer). **One elegant scrolling page.** Each "act" carries a line
(or two) of real context under each work, a genuine bio, and his creative through-line —
*identity, trauma, and human resilience*.

## Aesthetic — Editorial / Playbill

- **Type:** Bodoni Moda (display, already loaded via Google Fonts) + Archivo (clean body face).
- **Color:** warm off-white "paper" in light mode, deep ink in dark mode; **one** restrained
  accent — a brass/gold "playbill ink." Theme-aware (respects light/dark).
- **Devices:** generous margins, **hairline typographic rules** between acts (playbill feel),
  centered masthead, framed headshot portrait. No clutter, lots of air.
- Minimalist look, real depth underneath. No decorative noise.

## Structure & content (order: **Screen → Stage → Song**)

Every link below is a **real URL** pulled from the existing `index.html` — do not invent or alter.

### 1. Cover / Masthead
- `Steve Brock` in Bodoni display.
- Roles line: **Actor · Singer-Songwriter · Filmmaker · Screenwriter**.
- Headshot: `https://images.squarespace-cdn.com/content/v1/6125b02997268b140e420722/134ea8f3-ba35-44d7-bb47-537cdb7cd30d/291A0641.jpg?format=750w`
- One-line essence: *"Work that blends music, film, and theater — identity, trauma, and resilience."*
- Quiet in-page nav (Screen · Stage · Song · Connect · Contact).

### 2. Overture (About) — *depth: real bio*
A short bio paragraph (2–4 sentences). LA-based. States the through-line plainly.
**DRAFT copy (Steve to approve/replace):**
> Steve Brock is a Los Angeles–based actor, singer-songwriter, filmmaker, and screenwriter
> whose work blends music, film, and theater. Across the stage, the screen, and the recording
> booth, his through-line is the same: identity, trauma, and human resilience.

### 3. Act I — On Screen (Fair Oaks Films) — *depth: may open a little further*
- **Fair Oaks Films** — `https://www.stevebrock.media/fof` (studio home: `https://www.stevebrock.media`)
- Films, a line each:
  - *Making Amends* — `https://seb.ink/makingamends`
  - Feature on Amazon Prime Video — `https://www.amazon.com/gp/video/detail/B08CMV3L87` (also `https://seb.ink/amazon`)
  - *(Even Steve, Echoes of Kerberos named in prose — link only where a real URL exists)*
- Screenwriting noted here in a sentence.

### 4. Act II — On Stage (The Actor) — *depth: sentence each*
- **My Fair Lady** (stage credit, prose).
- One-man show **My Calico Soul** — `https://vimeo.com/278872773` — with its real framing
  (a personal work on identity). *(Framing approved by Steve.)*
- Casting profiles: IMDb `https://www.imdb.me/stevebrock` · Actors Access
  `http://resumes.actorsaccess.com/stevebrock` · Casting Networks
  `https://app.castingnetworks.com/talent/public-profile/c1a91e90-bdb3-11eb-ac81-9d7aec181d6d`
- EPK (press kit) — `https://www.stevebrock.media/s/EPK.pdf`

### 5. Act III — In Song (The Music) — *depth: sentence each*
- Two albums + current **A Trip Around the Sun** (20 songs; "Sinatra to Sting") — prose.
- Listen: Spotify `https://open.spotify.com/artist/1sKvL2PiY0uNzfvjO3cxTa` · Apple Music
  `https://music.apple.com/us/artist/steve-brock/504613119` · YouTube Music
  `https://music.youtube.com/channel/UCbJ-PcUB8aGwpr9_OQMdQ4w` · Amazon Music
  `https://music.amazon.com/artists/B0C5LFG67B/steve-brock`
- Shop — `https://www.stevebrock.shop`
- **One embed** (kept spare): Spotify artist player
  `https://open.spotify.com/embed/artist/1sKvL2PiY0uNzfvjO3cxTa` *(or the YouTube-nocookie
  embed `cboOujOHOuc` — pick one, not both, to protect the minimal feel).*
- Music collaborator credit: Kayla Burch Music `https://kaylaburchmusic.com` (small, in prose/footer).

### 6. The Company (Connect) — *restrained row, not 8 loud buttons*
Instagram `https://www.instagram.com/stevebrockactor` · Facebook
`https://www.facebook.com/brockjazz` · TikTok `https://www.tiktok.com/@stevebrockactor` ·
Threads `https://www.threads.net/@stevebrockactor` · Twitter/X `https://www.twitter.com/stevebrock` ·
Patreon `https://www.patreon.com/stevebrock`. Rendered as a quiet single row.

### 7. Stage Door (Contact)
- **Form:** name / email / message + hidden honeypot (`botcheck`). Native `POST` to the DO
  Function (form-encoded → Resend → 303 redirect back to `stevebrock.bio?sent=1`). **No CORS,
  no fetch/AJAX** — native form post. `?sent=` script shows a success/failure line.
- Representation: **Andy · Midwest Talent** — `mailto:andy@midwesttalent.com`
- Direct: phone `tel:+13238616679` · vCard `https://stevebrock.media/s/contact.vcf`

### 8. Colophon (footer)
Quiet copyright + a hairline rule. Nothing else.

## Deployment plumbing (built after the page is approved)

- **Host:** a **new** DO Space `stevebrock-bio`, custom domain `stevebrock.bio`.
- **Contact function:** DigitalOcean Function, modeled on the existing Fathom feedback fn
  (`tools/feedback-fn`). Form-encoded body → Resend → **303 redirect** to `SITE_URL` `?sent=1`.
  `FROM`: reuse the verified `updates.stevebrockmedia.com` domain (e.g.
  `noreply@updates.stevebrockmedia.com`); `TO`: Steve's contact address.
- **CORS:** none needed (native form POST, not fetch).

## Non-negotiable constraints (carried from the original brief)

1. **Never commit `.env` or the Resend API key.** Run `git log -p` before any push to verify no
   secret slipped in. `.env` is gitignored from the first commit.
2. **Do NOT create a new Resend key** — reuse the existing wiring / verified domain. If any
   Resend/DO resource is ambiguous, **stop and ask** rather than guess.
3. This repo is **separate from Fathom** (`~/Developer/stevebrock-bio/`), its own git.

## Open items for Steve
- **About bio copy** — approve/replace the DRAFT paragraph above.
- **Films** — confirm which of *Even Steve* / *Echoes of Kerberos* have public URLs (prose-only otherwise).
- **Music embed** — Spotify player vs. YouTube video vs. none (I lean: Spotify, one only).
- **Contact `TO` address** — which inbox the form should deliver to (Steve's action to confirm).
- Deploy blockers (Steve's action): `doctl auth init` token; where `stevebrock.bio` DNS is managed.

## What's explicitly OUT (YAGNI)
No CMS, no build step, no framework, no analytics, no cookie banner (no tracking), no Cloudflare,
no multi-page site. One hand-authored `index.html` + one small function + a deploy script.
