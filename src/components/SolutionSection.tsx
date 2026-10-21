"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, SplitText, EASE, DUR, STAGGER } from "@/lib/gsap"

/*
  Services: sticky-stacked panels.
  Each service is a full-width dark panel that sticks under the header while
  the next slides over it, like containers being stacked. On lg+ with motion
  allowed, the covered panel recedes (scale 0.94) and dims, scrubbed to the
  next panel's approach. Panel parts arrive in reading order as each panel
  comes up. Below lg and under reduced motion: plain stacked panels, no
  sticky, no scaling, everything visible (the markup is the finished state).
*/

const SERVICES = [
  {
    code: "SVC-01",
    name: "International Freight",
    tag: "FRT",
    desc: "Air, sea and land freight forwarding on the lanes your supply chain lives on. Roots in the business since 1975, one accountable partner end to end.",
    specs: ["Air · Sea · Land", "Since 1975", "Door-to-door plans"],
  },
  {
    code: "SVC-02",
    name: "Customs Clearance",
    tag: "CCL",
    desc: "Documentation filed ahead of arrival so cargo rolls through instead of waiting. Import, export and transit handled by our in-house team.",
    specs: ["Import / Export / Transit", "Pre-arrival filing", "In-house brokers"],
  },
  {
    code: "SVC-03",
    name: "Port Haulage & Transport",
    tag: "PHL",
    desc: "Container haulage from Jebel Ali and Dubai's ports to anywhere in the UAE and across GCC borders, live-tracked every kilometre.",
    specs: ["Jebel Ali daily", "GCC cross-border", "Live GPS fleet"],
  },
  {
    code: "SVC-04",
    name: "Cold Chain Warehousing",
    tag: "CCW",
    desc: "Ambient to frozen under one roof: cool, chilled and frozen chambers with continuous SCADA temperature and humidity monitoring, WMS-driven, BRCGS certified.",
    specs: ["AMBIENT · +15…+25°C · 0…−25°C", "SCADA 24/7 monitoring", "BRCGS + ISO 22000", "WMS + customer portal"],
  },
  {
    code: "SVC-05",
    name: "Distribution",
    tag: "DST",
    desc: "Scheduled and on-demand delivery across the Emirates: retail, HORECA and healthcare drops with e-POD, straight into your ERP.",
    specs: ["UAE-wide network", "e-POD + photos", "Retail / HORECA / Pharma"],
  },
  {
    code: "SVC-06",
    name: "Value Added Services",
    tag: "VAS",
    desc: "Everything between the pallet and the shelf: labelling, kitting, repacking, quality inspection and returns, all done inside the warehouse, not in transit.",
    specs: ["Labelling + kitting", "Repacking + QC", "Returns handling"],
  },
  {
    code: "SVC-07",
    name: "Stocktaking & Merchandising",
    tag: "S&M",
    desc: "Counted, audited, shelf-ready. In-store merchandising and cyclical stocktakes that keep your inventory truth in sync with your system.",
    specs: ["Cyclical counts", "In-store teams", "BI reporting"],
  },
]

/** Sticky line of the first panel (clears the fixed header) and the step between panels. */
const STICK_TOP = 92
const STICK_STEP = 26
/** How far a covered panel recedes. */
const DEPTH_SCALE = 0.94
const DEPTH_DIM = 0.55

export default function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const head = section.querySelector<HTMLElement>("[data-svc-head]")
      const title = section.querySelector<HTMLElement>("[data-svc-title]")
      const lede = section.querySelector<HTMLElement>("[data-svc-lede]")
      const stack = section.querySelector<HTMLElement>("[data-svc-stack]")
      const panels = gsap.utils.toArray<HTMLElement>("[data-svc-panel]", section)
      if (!head || !title || !lede || !stack || !panels.length) return

      // Where each panel sits in the stack's normal flow. Measured from the
      // (never sticky) stack and offsetHeight, so triggers stay correct even
      // when ScrollTrigger refreshes while panels are stuck or scaled.
      const gap = () => parseFloat(getComputedStyle(stack).rowGap) || 0
      const flowTop = (i: number) => {
        let y = 0
        for (let k = 0; k < i; k++) y += panels[k].offsetHeight + gap()
        return y
      }

      const mm = gsap.matchMedia()

      // Entrances: any width, motion allowed
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Heading: line mask once the container doors have rolled up, then the sentence
        const split = SplitText.create(title, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.9,
              ease: EASE.enter,
              stagger: STAGGER.line,
              scrollTrigger: { trigger: head, start: "top 60%", toggleActions: "play none none none" },
            }),
        })

        gsap.from(lede, {
          y: 20,
          opacity: 0,
          duration: DUR.reveal,
          ease: EASE.enter,
          delay: 0.3,
          scrollTrigger: { trigger: head, start: "top 60%", toggleActions: "play none none none" },
        })

        // 3. Panel parts in reading order: code + tag, title, text, then the spec chips
        panels.forEach((panel, i) => {
          const parts = panel.querySelectorAll("[data-svc-part]")
          const chips = panel.querySelectorAll("[data-svc-chip]")
          gsap
            .timeline({
              scrollTrigger: {
                trigger: stack,
                // the first panel waits for the heading above it; the rest arrive as they rise into view
                start: () => `top+=${flowTop(i)} ${i === 0 ? 78 : 88}%`,
                toggleActions: "play none none none",
              },
            })
            .from(parts, { y: 20, opacity: 0, duration: 0.75, ease: EASE.enter, stagger: 0.08 })
            .from(chips, { y: 12, opacity: 0, duration: 0.6, ease: EASE.enter, stagger: 0.06 }, 0.22)
        })

        return () => split.revert()
      })

      // 2. Stack depth: lg+, motion allowed. Each covered panel recedes while
      // the next one slides over it, locked to scroll. The last never shrinks.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        panels.slice(0, -1).forEach((panel, i) => {
          const shade = panel.querySelector("[data-svc-shade]")
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: stack,
                // from the moment this panel sticks (next one starts covering it)...
                start: () =>
                  `top+=${flowTop(i + 1)} ${Math.min(
                    window.innerHeight,
                    STICK_TOP + i * STICK_STEP + panel.offsetHeight + gap(),
                  )}px`,
                // ...until the next panel lands on its own sticky line
                end: () => `top+=${flowTop(i + 1)} ${STICK_TOP + (i + 1) * STICK_STEP}px`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(panel, { scale: 1 }, { scale: DEPTH_SCALE, transformOrigin: "50% 0%" }, 0)
            .fromTo(shade, { opacity: 0 }, { opacity: DEPTH_DIM }, 0)
        })
      })

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} id="services" className="py-24 md:py-32 bg-canvas">
      <div className="max-w-7xl mx-auto px-6">
        <div data-svc-head className="mb-16 max-w-3xl">
          <h2
            data-svc-title
            className="font-display text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight"
          >
            One partner, <span className="text-primary">every lane.</span>
          </h2>
          <p data-svc-lede className="mt-5 text-lg text-gray-600 max-w-xl">
            Seven services, one 3PL, one accountable team, from the port
            gate to the shop shelf, ambient to −25°C.
          </p>
        </div>

        {/* Sticky stack */}
        <div data-svc-stack className="flex flex-col gap-6">
          {SERVICES.map((s, i) => (
            <div
              key={s.code}
              data-svc-panel
              // top applies only while sticky: on a relative (static) panel it
              // would push the card down and under the next section
              className="relative lg:motion-safe:sticky lg:motion-safe:top-(--stick-top) rounded-2xl border border-line bg-surface p-8 md:p-12 lg:motion-safe:shadow-[0_-18px_50px_rgba(0,0,0,0.45)]"
              style={{ "--stick-top": `${STICK_TOP + i * STICK_STEP}px` } as React.CSSProperties}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                <div data-svc-part className="lg:col-span-2 flex lg:flex-col items-center lg:items-start gap-3">
                  <span className="font-mono text-xs tracking-[0.2em] text-gray-400">{s.code}</span>
                  <span className="font-display text-2xl font-extrabold text-primary">{s.tag}</span>
                </div>
                <div className="lg:col-span-6">
                  <h3 data-svc-part className="font-display text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-4">
                    {s.name}
                  </h3>
                  <p data-svc-part className="text-gray-600 leading-relaxed max-w-lg">{s.desc}</p>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-2.5">
                  {s.specs.map((spec) => (
                    <div
                      key={spec}
                      data-svc-chip
                      className="inline-flex self-start px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 font-mono text-xs text-white/70"
                    >
                      {spec}
                    </div>
                  ))}
                </div>
              </div>
              {/* Depth shade: darkens a panel as the next one covers it (GSAP, lg+ only) */}
              <div
                data-svc-shade
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit] bg-dark opacity-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
