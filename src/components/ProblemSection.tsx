"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger, SplitText, EASE, DUR, STAGGER, prefersReducedMotion } from "@/lib/gsap"
import { cn } from "@/lib/utils"

/*
  Problem: the pain of legacy road freight.
  Typographic pain rows with hairline dividers + a dark stat band in the
  mono telemetry voice. No image grid, no identical cards.

  Choreography (enters under the Intro -> Problem lane seam):
  - Heading: masked line rise, held back until the lane marking has painted
    (top 60%); the grey second sentence follows a beat later.
  - Stat band: opens left to right with a clip-path, like the lane it sits
    on, and its four figures count up in sequence as the opening passes them.
  - Pain rows: arrive row by row; each row's hairline draws left to right,
    then the title, the text and the FAULT code.

  Reduced motion / no JS: everything renders in its finished state.
*/

const PAINS = [
  {
    title: "Black-hole tracking",
    desc: "“Where is my truck?” still takes three phone calls and a spreadsheet. Most forwarders go dark between pickup and delivery.",
  },
  {
    title: "Fragmented handoffs",
    desc: "Broker to carrier to subcontractor. Every handoff adds cost, delay and someone else to blame when cargo is late.",
  },
  {
    title: "Empty kilometres",
    desc: "Trucks run partly or fully empty on return legs. You pay for the waste, and so does the climate.",
  },
  {
    title: "Borders on paper",
    desc: "Customs still runs on printed CMRs and waiting bays. A single missing stamp strands a trailer for a day.",
  },
  {
    title: "Rigid schedules",
    desc: "Fixed departures built for the carrier's convenience, not your production line. Just-in-time becomes just-hope.",
  },
]

const STATS = [
  { value: 25, suffix: "%", label: "of truck-km run empty" },
  { value: 43, suffix: "h", label: "avg. dwell lost at borders / mo" },
  { value: 3, suffix: "+", label: "middlemen on a typical load" },
  { value: 70, suffix: "%", label: "of shippers lack live ETA" },
]

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    (_, contextSafe) => {
      const root = sectionRef.current
      if (!root || prefersReducedMotion()) return

      /* Heading: each sentence is its own masked line group. */
      const heading = root.querySelector<HTMLElement>("[data-heading]")
      const splits: SplitText[] = []
      if (heading) {
        gsap.utils.toArray<HTMLElement>("[data-part]", heading).forEach((part, i) => {
          splits.push(
            SplitText.create(part, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 110,
                  duration: 0.9,
                  ease: EASE.enter,
                  stagger: STAGGER.line,
                  delay: i * 0.28,
                  // late on purpose: the lane seam above paints until the
                  // boundary is ~38% down, the heading rises as it finishes
                  scrollTrigger: { trigger: heading, start: "top 60%", toggleActions: "play none none none" },
                }),
            }),
          )
        })
      }

      /* Stat band: clip-path opening, figures counting in sequence. */
      const band = root.querySelector<HTMLElement>("[data-band]")
      if (band) {
        const tl = gsap.timeline({
          // a little later than the usual 85%: the band sits just under the
          // heading and should open after it, not alongside it
          scrollTrigger: { trigger: band, start: "top 78%", toggleActions: "play none none none" },
        })
        tl.fromTo(
          band,
          { clipPath: "inset(0% 100% 0% 0% round 16px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 16px)",
            duration: DUR.open,
            ease: EASE.travel,
            clearProps: "clipPath",
          },
          0,
        )
        gsap.utils.toArray<HTMLElement>("[data-band-stat]", band).forEach((stat, i) => {
          const at = 0.2 + i * 0.2
          const figure = stat.querySelector("[data-count]")
          if (figure) {
            tl.from(
              figure,
              { textContent: 0, snap: { textContent: 1 }, duration: 1.1, ease: "power2.out" },
              at,
            )
          }
          tl.from(
            stat.querySelector("[data-label]"),
            { y: 10, opacity: 0, duration: 0.7, ease: EASE.enter },
            at + 0.1,
          )
        })
      }

      /* Pain rows: hidden parts set now, each row plays as it crosses 85%. */
      const rows = gsap.utils.toArray<HTMLElement>(".problem-row", root)
      if (rows.length) {
        gsap.set(rows.map((r) => r.querySelector("[data-rule]")), { scaleX: 0 })
        gsap.set(
          rows.flatMap((r) => [...r.querySelectorAll("[data-row-part]")]),
          { y: 18, opacity: 0 },
        )
        const play = contextSafe!((batch: Element[]) => {
          batch.forEach((row, i) => {
            const parts = row.querySelectorAll("[data-row-part]")
            gsap
              .timeline({ delay: i * 0.09 })
              .to(row.querySelector("[data-rule]"), {
                scaleX: 1,
                duration: 0.9,
                ease: EASE.enterSoft,
              })
              .to(
                parts,
                {
                  y: 0,
                  opacity: 1,
                  duration: DUR.reveal,
                  ease: EASE.enter,
                  stagger: 0.08,
                  clearProps: "transform,opacity",
                },
                0.1,
              )
          })
        })
        ScrollTrigger.batch(rows, { start: "top 85%", once: true, onEnter: play })
      }

      return () => splits.forEach((s) => s.revert())
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2
          data-heading
          className="font-display text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight max-w-4xl mb-6"
        >
          <span data-part className="block">Freight keeps the Gulf moving.</span>
          <span data-part className="block text-gray-400">Most of it still runs like 1995.</span>
        </h2>

        {/* Stat band: the cost of the status quo */}
        <div data-band className="mt-14 mb-20 rounded-2xl bg-dark border border-line grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} data-band-stat className={cn(
                "px-7 py-8 border-white/5",
                i % 2 === 1 && "border-l",
                i === 2 && "lg:border-l",
                i >= 2 && "border-t lg:border-t-0",
              )}>
              <div className="font-mono text-3xl md:text-4xl font-bold text-primary">
                <span data-count className="tabular-nums">{s.value}</span>
                {s.suffix}
              </div>
              <div data-label className="mt-2 text-xs uppercase tracking-[0.12em] text-white/60 leading-relaxed">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Pain rows */}
        <div>
          {PAINS.map((p, i) => (
            <div
              key={p.title}
              className="problem-row group relative grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 py-8 last:border-b border-line hover:bg-white/[0.015] transition-colors duration-180"
            >
              <span aria-hidden="true" data-rule className="absolute inset-x-0 top-0 h-px bg-line origin-left" />
              <h3
                data-row-part
                className="md:col-span-4 text-xl md:text-2xl font-semibold text-gray-900 group-hover:text-primary transition-colors duration-180"
              >
                {p.title}
              </h3>
              <p data-row-part className="md:col-span-6 text-gray-600 leading-relaxed max-w-xl">
                {p.desc}
              </p>
              <div data-row-part className="hidden md:flex md:col-span-2 items-start justify-end">
                <span className="font-mono text-xs text-gray-400 transition-[color,translate] duration-180 ease-quint group-hover:text-primary group-hover:-translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                  FAULT {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
