"use client"

import { useEffect, useRef } from "react"
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap"

const supporters = [
  "HAX", "ESA", "Federal Ministry", "TUM", "Fraunhofer CML",
  "Microsoft", "KIC", "Unternehmertum", "Digital Hub Logistics",
]

const investors = [
  { name: "SOSV", logo: "SOSV" },
  { name: "FTTF", logo: "FTTF" },
]

export default function PartnersSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return
      gsap.from(sectionRef.current.querySelectorAll(".partner-el"), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      })

      // Velocity-reactive skew: fast scrolling leans the marquees (depth pass)
      if (!prefersReducedMotion()) {
        const marquees = sectionRef.current.querySelectorAll(".marquee-inner")
        const proxy = { skew: 0 }
        const applySkew = gsap.quickSetter(marquees, "skewX", "deg")
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const velocity = gsap.utils.clamp(-10, 10, self.getVelocity() / -300)
            if (Math.abs(velocity) > Math.abs(proxy.skew)) {
              proxy.skew = velocity
              gsap.to(proxy, {
                skew: 0,
                duration: 0.7,
                ease: "power3.out",
                overwrite: true,
                onUpdate: () => applySkew(proxy.skew),
              })
            }
          },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-canvas overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 partner-el">
          <div className="lg:col-span-4">
            <div className="text-sm font-medium text-primary uppercase tracking-widest mb-4">Investors & Supporters</div>
          </div>
          <div className="lg:col-span-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">Trusted by top Partners & Supporters</h2>
          </div>
          <div className="lg:col-span-4 text-right">
            <a href="#contact" className="btn btn-pri btn-lg" data-popup="contact">
              Partner with us today
            </a>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="marquee mb-12">
        <div className="marquee-inner">
          {[...supporters, ...supporters].map((name, i) => (
            <div key={i} className="flex-shrink-0 w-[200px] h-[120px] mx-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-400">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="marquee">
        <div className="marquee-inner marquee-inner--right">
          {[...supporters, ...supporters].map((name, i) => (
            <div key={i} className="flex-shrink-0 w-[200px] h-[120px] mx-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-400">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div className="partner-el grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold text-gray-900">Investors</h3>
            <p className="text-gray-500 text-sm mt-1">Backed by leading venture funds</p>
          </div>
          <div className="lg:col-span-9 flex flex-wrap gap-6">
            {investors.map((inv, i) => (
              <div key={i} className="w-[200px] h-[100px] rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400">{inv.logo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
