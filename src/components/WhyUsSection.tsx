"use client"

import { useEffect, useRef } from "react"
import { gsap, prefersReducedMotion } from "@/lib/gsap"
import CountUp from "@/components/motion/CountUp"

/*
  Why us — numbers lead, reasons follow (Phase 3). Counters, not cards.
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
    desc: "Half a century of industrial backbone behind every commitment — the stability of one of the UAE's largest business groups, the pace of a 3PL.",
  },
  {
    title: "Asset-backed, not a broker",
    desc: "Our warehouses, our fleet, our people. When we quote an ETA or a temperature, we control every link that delivers it.",
  },
  {
    title: "Certified, audited, renewed",
    desc: "ISO 9001, 14001, 22000, 45001 and BRCGS — externally audited every year. Quality here is a maintained system, not a plaque.",
  },
]

export default function WhyUsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(".why-row", {
        y: 32,
        opacity: 0,
        duration: 0.7,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
              Why shippers <span className="text-primary">switch to GSL.</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-md mb-10">
              Not another forwarder with a portal — an operator that owns the
              road it sells.
            </p>
            <a href="#contact" className="btn btn-pri btn-lg inline-flex" data-popup="contact">
              Let&apos;s discuss today
            </a>
          </div>

          <div className="lg:col-span-7">
            {/* Numbers */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 mb-14">
              {NUMBERS.map((n) => (
                <div key={n.label} className="why-row">
                  <div className="font-mono text-4xl md:text-5xl font-bold text-white">
                    <CountUp value={n.value} suffix={n.suffix} />
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
