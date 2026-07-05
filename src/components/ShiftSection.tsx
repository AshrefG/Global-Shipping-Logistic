"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function ShiftSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bigShipRef = useRef<HTMLDivElement>(null)
  const smallShipsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (bigShipRef.current) {
        gsap.from(bigShipRef.current, {
          x: -200,
          opacity: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: bigShipRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      }
      if (smallShipsRef.current) {
        gsap.from(smallShipsRef.current, {
          x: 200,
          opacity: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: smallShipsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
            Shifting the paradigm from
          </h3>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900">
            large inflexible freight ships
          </h2>
        </div>

        <div ref={bigShipRef} className="mb-16">
          <svg viewBox="0 0 1200 200" className="w-full h-auto" fill="none">
            <rect x="50" y="80" width="1100" height="70" rx="10" fill="currentColor" className="text-gray-300" />
            <rect x="20" y="100" width="1160" height="40" rx="8" fill="currentColor" className="text-gray-400" />
            <circle cx="200" cy="170" r="15" fill="currentColor" className="text-gray-500" />
            <circle cx="1000" cy="170" r="15" fill="currentColor" className="text-gray-500" />
            <rect x="500" y="30" width="200" height="50" rx="6" fill="currentColor" className="text-gray-400" />
          </svg>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-gray-900">
            to <span className="font-bold text-primary">smart, flexible, sustainable logistics</span>
          </h3>
        </div>

        <div ref={smallShipsRef} className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-32 md:w-40">
              <svg viewBox="0 0 150 60" className="w-full h-auto" fill="none">
                <rect x="10" y="20" width="130" height="25" rx="5" fill="currentColor" className="text-primary/60" />
                <rect x="0" y="30" width="150" height="12" rx="4" fill="currentColor" className="text-primary/40" />
                <circle cx="30" cy="42" r="5" fill="currentColor" className="text-primary-dark" />
                <circle cx="120" cy="42" r="5" fill="currentColor" className="text-primary-dark" />
                <rect x="55" y="5" width="40" height="15" rx="3" fill="currentColor" className="text-primary/50" />
              </svg>
            </div>
          ))}
        </div>

        <p className="text-center text-2xl md:text-3xl font-semibold text-gray-800">
          for the benefit of the{" "}
          <span className="font-bold text-secondary">$400 billion</span> global shipping industry.
        </p>
      </div>
    </section>
  )
}
