"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function SolutionSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return
      gsap.from(sectionRef.current.querySelectorAll(".solu-el"), {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="services" ref={sectionRef} className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 solu-el">
          <div className="lg:col-span-4">
            <div className="text-sm font-medium text-primary uppercase tracking-widest mb-4">Solution</div>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
              Our answer is smart, efficient, and <span className="text-primary">sustainable logistics</span>
            </h2>
          </div>
          <div className="lg:col-span-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-bg to-secondary-bg p-8 md:p-12">
              <div className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed max-w-2xl">
                We are redefining logistics for the 21st century. Our solutions harness innovation and technology in a truly transformative way.
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-4 solu-el">
            <div className="sticky top-32">
              <div className="relative aspect-[9/16] max-w-xs mx-auto">
                <div className="w-full h-full rounded-3xl bg-gradient-to-b from-primary-lighter/30 to-secondary-lighter/30 flex items-center justify-center p-8">
                  <svg viewBox="0 0 200 400" className="w-full h-full">
                    <rect x="50" y="30" width="100" height="340" rx="20" fill="currentColor" className="text-primary/20" />
                    <rect x="60" y="50" width="80" height="60" rx="8" fill="currentColor" className="text-primary/40" />
                    <rect x="60" y="130" width="80" height="40" rx="8" fill="currentColor" className="text-secondary/40" />
                    <rect x="60" y="190" width="80" height="40" rx="8" fill="currentColor" className="text-primary/40" />
                    <circle cx="100" cy="320" r="25" fill="currentColor" className="text-primary/30" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Decentralized trade",
                desc: "Better use of existing infrastructure with point-to-point connections between ports of all sizes avoids bottlenecks and ensures minimal disruption from any single incident.",
              },
              {
                title: "Individualized service",
                desc: "Flexible fleet enables on-demand shipping to replace fixed schedules: any route, fully traceable, and just-in-time for cargo owners.",
              },
              {
                title: "Direct transport",
                desc: "No unnecessary stops and no transshipment enable up to 30% time savings compared to conventional transport times.",
              },
              {
                title: "Sustainable operations",
                desc: "We leverage optimized routing, efficient port operations, and green technologies to minimize environmental impact without compromising on cost.",
              },
            ].map((item, i) => (
              <div key={i} className="solu-el">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
