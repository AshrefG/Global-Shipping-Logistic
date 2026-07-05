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

## Phase 3 — Section rebuilds (branch per section)

Each section reimagined in the new system — varied rhythm, no uniform card grids.

- ⚪ **Intro/About** (`#about`) — manifesto: large text, per-line scrub reveal.
- ⚪ **Problem** — the old-freight pain, dark stat band with mono CountUps.
- ⚪ **Services** (`#services`) — sticky-stacked panels: FTL, LTL, cross-border,
  last-mile, warehousing (+ ocean as complementary mode).
- ⚪ **Tech** — telematics: live-tracking map with animated dashed routes,
  mono data readouts.
- ⚪ **Why us** — fleet numbers, emission savings; counters, not cards.
- ⚪ **Partners** — velocity-skew marquee, monochrome logos, amber on hover.
- ⚪ **FAQ** — refined accordion, hairline dividers, smooth height.
- ⚪ **Career** (`#career`) — NEW real section: open roles + CTA (replaces
  interim footer target).
- ⚪ **News & Media** (`#news`) — NEW real section: press/blog teasers
  (replaces interim footer target).
- ⚪ **Footer** — premium CTA band in new system.

## Phase 4 — Polish & production (branch: `feat/polish`)

- ⚪ **Contact form wired** — API route, validation, success/error states,
  focus trap in modal.
- ⚪ **Reduced-motion & a11y audit** — full coverage sweep, keyboard nav,
  contrast verification against DESIGN.md tokens.
- ⚪ **Performance budget** — code-split three.js, image optimization,
  Lighthouse ≥90 perf on mid-range mobile; kill jank on pinned scenes.
- ⚪ **SEO/metadata** — road-freight keywords, OG image in new brand, sitemap.
- ⚪ **Responsive QA** — pinned scenes degrade gracefully on mobile
  (shorter scrub distances or stacked fallbacks).
- ⚪ **Legal / Privacy** (`#legal`, `#privacy`) — real targets.

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
