"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger, EASE, DUR, STAGGER } from "@/lib/gsap"
import TextReveal from "@/components/motion/TextReveal"
import { useMagnetic } from "@/components/motion/useMagnetic"

/*
  Why us: numbers lead, reasons follow. Counters, not cards.

  Motion (no-preference only; the markup holds the final values):
  - The four figures count up once, one after another, each settling hard
    (expo out) so the sequence reads left to right, top to bottom.
  - The reason rows arrive row by row once the figures are under way.
  - The CTA leans toward the pointer (magnetic) and gives on press.
*/

const NUMBERS = [
  { value: 50, suffix: "y", label: "In freight, since 1975" },
  { value: 2, suffix: "", label: "Dubai campuses (DIP-1 + DIC)" },
  { value: 5, suffix: "×", label: "Certified · LRQA / UKAS" },
  { value: 9, suffix: "", label: "Industries served" },
]

const REASONS = [
  {
    title: "Part of Al Shirawi Group",
    desc: "Half a century of industrial backbone behind every commitment: the stability of one of the UAE's largest business groups, the pace of a 3PL.",
  },
  {
    title: "Asset-backed, not a broker",
    desc: "Our warehouses, our fleet, our people. When we quote an ETA or a temperature, we control every link that delivers it.",
  },
  {
    title: "Certified, audited, renewed",
    desc: "ISO 9001, 14001, 22000, 45001 and BRCGS: externally audited every year. Quality here is a maintained system, not a plaque.",
  },
]

/** Seconds between one figure starting to count and the next */
const COUNT_STEP = 0.32
const COUNT_DUR = 1.1

export default function WhyUsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const ctaRef = useMagnetic<HTMLSpanElement>(6)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return
      const mm = gsap.matchMedia()

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          /* ---------- Lead copy and CTA follow the heading ---------- */
          const intro = gsap.utils.toArray<HTMLElement>(".why-intro", section)
          gsap.from(intro, {
            y: 20,
            opacity: 0,
            duration: DUR.reveal,
            ease: EASE.enter,
            stagger: STAGGER.item,
            delay: 0.18,
            scrollTrigger: { trigger: intro[0], start: "top 85%", toggleActions: "play none none none" },
          })

          /* ---------- Figures: count up in sequence, once ---------- */
          const grid = section.querySelector<HTMLElement>(".why-numbers")
          const stats = gsap.utils.toArray<HTMLElement>(".why-stat", section)
          const figures = gsap.utils.toArray<HTMLElement>(".why-num", section)
          if (!grid) return

          const counts = gsap.timeline({ paused: true })
          stats.forEach((stat, i) => {
            const el = figures[i]
            const to = NUMBERS[i].value
            const n = { v: 0 }
            const at = i * COUNT_STEP
            counts
              .fromTo(stat, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.reveal, ease: EASE.enter }, at)
              .fromTo(
                n,
                { v: 0 },
                {
                  v: to,
                  duration: COUNT_DUR,
                  ease: EASE.enter,
                  onUpdate: () => {
                    el.textContent = String(Math.round(n.v))
                  },
                  onComplete: () => {
                    el.textContent = String(to)
                  },
                },
                at,
              )
          })
          // Cue for the reason rows: the last figure has started counting
          counts.addLabel("reasons", (stats.length - 1) * COUNT_STEP + 0.15)

          ScrollTrigger.create({
            trigger: grid,
            start: "top 85%",
            once: true,
            onEnter: () => counts.play(),
            onLeave: () => counts.progress(1),
          })

          /* ---------- Reasons: row by row, after the figures ---------- */
          const rows = gsap.utils.toArray<HTMLElement>(".why-row", section)
          gsap.set(rows, { y: 28, opacity: 0 })
          const arrive = (batch: Element[]) => {
            // On desktop the rows enter while the figures count; hold them
            // until the last figure is under way. On a phone they enter later.
            const cue = counts.labels.reasons
            const wait = counts.progress() === 1 ? 0 : Math.max(0, cue - counts.time())
            gsap.to(batch, {
              y: 0,
              opacity: 1,
              duration: DUR.reveal,
              ease: EASE.enter,
              stagger: 0.09,
              delay: wait,
              overwrite: true,
            })
          }
          ScrollTrigger.batch(rows, { start: "top 88%", once: true, onEnter: arrive, onLeave: arrive })

          return () => {
            figures.forEach((el, i) => (el.textContent = String(NUMBERS[i].value)))
          }
        },
        section,
      )
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <TextReveal
              as="h2"
              start="top 80%"
              className="font-display text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-6 text-balance"
            >
              Why shippers <span className="text-primary">switch to GSL.</span>
            </TextReveal>
            <p className="why-intro text-gray-600 text-lg max-w-md mb-10">
              Not another forwarder with a portal. An operator that owns the
              road it sells.
            </p>
            {/* Magnetic wrapper carries the lean; the button keeps its own
                hover and gets press feedback, so the transforms never fight. */}
            <span ref={ctaRef} className="why-intro inline-block">
              <a
                href="#contact"
                className="btn btn-pri btn-lg inline-flex motion-safe:active:scale-[0.97]"
                style={{
                  transition:
                    "background-color var(--t-hover) ease, color var(--t-hover) ease, box-shadow var(--t-hover) ease, transform var(--t-ui) var(--ease-quint), scale var(--t-press) var(--ease-quint)",
                }}
                data-popup="contact"
              >
                Let&apos;s discuss today
              </a>
            </span>
          </div>

          <div className="lg:col-span-7">
            {/* Numbers */}
            <div className="why-numbers grid grid-cols-2 gap-x-8 gap-y-10 mb-14">
              {NUMBERS.map((n) => (
                <div key={n.label} className="why-stat">
                  <div className="font-mono text-4xl md:text-5xl font-bold text-white tabular-nums">
                    <span className="why-num">{n.value}</span>
                    {n.suffix && <span className="text-ink-muted">{n.suffix}</span>}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.13em] text-gray-500">{n.label}</div>
                </div>
              ))}
            </div>

            {/* Reasons */}
            <div>
              {REASONS.map((r) => (
                <div key={r.title} className="why-row py-6 border-t border-line last:border-b">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{r.title}</h3>
                  <p className="text-gray-600 leading-relaxed max-w-xl">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
