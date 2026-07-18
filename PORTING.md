# OrbitWorks — site build

Next.js 16 (App Router, TypeScript, Turbopack) built on the `kenza-4.3.4`
WordPress theme, which was ported from the HTTrack mirror in `../kenza.io`.
Content comes from the Vivacity Solutions site (same company — rebrand).

## ⚠️ Assets are still Kenza's

The theme CSS, the hero/loop videos, the photography in `public/media` and the
case-study imagery are all **Kenza's**, standing in as placeholders. They carry
Kenza's brand, not yours. Replace before this goes public:

| What | Where |
| --- | --- |
| Hero + loop videos | `lib/video.ts` → `public/video/*` |
| Case-study imagery | `lib/content.ts` → `CASE_STUDIES[].image` |
| Front-page cluster photos | `components/blocks/FrontPageImageCluster.tsx` |

PP Mori is also a **commercial font** (Pangram Pangram) that came off Kenza's
CDN — it needs its own licence for this site.

## Not wired up

- `app/api/contact/route.ts` — validates, delivers nowhere. Enquiries are dropped.
- `app/api/newsletter/route.ts` — same; replaces the dead WP/Salesflare route.
- `app/legal/page.tsx` — scaffolding, not reviewed policy copy. The cookie banner
  links here, and there's a Berlin office (GDPR).
- `SOCIAL` in `lib/content.ts` is empty on purpose — the theme shipped with
  Kenza's own Instagram/LinkedIn hard-coded. The footer block hides while empty.
- `/blogs` lists titles only; posts have no bodies, so nothing links out.
- `metadataBase` in `app/layout.tsx` points at a placeholder origin.

## Approach

The theme's compiled CSS is **reused as-is** rather than re-authored. 317KB of
compiled Sass encodes the entire design — hand-rewriting it would guarantee
drift. Instead:

1. `app/theme.css` is the original stylesheet, mechanically transformed
   (see `scratchpad/port_css.py`): `@font-face` blocks stripped, `PP Mori` →
   `var(--font-sans)`, CDN URLs → local `/theme` and `/media` paths.
2. React components emit **the same class names and DOM shape** the CSS expects.
3. The vanilla JS bundle is ported to hooks, preserving its class contract.

### CSS load order is load-bearing

`app/layout.tsx` imports, in this order:

| file | why |
| --- | --- |
| `wp-pre.css` | `wp-img-auto-sizes` + `structured-content`; before the theme |
| `theme.css` | the ported kenza-4.3.4 stylesheet |
| `wp-blocks.css` | WordPress core block styles — **after** the theme |
| `base.css` | tokens/overrides |
| `orbit.css` | OrbitWorks accent, last so it wins without `!important` |

`wp-blocks.css` must stay after the theme: it carries
`html :where(img[class*=wp-image-]){max-width:100%}`. Hoist it above and every
image renders at intrinsic width and the page scrolls sideways.

### `data-video` is a styling hook, not a data carrier

The sources moved to `lib/video.ts`, but the **attribute must stay** on the
wrapper. `theme.css` keys real layout off it:

```css
[data-video] video { width:100% }                       /* else intrinsic 1920px -> h-scroll */
.js-ready [data-video] video.preview { opacity:1 }      /* the fade-in */
@media (max-width:979px){ [data-video] .poster .preview{ height:94.2vw } }
```

### The nav you see on a hero page is a clone

`modules/nav-position` cloned `nav.header ul` into a `<nav class="fake-nav">`
appended *inside* the hero on `body.nav-white` pages. The real fixed nav is
hidden until `.top-link` scrolls out of view (`html.mob-nav`). Style both, or
the homepage nav appears unstyled — see `orbit.css`.

This means **class names and `data-*` attributes are load-bearing**. Renaming
`.ahide`, `.aitem`, `data-transition`, or a `wp-block-*` class silently breaks
styling or animation. Read the comment in the file before changing one.

## The animation system

The theme has no GSAP — it is hand-rolled IntersectionObserver + rAF.

| Class | Meaning |
| --- | --- |
| `.ahide` | `opacity:0; transform:translate3d(0,10rem,0)` — the pre-reveal state |
| `.aitem` | `transition: opacity/transform 3s cubic-bezier(.23,1,.32,1)` |
| `.apending` (on `<html>`) | suppresses all transitions until hydration |
| `.js-ready` (on `<html>`) | gates hero/video reveals |

`TransitionEngine` tags elements `.ahide + .aitem`, then removes `.ahide` 100ms
after they intersect (that is what plays the slide-up) and `.aitem` at 4s.

A container with `data-transition-include="through"` does **not** animate itself —
its children animate individually and `theme.css` staggers them by `nth-child`.

Ported modules: `transitions`, `poster-parallax` (`--scroll`), `marquee`
(`--marquee`/`--speed`), `video` (`videoplay`), `mouseover-circle`, `fade-text`,
`cookie-banner`, `hubspot-forms`, `animatedCarousel`, `nav-position`.

`frontanimation` was **not** ported: the trigger exists in `theme.css` but appears
in zero pages of the mirror.

`header-scroll` is **not** ported yet: it only runs on `body.service`,
`body.services` and `body.portrait`, none of which exist yet. It toggles
`html.scrolling` when scrolling down past 200px. Needed for the services pages.

## Brand

`--orbit: #fe063b` / `--orbit-paper: #fcfbfa` in `app/orbit.css` are the single
source of truth; `scripts/build-logo.mjs` snaps the logo PNGs to the same values.

`npm run build:logo` regenerates `public/brand/*` from `public/logo.png`:
crops ~55% transparent padding, and bakes a light and a dark lockup. The nav
lockup drops the tagline (32px in the source → ~3px at nav size, i.e. mush).

Two variants are needed because the theme auto-inverted its logo with
`mix-blend-mode: difference` — that trick turns the OrbitWorks crimson cyan, so
the blend is off and the variants swap on `.nav-black` / `html.mob-nav` instead.

Because a flat PNG can't blend, it collides with the big `deco-l` titles, so
`HeaderScroll` (the theme's own `header-scroll` module) now runs site-wide to
slide the logo away on scroll-down. The theme only ran it on `.service`.

## Responsive

`npm run check:pages` drives **every route** at 375/834/1440 in headless
Chromium and reports horizontal overflow, failed requests and JS errors —
ignoring elements an ancestor clips. Currently **all routes clean**.

Run it after every change. It has caught three overflow bugs so far, all
invisible in the markup:

1. Missing WP core CSS → images at intrinsic width.
2. Dropped `data-video` attribute → hero video at intrinsic 1920px.
3. `logo-mark`'s literal text "OrbitWorks" overflowing its 6rem footer box —
   the theme only hid it with `color:transparent`, which was fine for "Kenza".

### The navbar scrim

The fixed header is transparent. The theme kept its logo legible over scrolling
content with `mix-blend-mode: difference`; a flat-colour PNG can't, so page
content (the big `deco-l` headings) bled straight under the logo. `Nav` renders
an opaque `.orbit-navbar-scrim` behind the header — shown on inner pages and once
scrolled past a hero, hidden over the hero and while scrolling down. Don't remove
it, and keep it AFTER `#nav-toggle` in the DOM (a `:checked ~` rule targets it).

### Oversized source media

The supplied service photos are 5000-8000px raw JPEGs (several MB each) and
`ai.mp4` is 23MB. The capability showcase uses `next/image` (`fill` + `sizes`) so
they're resized/reformatted per viewport — but `next start` optimizes on first
request, so the very first visitor waits while a huge image is processed
(subsequent loads are cached). Compress the sources to sane dimensions before
launch; it's the one outstanding performance item.

### The one it CANNOT catch

`html, body { overflow-x: clip }` in `base.css` is not tidying — do not remove it.

theme.css full-bleeds 18 rules with `width:100vw` + `left:50%` +
`translateX(-50%)`. `100vw` includes the scrollbar; the content box does not. On
any desktop with classic (non-overlay) scrollbars — i.e. Windows — every one of
those is ~15px wider than the page, producing a horizontal scrollbar.

**Headless Chromium uses overlay scrollbars, so `check:pages` reports 0px and is
blind to this.** It was reported from a real browser, not found by the checker.
`clip` rather than `hidden` because `hidden` would make this a scroll container
and break the theme's `position:sticky` blocks (case slider, image cluster).

## Assets

The mirror was captured with `+*.png +*.gif +*.jpg +*.jpeg +*.css +*.js`, which
silently excluded `.woff2`, `.svg`, `.mp4`, `.webm` and `.webp`. Those were
re-fetched from Kenza's own live CDNs (`scratchpad/fetch_assets.sh`):

- `public/theme/fonts/` — the real **PP Mori**, 14 faces, self-hosted via
  `next/font/local` (`lib/fonts.ts`). Nothing else defines the family.
- `public/media/` — 183 images from the mirror + 22 real SVG logos.
- `public/theme/images/reports-wheel/` — 14 wheel plates.
- `public/video/` — 18 preview loops (~22MB).

### Known gaps

- **The full film is absent.** `KENZA_FILM_20240429-2.*` (~30MB × 6 variants) was
  deliberately skipped. `FULL_FILM` in `lib/video.ts` is `null`, so the hero shows
  its loop with no "Play film" control. Drop the files into `public/video` and
  populate that export to restore it.
- **`/portraits` and `/science/innovation-adoption-index` 404'd during the crawl**
  and exist only as 404 captures — but the homepage links to `/portraits`, so the
  page is live and simply wasn't served to the crawler. It needs re-capturing.
- **Newsletter is not wired.** `app/api/newsletter/route.ts` replaces the dead
  `/wp-json/kenza/v1/salesflare/submit`; it validates and returns success without
  forwarding. Point it at Salesflare before launch.
- **Carousel scroll-hijack simplified.** The original rewrote `document.scrollTop`
  mid-gesture and collapsed its own spacer to snap between cards. `CaseSlider`
  maps scroll position to an index instead — visually equivalent, but worth a
  review pass against the live site.

## Route chrome

`lib/routes.ts` is **generated** from the mirror (`scratchpad/route_map.py`) and
holds each route's `<body>` class, nav modifier, and selected nav item.

This is not cosmetic: `theme.css` scopes 179 rules to `.service`, 153 to `.case`
and 88 to `.science`. A page renders wrong without its exact class set. The nav
modifier is read per page rather than derived — `/science` and `/services` are
`nav-black` in body yet render `header` with no modifier.

`proxy.ts` forwards the pathname as `x-pathname` so the root layout can resolve
the body class server-side (Next 16 renamed `middleware` → `proxy`).

## Status

Done: foundation, animation engine, shared chrome (nav/footers/cookie/newsletter),
and the **homepage** — verified block-for-block against the mirror (all 16 markers
match) with fonts, videos, and SVGs serving 200 locally.

Remaining: the other 23 routes. They reuse this system; the per-page work is
transcribing block markup, as the homepage does in `app/page.tsx` + `lib/home-content.ts`.
