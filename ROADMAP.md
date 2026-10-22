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

- 🟢 **Token swap** — replace legacy green/blue light theme in `globals.css` with
  the DESIGN.md dark OKLCH system (`--bg`, `--surface`, `--ink`, `--accent`…).
- 🟢 **Typography** — add `Archivo` (variable wght/wdth) display face via
  `next/font`; keep Geist Sans body + Geist Mono data voice.
- 🟢 **GSAP plugin setup** — GSAP ≥3.13 ships ALL former Club plugins free:
  register `ScrollTrigger`, `MorphSVGPlugin`, `DrawSVGPlugin`, `SplitText`,
  `Flip` once in a central `src/lib/gsap.ts`; export a `useGsap` helper +
  shared `prefersReducedMotion()` guard.
- 🟢 **Motion primitives** (`src/components/motion/`) — reusable:
  `TextReveal` (SplitText masked lines), `ContainerWipe` (roller-door
  section seam), `LaneSeam` (lane-marking section seam), `RouteLine`
  (DrawSVG), `CountUp`, `useMagnetic`. Shared tokens and the loader
  handoff (`DUR`, `STAGGER`, `onLoaderDone`) live in `src/lib/gsap.ts`.
- 🟢 **Content pivot: maritime → road-first** — rewrite loader copy, hero,
  and section copy around trucking (FTL/LTL, cross-border corridors,
  last-mile); ocean demoted to complementary mode. Swap ship SVGs → trucks.

## Phase 1 — Hero act (branch: `feat/hero-globe`)

The first-impression scene: loader → gate-wipe → hero with globe.

- 🟢 **3D rotating globe** — `three` + `@react-three/fiber` + `@react-three/drei`:
  dark sphere, dotted landmass, amber arcs animating along freight corridors
  (e.g. Tunis–Hamburg, Rotterdam–Milan), slow idle rotation, pointer parallax.
  Dynamically imported (`next/dynamic`, no SSR), DPR clamped, static-frame
  fallback for reduced-motion/low-power.
- 🟢 **Cinematic preloader v2** — restyle to dark system: Geist Mono counter,
  road-marking progress bar, copy pivoted to road freight; exit = container-door
  wipe revealing the hero (reuse `ContainerWipe`).
- 🟢 **Hero** — Archivo expanded display headline with SplitText reveal,
  headlight-streak ambient glow, mono route-ticker strip (live-feel lane codes),
  magnetic amber CTA.

## Phase 2 — Scroll choreography (branch: `feat/section-transitions`)

The "trip along the corridor" — complex ScrollTrigger work.

- 🟢 **Truck morph centerpiece** — rebuild `ShiftSection` as the brand story:
  MorphSVG scrub-morphs a cargo container → truck silhouette (the shift to
  road), synced with copy beats; DrawSVG route line threads the scene.
- 🟢 **Pinned journey section** — horizontal-scrub scene through the logistics
  chain (pickup → linehaul → border → hub → delivery): the truck drives in
  from the Shift, the amber lane line is locked to its bumper and lights each
  stop it reaches, it parks on Delivery, then drives out of the frame.
- 🟡 **Container transitions** — 🟢 seams between sections (roller doors,
  lane markings, Shift container doors, receding hero, curtain footer; the
  map is the comment in `page.tsx`). ⚪ Flip-powered media expansions
  (thumbnail → full-bleed) not started.
- 🟢 **Depth pass** — layered parallax (≤0.15 speed delta), film grain on
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
- 🟢 **Footer** — "Driven by You." close (letter rise, amber full-stop
  flash) with the contact CTA; curtain reveal on desktop.

## Phase 4 — Polish & production (branch: `feat/phase4-polish`)

- 🟢 **Contact form wired** — `/api/contact` route with field validation
  (422 + per-field errors), sending/success/error states, focus trap,
  Escape close, focus restore. TODO: hand off to an email provider via env.
- 🟢 **News hover preview** — one frame anchored to the hovered row
  (replaced the cursor image trail; fine-pointer desktop only, off under
  reduced motion). Real GSL photos still needed.
- 🟢 **SEO/metadata** — OG/Twitter cards, keywords, canonical,
  `sitemap.ts`, `robots.ts` (API disallowed). OG image: see backlog `/og`.
- 🟢 **Legal / Privacy** (`#legal`, `#privacy`) — real footer targets with
  notice + GDPR summary.
- 🟢 **Reduced-motion & a11y audit** — finished static states under reduced
  motion, skip link, focus moves with nav jumps, header-safe scroll padding,
  focused controls never left hidden by a reveal, contrast on small labels.
- ⚪ **Performance budget** — Lighthouse ≥90 on mid-range mobile; three.js
  already code-split/lazy.
- 🟡 **Responsive QA** — browser pass at 390 / 768 / 1366 / 1440 done (stacked
  fallbacks, no horizontal overflow, breakpoint flips keep scroll position).
  Real-device check (iOS Safari, Android) still open.

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
