"use client"

import { useEffect, useRef } from "react"
import { gsap, prefersReducedMotion } from "@/lib/gsap"
import CountUp from "@/components/motion/CountUp"

/*
  Why us — numbers lead, reasons follow (Phase 3). Counters, not cards.
*/

const NUMBERS = [
  { value: 240, suffix: "", label: "Trucks in the network" },
  { value: 12, suffix: "", label: "Corridor hubs" },
  { value: 1.4, decimals: 1, suffix: "M", label: "Kilometres / month" },
  { value: 35, prefix: "−", suffix: "%", label: "CO₂ vs. market avg." },
]

const REASONS = [
  {
    title: "Asset-backed, not a broker",
    desc: "Our trucks, our drivers, our hubs. When we quote an ETA, we control every link that delivers it.",
  },
  {
    title: "Built on data from day one",
    desc: "No retrofitted legacy systems — telematics, routing and customs run on one platform we engineered ourselves.",
  },
  {
    title: "Emissions as a metric, not a slogan",
    desc: "CO₂ per shipment sits next to price on every quote. Lower it per kilometre, prove it per invoice.",
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
                    <CountUp value={n.value} decimals={n.decimals ?? 0} prefix={n.prefix ?? ""} suffix={n.suffix} />
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
