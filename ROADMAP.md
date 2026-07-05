# GSL Roadmap

Status legend: 🟢 done · 🟡 in progress · ⚪ planned

## Now — close the gaps in the current landing page

Nav links in `Header.tsx` point to anchors that have no matching content yet.
Either build the sections or make the links resolve.

- 🟢 **Nav anchors resolve** — all `Header` links scroll to a real target via Lenis
  smooth-scroll with a fixed-header offset (`ClientLayout.tsx`). `#about`→Intro,
  `#services`→Solution, `#tech`→Tech; `#news`/`#career` land on the Footer as an
  **interim** target until dedicated sections exist.
- ⚪ **About us** (`#about`) — dedicated company story / mission section (currently reuses Intro).
- ⚪ **Services** (`#services`) — expand the Solution section into a full services offering.
- ⚪ **Career** (`#career`) — open roles + application CTA (interim: Footer).
- ⚪ **News & Media** (`#news`) — press / blog index (interim: Footer newsletter).
- ⚪ **Legal / Privacy** (`#legal`, `#privacy`) — Footer links still have no target.

## Next — wire up the shell

- ⚪ **Contact form** — `ContactModal` currently toggles via `.active`; connect
  submission to an email/API route and add validation + success/error states.
- ⚪ **Accessibility pass** — focus trap in the modal & mobile nav, keyboard nav,
  reduced-motion coverage across all GSAP section animations.
- ⚪ **SEO/metadata** — per-route metadata, Open Graph image, sitemap, robots.
- ⚪ **Responsive QA** — verify all sections on mobile/tablet breakpoints.

## Later — content & scale

- ⚪ **Blog / News CMS** — MDX or headless CMS for News & Media.
- ⚪ **Multi-page routing** — promote heavy sections to their own routes if content grows.
- ⚪ **i18n** — multi-language support for international shipping audience.
- ⚪ **Analytics & consent** — privacy-respecting analytics + cookie banner.
- ⚪ **Performance budget** — Lighthouse CI, image optimization audit.

## Foundations (cross-cutting)

- ⚪ CI: lint + build check on PRs.
- ⚪ Component/animation testing strategy.
- ⚪ Design tokens documented in `globals.css`.

---

_Update statuses as work lands. Feature branches: `feat/<slug>` off `dev`._
