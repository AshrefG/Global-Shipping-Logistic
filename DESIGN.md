# Design

> Seed direction for the **dark-cinematic premium redesign** (see ROADMAP.md).
> The current shipped code still uses the legacy light green/blue eco-maritime
> system; new work follows THIS document. Re-run `/impeccable document` after
> the redesign lands to capture real tokens.

## Theme

**Night highway.** Near-black asphalt world with cool ink undertones; warm
amber light is the only color voice — headlights, route arcs, live-status
indicators. Depth comes from layered darkness (surface elevation, glow,
grain), not from borders. Color strategy: **committed** — the dark surface IS
the brand; amber accent stays ≤10% of any viewport.

## Color palette (OKLCH)

| Token          | Value                    | Role                                    |
| -------------- | ------------------------ | --------------------------------------- |
| `--bg`         | `oklch(0.14 0.01 255)`   | Body — night asphalt                    |
| `--bg-deep`    | `oklch(0.10 0.01 255)`   | Hero / cinematic sections               |
| `--surface`    | `oklch(0.19 0.012 255)`  | Elevated panels, cards (rare)           |
| `--surface-2`  | `oklch(0.23 0.014 255)`  | Hover / second elevation                |
| `--ink`        | `oklch(0.965 0.004 90)`  | Primary text — warm white               |
| `--ink-muted`  | `oklch(0.74 0.012 255)`  | Secondary text (≥4.5:1 on `--bg`)       |
| `--accent`     | `oklch(0.78 0.15 75)`    | Amber — CTAs, arcs, live dots           |
| `--accent-hot` | `oklch(0.70 0.18 55)`    | Hover / pressed amber                   |
| `--line`       | `oklch(0.32 0.01 255)`   | Hairline dividers, lane markings        |

Light context (modal internals, rare inverted bands): invert to
`oklch(0.97 0.004 90)` bg with `oklch(0.17 0.01 255)` ink — never cream.

## Typography

- **Display:** `Archivo` (variable — weight 600–900, width 110–125 expanded).
  Highway-signage DNA: wide, heavy, engineered. Headlines set tight
  (`-0.03em`), `clamp()` max ≤ 6rem, `text-wrap: balance`.
- **Body/UI:** `Geist Sans` (already loaded). 65–75ch measure, `text-wrap: pretty`.
- **Data:** `Geist Mono` for telemetry voice — route codes (`TUN–HAM · E45`),
  coordinates, timestamps, counters. This is the brand's precision signature.
- Hierarchy through weight + width contrast, never gradient text.

## Iconography & motifs

- Hairline stroke icons (1.5px), no filled blobs.
- **Road motifs:** dashed lane-marking dividers, route lines (DrawSVG),
  chevrons, container-door ribs as section-transition masks.
- Grain: subtle film-grain overlay on cinematic sections (opacity ≤ 0.05).

## Motion system

- **Easing:** `expo.out` / `power4.out` for entrances; `power2.inOut` for
  scrubbed/pinned travel. No bounce, no elastic — freight has mass.
- **Primitives:** SplitText line reveals (masked, 0.04s stagger), DrawSVG
  route lines, MorphSVG vehicle morphs, Flip container expansions, clip-path
  "container-door" section wipes, parallax layers at ≤0.15 speed delta.
- **Scroll:** Lenis (installed) + ScrollTrigger; pinned scenes scrub — never
  autoplay long sequences on entry.
- **Reduced motion:** every effect declares its fallback at build time
  (crossfade or static composition). Pinned scenes unpin to stacked layout.

## Components

- **Buttons:** pill, amber fill (`--accent`) with ink text for primary;
  hairline `--line` ghost for secondary. Magnetic hover (±6px) desktop only.
- **Nav:** transparent over hero → `--bg`/blur after scroll; amber active dot.
- **Cards:** avoided by default; when needed — `--surface`, 1px `--line`
  border, no shadows-as-decoration, never nested.
- **Stat counters:** Geist Mono, count-up on enter, unit in `--ink-muted`.
- **Modal/forms:** underline inputs on dark, amber focus border, visible
  focus rings `2px --accent` offset 2px.

## Layout

- Max content width 1280px (`max-w-7xl`), full-bleed for cinematic scenes.
- Section rhythm varies: tight data bands (py-16) vs. wide cinematic scenes
  (min-h-screen pinned) — no uniform py-24 drumbeat.
- Z-scale: `--z-nav: 100`, `--z-overlay: 200`, `--z-modal: 300`,
  `--z-loader: 400`. No arbitrary 9999.
