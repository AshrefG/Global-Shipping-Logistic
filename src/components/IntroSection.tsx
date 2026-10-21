"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, SplitText, EASE, DUR, STAGGER, prefersReducedMotion } from "@/lib/gsap"
import TextReveal from "@/components/motion/TextReveal"

/*
  About: a short heading (masked line rise), then the manifesto as a
  statement-size paragraph beside it. No cards, no imagery: the statement
  carries the section. It is the page's one ink-fill statement (motion.md "Ink fill"):
  every word sits at 45% ink and fills to full ink, in reading order, locked
  to the scroll as the statement rises through the viewport. Then the stat
  row: the hairline draws from the left and the four figures arrive one after
  another, each counting up once as it lands.

  Reduced motion / no JS: full ink, final figures, hairline drawn.
*/

const STATS = [
  { value: 1975, label: "Freight roots · UAE" },
  { value: 5, label: "Quality certifications" },
  { value: 9, label: "Industries served" },
  { value: 25, prefix: "−", suffix: "°C", label: "Cold chain floor" },
]

export default function IntroSection() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root || prefersReducedMotion()) return

      /* Ink fill: words, not lines, so the fill sweeps in reading order and
         never depends on where the lines break. Opacity carries both the ink
         and the amber phrases, so the accents keep their colour throughout. */
      const statement = root.querySelector<HTMLElement>("[data-ink]")
      let split: SplitText | undefined
      if (statement) {
        split = SplitText.create(statement, { type: "words" })
        gsap.fromTo(
          split.words,
          { opacity: 0.45 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: {
              trigger: statement,
              start: "top 85%",
              // full ink by the time the statement's foot is two thirds of
              // the way down, so a reader who stops with it centred never
              // sees it pale
              end: "bottom 65%",
              scrub: true,
            },
          },
        )
      }

      /* Stat row: rule draws, figures land left to right, each counting up. */
      const row = root.querySelector<HTMLElement>("[data-stats]")
      if (row) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 85%", toggleActions: "play none none none" },
        })
        tl.fromTo(
          row.querySelector("[data-rule]"),
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: EASE.enterSoft },
          0,
        )
        gsap.utils.toArray<HTMLElement>("[data-stat]", row).forEach((stat, i) => {
          const at = 0.15 + i * STAGGER.item * 1.2
          tl.from(stat, { y: 24, opacity: 0, duration: DUR.reveal, ease: EASE.enter }, at)
          const figure = stat.querySelector("[data-count]")
          if (figure) {
            tl.from(
              figure,
              { textContent: 0, snap: { textContent: 1 }, duration: 1.4, ease: "power2.out" },
              at,
            )
          }
        })
      }

      return () => split?.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="about" className="py-28 md:py-40 bg-canvas">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <TextReveal
            as="h2"
            start="top 85%"
            stagger={0.09}
            className="lg:col-span-5 font-display text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight"
          >
            Rooted in Dubai <span className="text-primary">since 1975.</span>
          </TextReveal>

          {/* Statement: a paragraph at statement size, not a headline */}
          <p
            data-ink
            className="lg:col-span-7 lg:pt-2 text-xl md:text-2xl lg:text-[1.75rem] font-medium text-gray-900 leading-snug tracking-[-0.01em] text-pretty"
          >
            GSL is a third-party logistics company from Dubai, part of the{" "}
            <span className="text-primary">Al Shirawi Group.</span> Freight
            forwarding, customs, transport, cold chain and distribution,{" "}
            <span className="text-primary">door-to-door, tracked live.</span>{" "}
            Our roots run back to 1975, and we&apos;ve been driven by one thing
            ever since: you.
          </p>
        </div>

        <div data-stats className="relative mt-16 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 pt-10">
          <span aria-hidden="true" data-rule className="absolute inset-x-0 top-0 h-px bg-line origin-left" />
          {STATS.map((s) => (
            <div key={s.label} data-stat>
              <div className="font-mono text-3xl md:text-4xl font-bold text-white">
                {s.prefix}
                <span data-count className="tabular-nums">{s.value}</span>
                {s.suffix}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.13em] text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
