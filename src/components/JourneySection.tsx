"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"

/*
  The Journey — pinned horizontal scrub (Phase 2).
  The viewport locks and the freight corridor slides past a truck that
  appears to drive: wheels rotate with scroll, waypoints light up amber as
  they're reached, an amber progress line completes the lane.
  This is a genuinely ordered flow, so the stop numbers carry meaning.
  Mobile / reduced motion: vertical stacked stops, no pin.
*/

const STOPS = [
  { id: "01", name: "Pickup", desc: "Loaded at your dock — sealed, weighed, photographed.", code: "GATE-OUT 06:12" },
  { id: "02", name: "Linehaul", desc: "FTL corridor, AI-routed around traffic and weather.", code: "E45 · 87 KM/H" },
  { id: "03", name: "Border", desc: "Customs pre-cleared before the truck arrives.", code: "T1 · CLEARED" },
  { id: "04", name: "Hub", desc: "Cross-docked in minutes, never overnight.", code: "DWELL 00:23" },
  { id: "05", name: "Delivery", desc: "Door-to-door, e-signed, emissions reported.", code: "POD 17:48" },
]

function TruckGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 90" fill="none" className={className} aria-hidden="true">
      <path d="M14 22 Q14 14 22 14 H108 Q116 14 116 22 V64 H14 Z" fill="oklch(0.21 0.012 255)" stroke="oklch(0.78 0.15 75)" strokeWidth="2.5" />
      <path d="M124 64 V38 Q124 30 132 30 H150 Q157 30 161 36 L172 52 Q174 55 174 59 V64 Z" fill="oklch(0.26 0.02 75)" stroke="oklch(0.78 0.15 75)" strokeWidth="2.5" />
      <path d="M132 36 h16 l9 14 h-25 Z" fill="oklch(0.6 0.06 240 / 0.5)" />
      <g className="journey-wheel">
        <circle cx="42" cy="68" r="11" fill="oklch(0.14 0.01 255)" stroke="oklch(0.5 0.012 255)" strokeWidth="3" />
        <line x1="42" y1="62" x2="42" y2="74" stroke="oklch(0.5 0.012 255)" strokeWidth="2.5" />
      </g>
      <g className="journey-wheel">
        <circle cx="74" cy="68" r="11" fill="oklch(0.14 0.01 255)" stroke="oklch(0.5 0.012 255)" strokeWidth="3" />
        <line x1="74" y1="62" x2="74" y2="74" stroke="oklch(0.5 0.012 255)" strokeWidth="2.5" />
      </g>
      <g className="journey-wheel">
        <circle cx="152" cy="68" r="11" fill="oklch(0.14 0.01 255)" stroke="oklch(0.78 0.15 75)" strokeWidth="3" />
        <line x1="152" y1="62" x2="152" y2="74" stroke="oklch(0.78 0.15 75)" strokeWidth="2.5" />
      </g>
    </svg>
  )
}

export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const mm = gsap.matchMedia()

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => track.scrollWidth - window.innerWidth
      const stops = gsap.utils.toArray<HTMLElement>(".journey-stop", section)
      const wheels = gsap.utils.toArray<HTMLElement>(".journey-wheel", section)
      const progressLine = section.querySelector<HTMLElement>(".journey-progress")

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + distance() * 1.15,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // waypoints light up as the corridor passes the truck
            const active = Math.floor(self.progress * STOPS.length + 0.15)
            stops.forEach((s, i) => s.classList.toggle("journey-stop--active", i < active))
            if (progressLine) gsap.set(progressLine, { scaleX: self.progress })
          },
        },
        defaults: { ease: "none" },
      })

      tl.to(track, { x: () => -distance() }, 0)
      wheels.forEach((w) =>
        tl.to(w, { rotation: 1080, transformOrigin: "50% 50%" }, 0),
      )

      // idle bob so the rig feels alive while driving
      const bob = gsap.to(".journey-rig", {
        y: -3,
        duration: 0.4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      })

      return () => {
        bob.kill()
        tl.scrollTrigger?.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="grain relative bg-dark-2 overflow-hidden lg:h-screen"
    >
      {/* Sliding corridor */}
      <div ref={trackRef} className="flex flex-col lg:flex-row lg:h-full lg:w-max">
        {/* Intro panel */}
        <div className="flex flex-col justify-center px-6 pt-24 pb-10 lg:py-0 lg:pl-24 lg:pr-20 lg:w-[44vw] shrink-0">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight text-balance">
            One corridor.<br />
            <span className="text-primary">Zero handoffs.</span>
          </h2>
          <p className="mt-5 max-w-md text-white/60 text-lg">
            Follow a shipment across the network — every stage tracked, timed
            and owned by one partner.
          </p>
          <div className="mt-8 hidden lg:flex items-center gap-3 font-mono text-xs tracking-wider text-white/40">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            SCROLL TO DRIVE
          </div>
        </div>

        {STOPS.map((stop) => (
          <div
            key={stop.id}
            className="journey-stop flex flex-col justify-center px-6 py-10 lg:py-0 lg:px-16 lg:w-[38vw] shrink-0 lg:border-l lg:border-white/5"
          >
            <div className="journey-stop-dot w-3 h-3 rounded-full border-2 border-white/25 mb-6 transition-all duration-500" />
            <div className="font-mono text-xs tracking-[0.2em] text-white/35 mb-2">STOP {stop.id}</div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white/85 tracking-tight journey-stop-name transition-colors duration-500">
              {stop.name}
            </h3>
            <p className="mt-3 max-w-xs text-white/55 leading-relaxed">{stop.desc}</p>
            <div className="mt-5 inline-flex self-start px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 font-mono text-xs text-primary/90">
              {stop.code}
            </div>
          </div>
        ))}
      </div>

      {/* Road + rig — fixed inside the pinned viewport (desktop only) */}
      <div className="hidden lg:block absolute inset-x-0 bottom-16 pointer-events-none">
        {/* lane */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
        <div
          className="absolute inset-x-0 top-1/2 mt-2 h-px opacity-40"
          style={{ background: "repeating-linear-gradient(90deg, oklch(1 0 0 / 0.35) 0 26px, transparent 26px 52px)" }}
        />
        {/* amber completion line */}
        <div
          className="journey-progress absolute inset-x-0 top-1/2 h-[2px] bg-primary shadow-[0_0_18px_oklch(0.78_0.15_75/0.6)]"
          style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
        />
        {/* the rig */}
        <div className="journey-rig absolute left-[12%] -top-[69px]">
          <TruckGlyph className="w-[190px] h-auto drop-shadow-[0_18px_24px_rgba(0,0,0,0.5)]" />
        </div>
      </div>
    </section>
  )
}
