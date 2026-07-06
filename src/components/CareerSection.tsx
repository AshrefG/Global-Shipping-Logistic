"use client"

import { useEffect, useRef } from "react"
import { gsap, prefersReducedMotion } from "@/lib/gsap"

/*
  Career (#career) — real section replacing the interim footer anchor.
  Open roles as hairline rows with mono metadata; the whole row is a mailto.
*/

const ROLES = [
  { title: "Heavy Vehicle Driver (HGV)", dept: "Fleet", loc: "Dubai (DIP-1)", type: "Full-time" },
  { title: "Operations Dispatcher", dept: "Ops", loc: "Dubai (DIP-1)", type: "Full-time" },
  { title: "Cold Store Supervisor", dept: "Warehousing", loc: "Dubai Industrial City", type: "Full-time" },
  { title: "Customs Clearance Specialist", dept: "Cross-border", loc: "Jebel Ali", type: "Full-time" },
  { title: "WMS & Systems Engineer", dept: "Engineering", loc: "Dubai / Hybrid", type: "Full-time" },
]

export default function CareerSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(".career-row", {
        y: 28,
        opacity: 0,
        duration: 0.6,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="career" ref={sectionRef} className="py-24 md:py-32 bg-canvas">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              Drive the <span className="text-primary">shift.</span>
            </h2>
            <p className="mt-4 text-gray-600 text-lg max-w-md">
              We hire people who like moving real things in the real world —
              on the road, in the hubs, and in the codebase.
            </p>
          </div>
          <div className="font-mono text-xs tracking-[0.15em] text-gray-500">
            {ROLES.length} OPEN ROLES
          </div>
        </div>

        <div>
          {ROLES.map((role) => (
            <a
              key={role.title}
              href={`mailto:info@gsldubai.com?subject=${encodeURIComponent(`Application: ${role.title}`)}`}
              className="career-row group grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center py-6 border-t border-line last:border-b no-underline hover:bg-white/[0.015] transition-colors"
            >
              <h3 className="md:col-span-5 text-lg md:text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {role.title}
              </h3>
              <span className="md:col-span-2 font-mono text-xs text-gray-500">{role.dept.toUpperCase()}</span>
              <span className="md:col-span-3 text-sm text-gray-600">{role.loc}</span>
              <span className="md:col-span-1 text-sm text-gray-500">{role.type}</span>
              <span className="hidden md:flex md:col-span-1 justify-end text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all">
                <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M30.44 3.68L3 31.12.88 29l27.44-27.44L30.44 3.68z" fill="currentColor" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.5 1.5h26v26h-3V4.5h-23v-3z" fill="currentColor" />
                </svg>
              </span>
            </a>
          ))}
        </div>

        <p className="mt-10 text-sm text-gray-500">
          Nothing that fits?{" "}
          <a href="mailto:info@gsldubai.com" className="text-primary hover:text-primary-dark transition-colors no-underline font-medium">
            Send an open application →
          </a>
        </p>
      </div>
    </section>
  )
}
