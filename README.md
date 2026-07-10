# Handoff: guanxin.de homepage — direction "3b" (Engineer & Humanist)

## Overview
A single-page marketing / portfolio homepage for **Dr Ifung Lu**, trading as **Guanxin**.
Positioning: an innovation & product technologist who leads with hard engineering and
scientific credibility, then reveals a humanistic "to care" (guān xīn 關心) mission. It
must work for two audiences at once — prospective **consulting clients** (guanxin.consulting)
and **hiring managers** for a permanent/fractional role — and it also sells a product line
(Guanxin Labs / Singfinger). The visual system is deliberately technical: a fine engineering
grid, monospaced labels, a "credentials" spec panel, and the voxel "G" logo.

## About the design files
The files in this bundle are **design references created in HTML** — a prototype showing the
intended look, copy, and behaviour. They are **not production code to ship as-is**. Your task
is to **recreate this design in the target codebase's environment** using its established
patterns, component library, and conventions (React/Next, Vue, Astro, SvelteKit, plain
HTML/CSS, etc.). If no codebase exists yet, pick the most appropriate stack for a fast,
mostly-static marketing site (a static-site generator or Next.js/Astro is a good fit) and
implement it there. Reproduce the layout, type, spacing, and colour faithfully, but express
them through the target stack's idioms (components, design tokens, CSS modules/Tailwind, etc.).

## Fidelity
**High-fidelity.** Colors, typography, spacing, borders, and the hero/section structure are
final. Recreate the UI pixel-accurately. The only placeholders are the six **project images**
(and one Singfinger image), shown as diagonal-striped boxes with a monospace caption in
`[ brackets ]` — replace these with real photography (see Assets).

## Canvas & layout system
- **Design width:** the page is authored at a fixed **1200px** content width (`.a` sets `width:1200px`).
  For production, treat 1200px as the desktop max-width and make it **responsive** down to tablet/mobile
  (the reference itself is desktop-only — responsive behaviour is described under "Responsive").
- **Box model:** `* { box-sizing: border-box }`.
- **Section rhythm:** most sections are `padding: 60px 48px` with a `1px` bottom hairline
  (`--line`) between them. The nav is sticky.
- **Two recurring grids:**
  - **Hero / About:** CSS grid, `grid-template-columns: 1.35fr .9fr` (hero) and `1fr 1fr` (About), `gap: 44–48px`.
  - **Card grids:** Services/Principles = 2 columns; Selected work = 3 columns.

## Design tokens
Defined as CSS custom properties on the root design element (`.a`), with the accent overridden
by `.a.v2`:

| Token | Value | Use |
|---|---|---|
| `--ink` | `#14171a` | Primary text, dark surfaces, primary buttons |
| `--sub` | `#5a6068` | Secondary/muted text, mono labels |
| `--line` | `#e2e2df` | Hairlines, borders, grid lines, card dividers |
| `--acc` (brand red) | `#d93a2a` | Accent — kickers, links, principle numbers, care markers, hero 2nd line |
| `--paper` | `#fafaf8` | Page background |
| dark section bg | `#14171a` (= `--ink`) | Guanxin Labs band background |
| Labs accent (on dark) | `#ff8f73` | Warm tint of the brand red for the dark Labs band |
| Labs card surface | `#1c2024`, border `#2a2f34` | Spec card inside the dark Labs band |

Notes on the brand red: the client's historical brand color was pure `#ff0000`; this design
**intentionally softens it to `#d93a2a`** (a warm signal red) to harmonize with the logo's
orange→crimson gradient. Use `#d93a2a` as the single spot color; do not reintroduce `#ff0000`.

### Spacing
Section padding `60px 48px`; nav `20px 48px`; hero `66px 48px 54px`; card inner padding
`28–30px`; card grid gaps use `1px` (work grid, dividers drawn by background line) or `20–22px`.

### Radii & borders
- Buttons / spec panels: **7px** radius (spec panel is a hard `1px solid var(--ink)` box; the
  Labs sub-card is `10px`).
- Work grid: a 3-col grid with `gap:1px` over a `var(--line)` background so cells read as a
  hairline-ruled table; each cell `background:#fff`.
- The engineering **grid backdrop** on the hero:
  `background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px); background-size: 38px 38px;`

### Shadows
Effectively none in the design itself (flat, engineered). Card elevation comes from hairline
borders, not shadow.

## Typography
Two Google families:
- **IBM Plex Sans** — headings and body. Weights 400/500/600/700.
- **IBM Plex Mono** — all "instrument" text: nav links, kickers, section numbers, spec-panel
  keys, work tags/captions, footer meta. Weights 400/500/600.

Key type sizes (desktop):
| Element | Font | Size / line-height | Weight | Tracking |
|---|---|---|---|---|
| Hero H1 (`.a-h1`) | Plex Sans | 53px / 1.04 | 600 | -0.022em |
| Hero H1 2nd line (`.l2`) | Plex Sans | (inherits) | 600 | — · color `--acc`, `display:block` |
| Hero lead (`.a-lead`) | Plex Sans | 18.5px / 1.55 | 400 | — · color `--sub`, `<b>` = ink |
| Kicker (`.a-kicker`) | Plex Mono | 12px | 400 | 0.06em, UPPERCASE, color `--acc` |
| Nav links | Plex Mono | 12.5px | 400 | — · color `--sub` |
| Section number (`.a-secn`) | Plex Mono | 12px | 400 | — · color `--acc`; `.a-secn.care` also `--acc` |
| Section title (`.a-sect`) | Plex Sans | 15px | 600 | 0.01em |
| Card/service title (`.a-svc-t`) | Plex Sans | 21px | 600 | -0.01em |
| Work title (`.a-wt`) | Plex Sans | 17px | 600 | -0.01em |
| Spec value (`.v`) | Plex Sans | 14px | 600 | — · `<small>` inside = 11.5px Plex Mono, `--sub` |
| Footer headline (`.big`) | Plex Sans | 40px / 1.05 | 600 | -0.02em |

## Screens / Views
This is one continuous page. Sections in order:

### 1. Sticky nav (`.a-nav`)
- Left: brand lockup — the **voxel logo** (30px tall) + wordmark `guanxin.` (Plex Mono 600, the
  period is `--acc`).
- Center: nav links (Plex Mono): **Work · Principles · Services · Labs · About · Contact**.
  "About" links to the "Why I do this" section (`href="#why-3b"` → in production, `#about` /
  the About section anchor). All others are placeholder `#` for now.
- Right: language switch `EN / DE` (EN bold, currently visual only) and an **Available** status
  with a green pulsing dot (`#2ea36a`, `box-shadow: 0 0 0 3px rgba(46,163,106,.18)`).
- Sticky, `backdrop-filter: blur(6px)`, translucent paper background, `1px` bottom border.

### 2. Hero (`.a-hero.a-hpair`)
- Two-column grid (1.35fr / 0.9fr) over the engineering grid backdrop.
- Left column, top to bottom:
  - **Logo mark**, 82px tall, wrapped in `.gx-float` (idle float) with `.gx-mark` (entrance
    assemble) — see Animations.
  - Kicker: `Dr Ifung Lu · Innovation & Product Technologist`.
  - **Paired H1** (this is the signature of direction 3b):
    line 1 `Engineered to survive reality.` (ink) + `<span class="l2">Designed because people matter.</span>` (brand red, on its own line).
  - Lead paragraph (bold spans highlight "rigour of medicine and the empathy of design").
  - CTA row: primary button **Book a scoping call →** (`mailto:hi@guanxin.de`) + ghost button **Download CV / capabilities**.
- Right column: **Credentials spec panel** (`.a-specs`) — a hard-bordered box, header row
  `Credentials / verified`, then 5 key→value rows (Experience 25 yrs, Patents 13 US, Doctorate
  PhD UCL, Engineering MIT, Work rights EU·UK·US). Each value has a mono `<small>` subtitle.

### 3. Client logo strip (`.a-logos`)
Row: label `Trusted on work for` (mono) + wordmarks (Plex Sans 600, `#41474d`):
Johnson & Johnson · NHS · Baxter · ConvaTec · Illumina · HP · Bowers & Wilkins · WDR.
(In production, these can be real client logos if usage rights allow; otherwise keep as text.)

### 4. Principles — "How I work · guān xīn 關心, to care" (`.a-sec`, section `00`)
Care-forward section that gives the mission equal billing with services. Section number is
`.a-secn.care` (red). 2×2 grid of `.a-svc-i` cards, each with a red `◆ 0N` marker:
1. **Start with the human** 2. **Rigour is a form of care** 3. **Ship, don't theorize** 4. **Technology for good**.
(Exact copy in the HTML.)

### 5. Services (`.a-sec`, section `01`)
Same 2×2 card grid, mono `→ 0N` markers (in `--sub`, not red):
1. Product & technology strategy 2. Engineering design & prototyping 3. Design & UX for regulated spaces 4. AI-leveraged lean delivery.

### 6. Selected work (`.a-sec`, section `02`)
3-column hairline-ruled grid (`.a-work` / `.a-w`). Each card:
- Image area (`.a-wimg`, 4:3) with a mono **tag** top-left (e.g. `MEDTECH · ATOMS`) and a
  centered placeholder caption (`.a-wph`, e.g. `[ articulating instrument ]`).
- Body: mono client line (`.a-wc`, red), title (`.a-wt`), description (`.a-wp`).
Six projects: Ethicon/J&J articulating instruments (13 patents), Baxter IV nutrition vacuum
system, ConvaTec ostomy coupling, NHS Helix asthma, BioBeats, Grouple. (Exact copy in HTML.)

### 7. Guanxin Labs (`.a-labs`) — dark band, section `03`
Full-width **dark** (`--ink`) band. Section title in near-white. Two-column grid:
- Left: `Singfinger` H3 (34px), description paragraph, two buttons — primary **Get the app →**
  (uses the `#ff8f73` Labs accent) + ghost **Join Singfinger Club**.
- Right: a dark spec card (`.a-labs-card`) with 5 rows (Platform, Sign library 700+ icons,
  Video 150+, Club launch 18 founding members, Trading as guanxin.labs).
This is the revenue/products block — treat its CTAs as real commerce links in production.

### 8. Why I do this / About (`.a-sec#why-3b`, section `04`)
`04` number is red (`.a-secn.care`). Two-column About grid:
- Left: three paragraphs — the guān xīn meaning + mission, a career throughline (J&J, NHS Helix,
  Baxter/ConvaTec/Illumina, Singfinger), and the "looking for what's next" statement.
- Right: a **Profile** spec panel (`.a-cred`, same style as hero credentials) — Based, Languages,
  Passports (UK·US, contract without visas), Sectors, Open to.
This section is the nav "About" target.

### 9. Footer (`.a-foot`)
Two-column, bottom-aligned. Left: big headline **Let's build what matters.** + primary button
`hi@guanxin.de` + red mono link `science. magic. mischief. →`. Right: mono meta block (name,
Impressum address in Troisdorf, `guanxin.consulting · guanxin.labs`, © 2013–2026 · Impressum).

## Interactions & behavior
- **Nav:** sticky; "About" scrolls to the About/"Why I do this" section. Wire the other links to
  their sections (Work → Selected work, Principles, Services, Labs) with smooth scroll.
- **Primary CTAs:** `Book a scoping call` and the footer email open `mailto:hi@guanxin.de`.
  `Download CV / capabilities` should link to a PDF. Labs CTAs → app store / membership checkout.
- **EN / DE switch:** currently visual only. The client speaks German to B2 and wants EN primary
  with DE possibly later — build the toggle so a DE locale can be added, but EN is the only
  content for now.
- **Hover states:** buttons and links should have subtle hover feedback (the reference relies on
  default anchor behaviour; add hover: e.g. primary button slightly lighten, ghost button fill
  border, nav links → ink). Keep it restrained and technical.

## Animations
Logo motion (theme: "atoms, bits & community assembling into place"). Two CSS keyframes on
nested elements so they don't conflict:
- `@keyframes gx-assemble` — on `.gx-mark` (the `<img>`): from `opacity:0; transform: rotate(-26deg) scale(.5) translateY(16px)` to identity, over `1s cubic-bezier(.2,.75,.25,1)`, `both`. Plays once on load.
- `@keyframes gx-float` — on the `.gx-float` wrapper: gentle `translateY(0 → -6px → 0)` over `6.5s ease-in-out infinite`.
Respect `prefers-reduced-motion`: disable both (the reference doesn't yet — please add this in production).

## State management
Minimal — this is a mostly-static marketing page. Only stateful pieces:
- Active locale (EN/DE) if/when DE is added.
- Optional: sticky-nav active-section highlight on scroll.
No data fetching required for v1. Labs commerce (app links, Club membership) is external.

## Responsive behavior
The reference is desktop-only (fixed 1200px). For production:
- **≤ ~1024px (tablet):** collapse hero and About grids to a single column (spec panels stack
  below content); work grid → 2 columns; Labs band → single column.
- **≤ ~640px (mobile):** nav → hamburger/drawer; all card grids → 1 column; reduce hero H1 to
  ~34–38px; keep section padding but reduce horizontal to ~24px; the hero grid backdrop can stay
  or be dropped on mobile.
- Keep the credentials/spec panels readable — they're a key trust device.

## Assets
- **`guanxin.svg`** — the voxel "G" logo (included in this bundle). Isometric cube-assembly with
  a radial gradient orange `rgb(236,116,4)` → crimson `rgb(212,2,29)` → black. Used in nav (30px)
  and hero (82px). The client also has an **animated voxel version**; if available, it can replace
  the static SVG in the hero (the CSS assemble/float is a stand-in for that idea).
- **Project images (placeholders):** six in "Selected work" + one in the Labs block, shown as
  striped boxes with `[ … ]` captions. Replace with real project photography/renders. Suggested
  aspect ratios: work cards 4:3, Labs image flexible.
- **Fonts:** IBM Plex Sans + IBM Plex Mono via Google Fonts (self-host in production for
  performance/GDPR — the client is in Germany, so self-hosting fonts is recommended over the
  Google CDN).
- **Client wordmarks** (J&J, NHS, etc.) are set as text; swap for real logos only with permission.

## Content notes / source of truth
All copy in `guanxin-3b.html` is final for v1 and drawn from the client's portfolio and
LinkedIn (25 yrs, PhD UCL Medical Physics & Bioengineering, MIT mech-eng + Media Lab, 13 US
patents at Ethicon/J&J, Helix Centre, Baxter/ConvaTec/Illumina, Singfinger). Contact:
`hi@guanxin.de`. Impressum: Paul-Keller-Straße 7, 53840 Troisdorf, Germany.

## Files
- `guanxin-3b.html` — the high-fidelity design reference (self-contained: fonts via CDN link,
  all CSS inline in `<head>`, logo referenced as `guanxin.svg`). Open in a browser to view.
- `guanxin.svg` — the logo asset.
- `screenshots/01–06-section.png` — full-page rendering captured top-to-bottom (hero →
  principles/services → work → Labs → About → footer) for quick visual reference. The live
  `guanxin-3b.html` is the source of truth; the screenshots are a convenience.
- `README.md` — this document.

> The full source that this direction was extracted from (which also contains earlier explored
> directions 1a–3c) lives in the parent project as `Guanxin Redesign.dc.html`. Only direction
> **3b** is in scope for this handoff.
