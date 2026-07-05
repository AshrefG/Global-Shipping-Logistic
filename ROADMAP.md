# GSL Roadmap

Status legend: 🟢 done · 🟡 in progress · ⚪ planned

## Now — close the gaps in the current landing page

Nav links in `Header.tsx` point to anchors that have no matching content yet.
Either build the sections or make the links resolve.

- ⚪ **About us** (`#about`) — company story / mission section or `/about` page.
- ⚪ **Services** (`#services`) — freight offerings; anchor an existing section or add one.
- ⚪ **Career** (`#career`) — open roles + application CTA.
- ⚪ **News & Media** (`#news`) — press / blog index.
- ⚪ Ensure every nav anchor scrolls to a real target (add `id`s to sections).

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
