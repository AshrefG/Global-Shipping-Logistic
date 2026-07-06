"use client"

import { useEffect, useRef } from "react"
import { gsap, prefersReducedMotion } from "@/lib/gsap"

/*
  Technology — the control tower (Phase 3).
  A live-telematics panel: animated dashed routes, a traveling unit dot and
  mono readouts, next to the platform capabilities as hairline rows.
*/

const CAPABILITIES = [
  {
    name: "Live telematics",
    desc: "GPS, door and temperature sensors on every unit — position and condition streamed, not phoned in.",
  },
  {
    name: "Route intelligence",
    desc: "AI re-routes around congestion, weather and border queues while the truck is moving.",
  },
  {
    name: "Paperless borders",
    desc: "e-CMR, T1 and customs documents travel ahead of the truck — cleared before arrival.",
  },
  {
    name: "Emissions ledger",
    desc: "CO₂ per shipment, per lane, per month — audit-ready reporting built into every invoice.",
  },
]

const READOUTS = [
  ["SPEED", "87 KM/H"],
  ["ETA", "12:41 CET"],
  ["REEFER", "3.2°C"],
  ["CO₂", "−35%"],
]

export default function TechSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(".tech-row", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      })
      gsap.from(".tech-panel", {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".tech-panel", start: "top 82%" },
      })
      // unit dot travels the primary route
      const dot = sectionRef.current?.querySelector(".tech-unit-dot")
      const path = sectionRef.current?.querySelector<SVGPathElement>(".tech-route-main")
      if (dot && path) {
        const length = path.getTotalLength()
        const proxy = { t: 0 }
        gsap.to(proxy, {
          t: 1,
          duration: 14,
          repeat: -1,
          ease: "none",
          onUpdate: () => {
            const p = path.getPointAtLength(proxy.t * length)
            gsap.set(dot, { attr: { cx: p.x, cy: p.y } })
          },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="tech" ref={sectionRef} className="py-24 md:py-32 bg-gradient-to-b from-dark to-dark-2 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Capabilities */}
          <div className="lg:col-span-5">
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
              Every truck is a <span className="text-primary">data stream.</span>
            </h2>
            <p className="text-white/55 text-lg mb-10 max-w-md">
              The fleet runs on one platform — what the driver sees, you see.
            </p>

            <div>
              {CAPABILITIES.map((c) => (
                <div key={c.name} className="tech-row py-6 border-t border-white/10 last:border-b">
                  <h3 className="text-lg font-semibold mb-1.5">{c.name}</h3>
                  <p className="text-white/55 text-sm leading-relaxed max-w-sm">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Control-tower panel */}
          <div className="lg:col-span-7">
            <div className="tech-panel rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-white/45 text-xs uppercase tracking-widest mb-1">Control tower</div>
                  <div className="font-mono font-semibold">UNIT GSL-2471 · DXB → RUH</div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  LIVE
                </div>
              </div>

              {/* Route map */}
              <div className="relative rounded-2xl bg-dark border border-white/5 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(oklch(1 0 0 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.05) 1px, transparent 1px)",
                    backgroundSize: "44px 44px",
                  }}
                />
                <svg viewBox="0 0 640 320" className="relative w-full h-auto" fill="none" aria-hidden="true">
                  {/* secondary corridors */}
                  <path className="hero__route-path" style={{ opacity: 0.28, animationDuration: "26s" }} d="M40 250 C140 240 200 140 330 150 C440 158 500 90 606 70" strokeWidth="2" />
                  <path className="hero__route-path" style={{ opacity: 0.28, animationDuration: "32s" }} d="M60 60 C180 80 260 210 400 226 C480 234 540 260 610 244" strokeWidth="2" />
                  {/* primary route */}
                  <path className="hero__route-path tech-route-main" d="M48 282 C180 260 240 170 350 160 C470 148 540 84 600 46" strokeWidth="3" />
                  {/* waypoints */}
                  <circle cx="48" cy="282" r="7" fill="#F2B04B" />
                  <circle cx="350" cy="160" r="6" fill="#F2B04B" opacity="0.7" />
                  <circle cx="600" cy="46" r="7" fill="#E08A2E" />
                  {/* traveling unit */}
                  <circle className="tech-unit-dot" cx="48" cy="282" r="9" fill="#F2B04B" stroke="oklch(0.1 0.01 255)" strokeWidth="3" />
                  <text x="60" y="300" className="font-mono" fill="oklch(1 0 0 / 0.45)" fontSize="12" fontFamily="var(--font-geist-mono)">DXB</text>
                  <text x="562" y="30" className="font-mono" fill="oklch(1 0 0 / 0.45)" fontSize="12" fontFamily="var(--font-geist-mono)">RUH</text>
                </svg>
              </div>

              {/* Readouts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                {READOUTS.map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-white/40 mb-1">{label}</div>
                    <div className="font-mono text-sm font-semibold text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
