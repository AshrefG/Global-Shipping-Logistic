"use client"

import { useEffect, useRef } from "react"
import { gsap, prefersReducedMotion } from "@/lib/gsap"

/*
  Quality & certifications band — slim trust strip in the telemetry voice.
  LRQA-audited, UKAS-accredited: the five marks GSL holds as a 3PL.
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

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(".cert-chip", {
        y: 18,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} aria-label="Quality certifications" className="bg-canvas border-y border-line">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4">
            <div className="font-mono text-xs tracking-[0.18em] text-gray-500 mb-3">
              LRQA AUDITED · UKAS ACCREDITED
            </div>
            <p className="text-lg md:text-xl font-semibold text-gray-900 leading-snug text-balance">
              The region&apos;s only 3PL certified across{" "}
              <span className="text-primary">all five.</span>
            </p>
          </div>

          <div className="lg:col-span-8 flex flex-wrap gap-3">
            {CERTS.map((c) => (
              <div
                key={c.code}
                className="cert-chip group flex items-baseline gap-2.5 px-4 py-3 rounded-xl border border-line bg-surface hover:border-primary/40 transition-colors"
              >
                <span className="font-mono text-sm font-semibold text-white group-hover:text-primary transition-colors whitespace-nowrap">
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
