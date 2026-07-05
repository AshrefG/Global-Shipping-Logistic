"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const techItems = [
  {
    title: "Up to 100% of propulsion power from clean wind energy",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M15.06 42.24C5.4 45.04-1.04 32.58 5.92 21.67c3.22 8.73 16.52 3.84 11.95 17.45M8 32.79c1.25 2.7 3.74 10.28 13.5 11.94M14.86 10.04c2.39-9.76 16.41-9.04 22.33 2.39-9.14-1.56-11.63 12.46-21.09 1.66M26.59 8.69c-3.01-.31-10.8-1.87-17.14 5.71M42.17 26.55c7.27 6.96-.32 18.8-13.3 18.18 5.92-7.17-4.99-16.31 9.14-19.01M37.5 37.46c1.77-2.39 6.96-8.41 3.64-17.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Up to 70% fuel savings",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M7.92 5.72c-.94-1.3.01-3.08 1.58-3.08h18.29c1.59 0 2.5 1.8 1.58 3.08l-3.78 5.27a2.47 2.47 0 0 1 1.27 2.09c0 .95-.52 1.8-1.28 2.26 5.33 2.49 9.03 7.9 9.03 14.18v1.22c0 .5-.41.91-.92.91a.91.91 0 0 1-.91-.91v-1.22c0-7.45-5.9-13.52-13.28-13.8h-1.04c-7.41.28-13.32 6.36-13.32 13.82v9.63a4.42 4.42 0 0 0 4.42 4.42h12.37c.5 0 .91.41.91.91 0 .5-.41.92-.91.92H9.25A5.25 5.25 0 0 1 4 38.12v-9.63c0-6.28 3.7-11.7 9.04-14.19a2.47 2.47 0 0 1-.3-1.19c0-.81.37-1.55.96-2.03L7.92 5.72Zm5.59 4.66h10.27l4.1-5.72c.02-.03.02-.02.02-.02.02-.03.02-.05.02-.06 0-.02 0-.04-.01-.06-.01-.03-.03-.05-.04-.05a.09.09 0 0 0-.06-.02H9.5a.09.09 0 0 0-.06.02c-.02.01-.04.03-.05.05l-.01.06s0 .03.02.06l4.11 5.72Zm5.72 3.45h-2.84a.81.81 0 0 1 0-1.63h10.53a.81.81 0 0 1 0 1.63h-4.68" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: "320 containers capacity",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M10.77 6.39c0-1.2.98-2.18 2.18-2.18h6.55c1.2 0 2.18.98 2.18 2.18v6.59a2.18 2.18 0 0 1-2.18 2.16h-6.55a2.18 2.18 0 0 1-2.18-2.18V6.39Zm9.08 6.57V6.39c0-.2-.16-.36-.36-.36h-6.55c-.2 0-.36.16-.36.36v6.57c0 .2.16.36.36.36h6.55c.2 0 .36-.16.36-.36ZM4.78 18.28c0-1.2.98-2.18 2.18-2.18h6.55c1.2 0 2.18.98 2.18 2.18v7.48h-.21a2.18 2.18 0 0 1-1.98 1.27H6.96a2.18 2.18 0 0 1-2.18-2.18v-6.57Zm9.1 5.65v-5.65c0-.2-.17-.36-.36-.36H6.96c-.2 0-.36.16-.36.36v6.57c0 .2.16.36.36.36h6.55c.2 0 .36-.16.36-.36v-.92h.01Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: "Autonomous operation capability",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M24 3c.5 0 .91.41.91.91v3.13a17.09 17.09 0 0 1 16.05 16.05h3.13c.5 0 .91.41.91.91 0 .5-.41.91-.91.91h-3.13A17.09 17.09 0 0 1 24.91 40.9v3.13c0 .5-.41.91-.91.91a.91.91 0 0 1-.91-.91v-3.13A17.09 17.09 0 0 1 7.04 24.9H3.91A.91.91 0 0 1 3 24c0-.5.41-.91.91-.91h3.13A17.09 17.09 0 0 1 23.09 7.04V3.9c0-.5.41-.91.91-.91Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: "No special infrastructure required",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M34.58 28.53v11.14a4.14 4.14 0 0 1-4.25 4.1H20.88M26.27 4.09H14.06c-1.99 0-3.59 1.82-3.59 4.07v7.82M10.09 39.62l2.63-5.91a.48.48 0 0 0-.49-.75h-3.5a.48.48 0 0 1-.5-.73l2.29-5.57M7.19 19.09h6.59M39.24 9.67l-9.5 9.88M39.42 19.37l-9.88-9.5M20.71 39.64h6.54M17.94 41.65V23.96c0-1.24-1.02-2.26-2.26-2.26H5.26c-1.24 0-2.26 1.02-2.26 2.26v17.69c0 1.24 1.02 2.26 2.26 2.26H15.7c1.24 0 2.26-1.02 2.26-2.26ZM34.49 4.09A10.51 10.51 0 1 1 24 14.6a10.51 10.51 0 0 1 10.49-10.51Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function TechSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const shipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return
      gsap.from(sectionRef.current.querySelectorAll(".tech-item"), {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      })
      if (shipRef.current) {
        gsap.to(shipRef.current, {
          rotation: -2,
          duration: 3,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="tech" ref={sectionRef} className="py-24 md:py-32 bg-gradient-to-b from-dark to-dark-2 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-5">
            <div className="tech-item text-sm font-medium text-primary-lighter uppercase tracking-widest mb-4">Technology</div>
            <h2 className="tech-item text-3xl md:text-4xl font-semibold leading-tight">
              Our logistics platform is the smartest way to decarbonize short-sea and feeder segments
            </h2>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {techItems.map((item, i) => (
              <div key={i} className="tech-item bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-medium leading-relaxed">{item.title}</h3>
                  <div className="text-primary-lighter flex-shrink-0">{item.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={shipRef} className="tech-item relative w-full max-w-4xl mx-auto my-16">
          <svg viewBox="0 0 1200 400" className="w-full h-auto">
            <defs>
              <linearGradient id="shipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#66BB6A" stopOpacity="0.6"/>
                <stop offset="50%" stopColor="#42A5F5" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#66BB6A" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <path d="M100 280 L150 320 L1050 320 L1100 280 Z" fill="url(#shipGrad)" opacity="0.8"/>
            <rect x="200" y="120" width="800" height="160" rx="20" fill="currentColor" className="text-white/10"/>
            <rect x="250" y="80" width="100" height="40" rx="8" fill="currentColor" className="text-white/15"/>
            <rect x="850" y="80" width="100" height="40" rx="8" fill="currentColor" className="text-white/15"/>
            <rect x="450" y="40" width="300" height="40" rx="10" fill="currentColor" className="text-white/20"/>
            <circle cx="300" cy="280" r="20" fill="currentColor" className="text-white/30"/>
            <circle cx="900" cy="280" r="20" fill="currentColor" className="text-white/30"/>
            <rect x="150" y="250" width="60" height="30" rx="5" fill="currentColor" className="text-white/20"/>
            <rect x="990" y="250" width="60" height="30" rx="5" fill="currentColor" className="text-white/20"/>
          </svg>
        </div>

        <div className="tech-item text-center mt-12">
          <a href="#contact" className="inline-flex items-center gap-3 text-primary-lighter hover:text-primary-lightest transition-colors font-medium text-lg no-underline" data-popup="contact">
            Explore GSL Technology
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M30.44 3.68L3 31.12.88 29l27.44-27.44L30.44 3.68z" fill="currentColor"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M4.5 1.5h26v26h-3V4.5h-23v-3z" fill="currentColor"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
