# GSL Roadmap — Premium Dark-Cinematic Redesign

Direction: **road-freight-first**, night-highway dark cinematic, amber accent.
Strategic context in [PRODUCT.md](./PRODUCT.md) · visual system in [DESIGN.md](./DESIGN.md).

Status legend: 🟢 done · 🟡 in progress · ⚪ planned

## Done

- 🟢 Nav anchors resolve via Lenis smooth-scroll with header offset (`ClientLayout.tsx`).
- 🟢 Project context docs (PRODUCT.md, DESIGN.md, README, AGENTS).

---

## Phase 0 — Foundations (branch: `feat/redesign-foundations`)

Everything later phases build on. No visual wow yet; all leverage.

- ⚪ **Token swap** — replace legacy green/blue light theme in `globals.css` with
  the DESIGN.md dark OKLCH system (`--bg`, `--surface`, `--ink`, `--accent`…).
- ⚪ **Typography** — add `Archivo` (variable wght/wdth) display face via
  `next/font`; keep Geist Sans body + Geist Mono data voice.
- ⚪ **GSAP plugin setup** — GSAP ≥3.13 ships ALL former Club plugins free:
  register `ScrollTrigger`, `MorphSVGPlugin`, `DrawSVGPlugin`, `SplitText`,
  `Flip` once in a central `src/lib/gsap.ts`; export a `useGsap` helper +
  shared `prefersReducedMotion()` guard.
- ⚪ **Motion primitives** (`src/components/motion/`) — reusable:
  `TextReveal` (SplitText masked lines), `ContainerWipe` (clip-path
  container-door section transition), `RouteLine` (DrawSVG), `CountUp`,
  magnetic button hook.
- ⚪ **Content pivot: maritime → road-first** — rewrite loader copy, hero,
  and section copy around trucking (FTL/LTL, cross-border corridors,
  last-mile); ocean demoted to complementary mode. Swap ship SVGs → trucks.

## Phase 1 — Hero act (branch: `feat/hero-globe`)

The first-impression scene: loader → gate-wipe → hero with globe.

- ⚪ **3D rotating globe** — `three` + `@react-three/fiber` + `@react-three/drei`:
  dark sphere, dotted landmass, amber arcs animating along freight corridors
  (e.g. Tunis–Hamburg, Rotterdam–Milan), slow idle rotation, pointer parallax.
  Dynamically imported (`next/dynamic`, no SSR), DPR clamped, static-frame
  fallback for reduced-motion/low-power.
- ⚪ **Cinematic preloader v2** — restyle to dark system: Geist Mono counter,
  road-marking progress bar, copy pivoted to road freight; exit = container-door
  wipe revealing the hero (reuse `ContainerWipe`).
- ⚪ **Hero** — Archivo expanded display headline with SplitText reveal,
  headlight-streak ambient glow, mono route-ticker strip (live-feel lane codes),
  magnetic amber CTA.

## Phase 2 — Scroll choreography (branch: `feat/scroll-journey`)

The "trip along the corridor" — complex ScrollTrigger work.

- ⚪ **Truck morph centerpiece** — rebuild `ShiftSection` as the brand story:
  MorphSVG scrub-morphs a cargo container → truck silhouette (the shift to
  road), synced with copy beats; DrawSVG route line threads the scene.
- ⚪ **Pinned journey section** — horizontal-scrub scene through the logistics
  chain (warehouse → truck → border → hub → door): pinned container, scrubbed
  x-travel, truck driving along a DrawSVG road, waypoints lighting amber.
- ⚪ **Container transitions** — `ContainerWipe` between major sections +
  Flip-powered media expansions (thumbnail → full-bleed).
- ⚪ **Depth pass** — layered parallax (≤0.15 speed delta), film grain on
  cinematic scenes, velocity-reactive skew on marquees.

## Phase 3 — Section rebuilds (branch: `feat/section-rebuilds`)

Each section reimagined in the new system — varied rhythm, no uniform card grids.

- 🟢 **Intro/About** (`#about`) — typographic manifesto with per-line TextReveal
  + mono stat row (founded / corridors / km / on-time).
- 🟢 **Problem** — road-freight pains as hairline rows + dark stat band with
  mono CountUps ("runs like 1995").
- 🟢 **Services** (`#services`) — CSS sticky-stacked panels: FTL, LTL,
  cross-border, last-mile, warehousing, ocean/rail — spec chips per service.
- 🟢 **Tech** — control-tower panel: animated dashed corridors, traveling unit
  dot, mono readouts (speed/ETA/reefer/CO₂) + capability rows.
- 🟢 **Why us** — counters lead (fleet/hubs/km/CO₂), reason rows follow.
- 🟢 **Partners** — velocity-skew marquee (Phase 2).
- 🟢 **FAQ** — road-freight Q&A, accessible button accordion.
- 🟢 **Career** (`#career`) — real section: open roles as mailto rows.
- 🟢 **News & Media** (`#news`) — real section: editorial teaser rows
  (links stubbed until the blog/CMS lands).
- ⚪ **Footer** — premium CTA band refresh (fold into Phase 4 polish).

## Phase 4 — Polish & production (branch: `feat/phase4-polish`)

- 🟢 **Contact form wired** — `/api/contact` route with field validation
  (422 + per-field errors), sending/success/error states, focus trap,
  Escape close, focus restore. TODO: hand off to an email provider via env.
- 🟢 **News image trail** — cursor-trailing images on article hover
  (fine-pointer only, reduced-motion off).
- 🟢 **SEO/metadata** — OG/Twitter cards, keywords, canonical,
  `sitemap.ts`, `robots.ts` (API disallowed). OG image: see backlog `/og`.
- 🟢 **Legal / Privacy** (`#legal`, `#privacy`) — real footer targets with
  notice + GDPR summary.
- ⚪ **Reduced-motion & a11y audit** — final sweep (contrast, keyboard nav
  across all sections); per-component guards already in place.
- ⚪ **Performance budget** — Lighthouse ≥90 on mid-range mobile; three.js
  already code-split/lazy.
- ⚪ **Responsive QA** — device pass on pinned scenes and sticky stack.

## Foundations (cross-cutting)

- ⚪ CI: lint + build on PRs.
- ⚪ `/impeccable critique` after each phase; `polish` before merging to main.

---

## Ideas backlog (suggested, not committed)

- Custom cursor: small mono coordinate readout following pointer on desktop.
- Page-level wipe when jumping nav anchors (mini container transition).
- Ambient audio toggle (low road hum) — muted by default.
- Live "shipments in transit" ticker fed by a mock API route.
- Dark OG-image generator route (`/og`) with route-code typography.

_Workflow: feature branches `feat/<slug>` off `dev`; `dev` → `main` when releasable._
