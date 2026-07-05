<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project context

**Global Shipping & Logistics (GSL)** — marketing site for a **road-freight-first**
logistics company (trucking/FTL/LTL, cross-border corridors, last-mile; ocean as a
complementary mode). A dark-cinematic premium redesign is in progress on `dev`:
strategy in `PRODUCT.md`, visual system in `DESIGN.md`, phases in `ROADMAP.md` —
read all three before UI work. New UI must follow DESIGN.md (dark OKLCH tokens,
amber accent, Archivo display + Geist), not the legacy green/blue theme.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind CSS 4 ·
GSAP 3 + ScrollTrigger · Lenis smooth scroll.

## Conventions
- Components live in `src/components/`. Page sections are named `*Section.tsx` and
  composed, in order, inside `src/app/page.tsx`.
- Use the `cn()` helper (`src/lib/utils.ts`) for conditional classNames.
- Interactive/animated components are Client Components (`"use client"`). Lenis +
  ScrollTrigger are set up once in `ClientLayout.tsx` — reuse it, don't re-init.
- Always guard animations behind `prefers-reduced-motion` (see the loader in
  `page.tsx` for the pattern).
- Path alias: `@/*` → `src/*`.
- The contact modal is opened by adding the `.active` class to `.contact-popup`.

## Workflow
- Branch off `dev` for feature work; keep `main` releasable.
- Planned work is tracked in `ROADMAP.md`.
- Run `npm run lint` before committing.
