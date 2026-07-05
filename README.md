# Global Shipping & Logistics (GSL)

Marketing site for **GSL** — a **road-freight-first** logistics company:
trucking (FTL/LTL), cross-border corridors, and last-mile, with ocean and other
modes as complementary services in an integrated door-to-door network.

> 🎬 A **dark-cinematic premium redesign** is underway on `dev` — see
> [ROADMAP.md](./ROADMAP.md) (phases), [PRODUCT.md](./PRODUCT.md) (strategy),
> and [DESIGN.md](./DESIGN.md) (visual system).

## Tech stack

| Concern            | Choice                                    |
| ------------------ | ----------------------------------------- |
| Framework          | Next.js 16 (App Router)                   |
| UI runtime         | React 19                                  |
| Styling            | Tailwind CSS 4 (`@tailwindcss/postcss`)   |
| Animation          | GSAP 3 + `@gsap/react`, ScrollTrigger     |
| Smooth scroll      | Lenis                                     |
| Utilities          | `clsx`, `tailwind-merge` (`cn` in `src/lib/utils.ts`) |
| Language           | TypeScript 5 (strict)                     |
| Fonts              | Geist Sans + Geist Mono (`next/font`)     |

> ⚠️ This project uses a **modified build of Next.js** with breaking changes vs.
> upstream. Before writing framework code, read the relevant guide in
> `node_modules/next/dist/docs/`. See [AGENTS.md](./AGENTS.md).

## Getting started

```bash
npm install
npm run dev      # start dev server → http://localhost:3000
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
```

## Project structure

```
src/
├── app/
│   ├── layout.tsx        # root layout, fonts, metadata
│   ├── page.tsx          # home: loader + section composition
│   └── globals.css       # global styles / design tokens
├── components/
│   ├── ClientLayout.tsx  # Lenis + GSAP setup, Header/Footer/ContactModal shell
│   ├── Header.tsx        # sticky nav + mobile menu
│   ├── Footer.tsx
│   ├── ContactModal.tsx  # ".contact-popup" toggled via .active class
│   └── *Section.tsx      # Hero, Intro, Problem, Solution, Shift, Tech, WhyUs, Partners, Faq
└── lib/
    └── utils.ts          # cn() classname helper
```

## Architecture notes

- **Single-page site.** `page.tsx` composes all sections in order. Nav links in
  `Header.tsx` are in-page anchors (`#about`, `#services`, `#tech`, `#career`,
  `#news`) — some target sections that do not exist yet (see [ROADMAP.md](./ROADMAP.md)).
- **Animation.** `ClientLayout` initializes Lenis smooth scroll and wires it to
  GSAP's ScrollTrigger. Section-level scroll animations use GSAP; respect
  `prefers-reduced-motion` (the loader in `page.tsx` already does).
- **Contact modal** is opened imperatively by adding `.active` to `.contact-popup`.
- **Brand palette:** legacy code uses eco green → blue gradient
  (`--primary`/`--secondary`); the redesign replaces it with the dark
  night-highway OKLCH system in [DESIGN.md](./DESIGN.md).

## Contributing

Work happens on `dev` (or feature branches off `dev`). See [ROADMAP.md](./ROADMAP.md)
for planned work and [AGENTS.md](./AGENTS.md) for framework-specific rules.
