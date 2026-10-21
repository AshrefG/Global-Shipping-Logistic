"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, SplitText, ScrollTrigger, EASE, DUR, STAGGER } from "@/lib/gsap"

/*
  Quality & certifications band: slim trust strip in the telemetry voice.
  LRQA-audited, UKAS-accredited: the five marks GSL holds as a 3PL.

  Motion (no-preference only): a quiet arrival for a quiet stretch. The
  audit label settles first, the statement rises line by line from its mask,
  then the five chips follow left to right. No seam on either side, so it
  plays once at the normal reveal line.
*/

const CERTS = [
  { code: "ISO 9001", scope: "Quality" },
  { code: "ISO 14001", scope: "Environment" },
  { code: "ISO 22000", scope: "Food safety" },
  { code: "ISO 45001", scope: "Health & safety" },
  { code: "BRCGS", scope: "Storage & distribution" },
]

export default function CertBand() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return
      const mm = gsap.matchMedia()

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const label = section.querySelector<HTMLElement>(".cert-label")
          const line = section.querySelector<HTMLElement>(".cert-line")
          const chips = gsap.utils.toArray<HTMLElement>(".cert-chip", section)
          if (!label || !line) return

          // Hidden states exist only once this runs; nothing is hidden by CSS
          gsap.set(label, { y: 12, opacity: 0 })
          gsap.set(line, { opacity: 0 })
          gsap.set(chips, { y: 16, opacity: 0 })

          let split: SplitText | null = null
          let tl: gsap.core.Timeline | null = null
          const arrive = () => {
            if (tl) return
            // Split at arrival time so the lines follow the loaded font and
            // current width; given back as plain text afterwards.
            split = SplitText.create(line, { type: "lines", mask: "lines" })
            gsap.set(line, { opacity: 1 })
            tl = gsap
              .timeline({ onComplete: () => split?.revert() })
              .to(label, { y: 0, opacity: 1, duration: 0.7, ease: EASE.enterSoft }, 0)
              .from(split.lines, { yPercent: 110, duration: DUR.reveal, ease: EASE.enter, stagger: STAGGER.line }, 0.12)
              .to(chips, { y: 0, opacity: 1, duration: 0.7, ease: EASE.enter, stagger: STAGGER.item }, 0.38)
          }

          ScrollTrigger.create({
            trigger: section,
            start: "top 85%",
            once: true,
            onEnter: arrive,
            onLeave: () => {
              arrive()
              tl?.progress(1)
            },
          })

          return () => {
            tl?.kill()
            split?.revert()
          }
        },
        section,
      )
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} aria-label="Quality certifications" className="bg-canvas border-y border-line">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4">
            <div className="cert-label font-mono text-xs tracking-[0.18em] text-gray-500 mb-3">
              LRQA AUDITED · UKAS ACCREDITED
            </div>
            <p className="cert-line text-lg md:text-xl font-semibold text-gray-900 leading-snug text-balance">
              The region&apos;s only 3PL certified across{" "}
              <span className="text-primary">all five.</span>
            </p>
          </div>

          <div className="lg:col-span-8 flex flex-wrap gap-3">
            {CERTS.map((c) => (
              <div
                key={c.code}
                className="cert-chip group flex items-baseline gap-2.5 px-4 py-3 rounded-xl border border-line bg-surface transition-colors duration-[var(--t-hover)] hover:border-primary/40"
              >
                <span className="font-mono text-sm font-semibold text-white whitespace-nowrap transition-colors duration-[var(--t-hover)] group-hover:text-primary">
                  {c.code}
                </span>
                <span className="text-xs text-gray-500 whitespace-nowrap">{c.scope}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
