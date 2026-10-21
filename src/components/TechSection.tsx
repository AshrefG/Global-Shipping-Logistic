"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger, EASE, DUR, STAGGER } from "@/lib/gsap"
import TextReveal from "@/components/motion/TextReveal"

/*
  Technology: the control tower.
  A live-telematics panel next to the platform capabilities as hairline rows.

  Motion (no-preference only; the markup is the finished state):
  - The panel powers on like a screen: an amber scanline crosses its centre,
    then the panel opens from that line. The primary route draws, then the
    secondary corridors, then the waypoints and the traveling unit appear,
    then the readouts tick up to their values.
  - Capability rows arrive row by row, each hairline drawing first.
  - The traveling unit and the route/LIVE loops run only while the panel is
    on screen. Reduced motion: no loops, the unit rests at a fixed point.
*/

const CAPABILITIES = [
  {
    name: "Live telematics",
    desc: "GPS, door and temperature sensors on every unit. Position and condition streamed, not phoned in.",
  },
  {
    name: "Route intelligence",
    desc: "AI re-routes around congestion, weather and border queues while the truck is moving.",
  },
  {
    name: "Paperless borders",
    desc: "e-CMR, T1 and customs documents travel ahead of the truck, cleared before arrival.",
  },
  {
    name: "Emissions ledger",
    desc: "CO₂ per shipment, per lane, per month. Audit-ready reporting built into every invoice.",
  },
]

type Readout = {
  label: string
  value: string
  /** Numeric part that ticks up on power-on; the rest of `value` stays put */
  tick?: { to: number; decimals?: number; prefix?: string; suffix: string }
}

const READOUTS: Readout[] = [
  { label: "SPEED", value: "87 KM/H", tick: { to: 87, suffix: " KM/H" } },
  { label: "ETA", value: "12:41 CET" },
  { label: "REEFER", value: "3.2°C", tick: { to: 3.2, decimals: 1, suffix: "°C" } },
  { label: "CO₂", value: "−35%", tick: { to: 35, prefix: "−", suffix: "%" } },
]

// Route geometry (viewBox 640 x 320)
const ROUTE_MAIN = "M48 282 C180 260 240 170 350 160 C470 148 540 84 600 46"
const ROUTE_A = "M40 250 C140 240 200 140 330 150 C440 158 500 90 606 70"
const ROUTE_B = "M60 60 C180 80 260 210 400 226 C480 234 540 260 610 244"

// Resting point of the unit (no JS / reduced motion): halfway along the
// second leg of the primary route, i.e. the cubic's B(0.5).
const UNIT_REST = { cx: 497.5, cy: 112.75 }

export default function TechSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return
      const mm = gsap.matchMedia()

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          lg: "(min-width: 1024px)",
        },
        (ctx) => {
          const { motion, lg } = ctx.conditions as { motion: boolean; lg: boolean }
          if (!motion) return

          /* ---------- Intro copy under the heading ---------- */
          const lead = section.querySelector(".tech-lead")
          if (lead) {
            gsap.from(lead, {
              y: 20,
              opacity: 0,
              duration: DUR.reveal,
              ease: EASE.enter,
              delay: 0.2,
              scrollTrigger: { trigger: lead, start: lg ? "top 70%" : "top 85%", toggleActions: "play none none none" },
            })
          }

          /* ---------- Capability rows: hairline draws, then the row rises ---------- */
          const rows = gsap.utils.toArray<HTMLElement>(".tech-row", section)
          const endRule = section.querySelector(".tech-rule-end")
          gsap.set(gsap.utils.toArray(".tech-rule", section), { scaleX: 0 })
          gsap.set(gsap.utils.toArray(".tech-row-body", section), { y: 20, opacity: 0 })
          const arrive = (batch: Element[]) => {
            const tl = gsap.timeline()
            batch.forEach((row, i) => {
              const at = i * STAGGER.line
              tl.to(row.querySelector(".tech-rule"), { scaleX: 1, duration: 0.9, ease: EASE.enter }, at)
                .to(row.querySelector(".tech-row-body"), { y: 0, opacity: 1, duration: DUR.reveal, ease: EASE.enter }, at + 0.12)
              if (row === rows[rows.length - 1] && endRule) {
                tl.to(endRule, { scaleX: 1, duration: 0.9, ease: EASE.enter }, at + 0.18)
              }
            })
          }
          // onLeave too: a reload below the list still lands on finished rows
          ScrollTrigger.batch(rows, { start: "top 88%", once: true, onEnter: arrive, onLeave: arrive })

          /* ---------- Control-tower panel ---------- */
          const panel = section.querySelector<HTMLElement>(".tech-panel")
          const scanline = section.querySelector<HTMLElement>(".tech-scanline")
          const unit = section.querySelector<SVGCircleElement>(".tech-unit-dot")
          const routeMain = section.querySelector<SVGPathElement>(".tech-route-main")
          if (!panel || !scanline || !unit || !routeMain) return

          const loops = gsap.utils.toArray<HTMLElement | SVGElement>("[data-loop]", section)
          const setLoops = (state: "running" | "paused" | "") =>
            loops.forEach((el) => (el.style.animationPlayState = state))

          // Traveling unit: loops the primary route, fading out at RUH and back
          // in at DXB so the restart reads as the next unit, not a jump.
          const length = routeMain.getTotalLength()
          const proxy = { t: 0 }
          let firstLap = true
          const place = () => {
            const p = routeMain.getPointAtLength(proxy.t * length)
            const fade = Math.max(0, Math.min(1, firstLap ? 1 : proxy.t / 0.04, (1 - proxy.t) / 0.04))
            gsap.set(unit, { attr: { cx: p.x, cy: p.y }, opacity: fade })
          }
          const travel = gsap.to(proxy, {
            t: 1,
            duration: 14,
            ease: "none",
            repeat: -1,
            paused: true,
            onUpdate: place,
            onRepeat: () => {
              firstLap = false
            },
          })
          place()

          let poweredOn = false
          let onScreen = false
          const syncLoops = () => {
            const run = poweredOn && onScreen
            if (run) travel.play()
            else travel.pause()
            setLoops(run ? "running" : "paused")
          }

          // Hidden states, applied only now that the animation is about to exist
          setLoops("paused")
          // The browser normalises inset() shorthands (and GSAP would then pair
          // mismatched numbers), so the opening is driven through a proxy that
          // always writes all four edges: top and bottom close in step.
          const screen = { open: 0 }
          const setScreen = () => {
            const edge = 50 * (1 - screen.open)
            panel.style.clipPath = `inset(${edge}% 0% ${edge}% 0% round 24px)`
          }
          setScreen()
          gsap.set(scanline, { scaleX: 0, opacity: 1 })
          gsap.set(".tech-draw", { drawSVG: "0% 0%" })
          gsap.set(".tech-waypoint, .tech-unit-dot", { scale: 0, transformOrigin: "50% 50%" })
          gsap.set(".tech-place", { opacity: 0 })
          gsap.set(".tech-readout-value", { opacity: 0 })

          const ticks = gsap.utils.toArray<HTMLElement>(".tech-readout-value")

          const power = gsap.timeline({
            paused: true,
            onComplete: () => {
              poweredOn = true
              gsap.set(".tech-waypoint, .tech-unit-dot", { clearProps: "transform" })
              syncLoops()
            },
          })

          power
            // the screen wakes: a line across the centre, then it opens from it
            .to(scanline, { scaleX: 1, duration: 0.4, ease: EASE.enterSoft }, 0)
            .to(screen, { open: 1, duration: 0.9, ease: EASE.enter, onUpdate: setScreen }, 0.22)
            .to(scanline, { opacity: 0, duration: 0.3, ease: "none" }, 0.4)
            // primary route, then the secondary corridors
            .to(".tech-draw-main", { drawSVG: "0% 100%", duration: 1.0, ease: EASE.travel }, 0.55)
            .to(".tech-draw-alt", { drawSVG: "0% 100%", duration: 0.9, ease: EASE.travel, stagger: 0.14 }, 0.95)
            // waypoints along the route, then the unit at DXB
            .to(".tech-waypoint", { scale: 1, duration: 0.5, ease: EASE.enter, stagger: 0.12 }, 1.1)
            .to(".tech-place", { opacity: 1, duration: 0.4, ease: "none", stagger: 0.12 }, 1.15)
            .to(".tech-unit-dot", { scale: 1, duration: 0.55, ease: EASE.enter }, 1.45)

          // readouts tick up to their values, one after another
          READOUTS.forEach((r, i) => {
            const el = ticks[i]
            if (!el) return
            const at = 1.0 + i * STAGGER.item
            power.to(el, { opacity: 1, duration: 0.25, ease: "none" }, at)
            if (r.tick) {
              const { to, decimals = 0, prefix = "", suffix } = r.tick
              const n = { v: 0 }
              power.fromTo(
                n,
                { v: 0 },
                {
                  v: to,
                  duration: 0.9,
                  ease: "power2.out",
                  onUpdate: () => {
                    el.textContent = `${prefix}${n.v.toFixed(decimals)}${suffix}`
                  },
                  onComplete: () => {
                    el.textContent = r.value
                  },
                },
                at,
              )
            }
          })

          // Seams cover the top of the section as it enters, so on desktop the
          // panel waits until the roller doors have rolled up.
          ScrollTrigger.create({
            trigger: panel,
            start: lg ? "top 60%" : "top 80%",
            once: true,
            onEnter: () => power.play(),
            // reload below the panel: land on the finished screen
            onLeave: () => power.progress(1),
          })

          // Loops run only while the panel is on screen
          ScrollTrigger.create({
            trigger: panel,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => {
              onScreen = self.isActive
              syncLoops()
            },
          })

          return () => {
            travel.kill()
            power.kill()
            panel.style.clipPath = ""
            setLoops("")
            ticks.forEach((el, i) => (el.textContent = READOUTS[i].value))
            unit.setAttribute("cx", String(UNIT_REST.cx))
            unit.setAttribute("cy", String(UNIT_REST.cy))
            unit.style.opacity = ""
          }
        },
        section,
      )
    },
    { scope: sectionRef },
  )

  return (
    <section id="tech" ref={sectionRef} className="py-24 md:py-32 bg-dark text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Capabilities */}
          <div className="lg:col-span-5">
            <TextReveal
              as="h2"
              start="top 65%"
              className="font-display text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-4 text-balance"
            >
              Every truck is a <span className="text-primary">data stream.</span>
            </TextReveal>
            <p className="tech-lead text-white/55 text-lg mb-10 max-w-md">
              The fleet runs on one platform. What the driver sees, you see.
            </p>

            <div className="relative">
              {CAPABILITIES.map((c) => (
                <div key={c.name} className="tech-row relative py-6">
                  <span aria-hidden="true" className="tech-rule absolute inset-x-0 top-0 h-px bg-line origin-left" />
                  <div className="tech-row-body">
                    <h3 className="text-lg font-semibold mb-1.5">{c.name}</h3>
                    <p className="text-white/55 text-sm leading-relaxed max-w-sm">{c.desc}</p>
                  </div>
                </div>
              ))}
              <span aria-hidden="true" className="tech-rule tech-rule-end absolute inset-x-0 bottom-0 h-px bg-line origin-left" />
            </div>
          </div>

          {/* Control-tower panel */}
          <div className="lg:col-span-7 relative">
            {/* power-on scanline: decorative, invisible until the animation runs */}
            <span
              aria-hidden="true"
              className="tech-scanline pointer-events-none absolute inset-x-6 top-1/2 z-10 h-px bg-primary opacity-0 origin-center"
              style={{ boxShadow: "0 0 18px 2px oklch(0.78 0.15 75 / 0.55)" }}
            />
            <div className="tech-panel rounded-3xl border border-line bg-canvas p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-white/45 text-xs uppercase tracking-widest mb-1">Control tower</div>
                  <div className="font-mono font-semibold">
                    UNIT GSL-2471 · <span className="whitespace-nowrap">DXB → RUH</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
                  <span data-loop className="inline-block w-1.5 h-1.5 rounded-full bg-primary motion-safe:animate-pulse" />
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
                  {/* Draw masks: DrawSVG draws these solid strokes, which reveal the
                      dashed routes underneath without touching their dash pattern. */}
                  <defs>
                    <mask id="tech-mask-main" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="320">
                      <path className="tech-draw tech-draw-main" d={ROUTE_MAIN} stroke="white" strokeWidth="14" strokeLinecap="round" />
                    </mask>
                    <mask id="tech-mask-a" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="320">
                      <path className="tech-draw tech-draw-alt" d={ROUTE_A} stroke="white" strokeWidth="12" strokeLinecap="round" />
                    </mask>
                    <mask id="tech-mask-b" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="320">
                      <path className="tech-draw tech-draw-alt" d={ROUTE_B} stroke="white" strokeWidth="12" strokeLinecap="round" />
                    </mask>
                  </defs>
                  {/* secondary corridors */}
                  <g mask="url(#tech-mask-a)">
                    <path data-loop className="hero__route-path" style={{ opacity: 0.28, animationDuration: "26s" }} d={ROUTE_A} strokeWidth="2" />
                  </g>
                  <g mask="url(#tech-mask-b)">
                    <path data-loop className="hero__route-path" style={{ opacity: 0.28, animationDuration: "32s" }} d={ROUTE_B} strokeWidth="2" />
                  </g>
                  {/* primary route */}
                  <g mask="url(#tech-mask-main)">
                    <path data-loop className="hero__route-path tech-route-main" d={ROUTE_MAIN} strokeWidth="3" />
                  </g>
                  {/* waypoints */}
                  <circle className="tech-waypoint" cx="48" cy="282" r="7" fill="#F2B04B" />
                  <circle className="tech-waypoint" cx="350" cy="160" r="6" fill="#F2B04B" opacity="0.7" />
                  <circle className="tech-waypoint" cx="600" cy="46" r="7" fill="#E08A2E" />
                  {/* traveling unit */}
                  <circle className="tech-unit-dot" cx={UNIT_REST.cx} cy={UNIT_REST.cy} r="9" fill="#F2B04B" stroke="oklch(0.1 0.01 255)" strokeWidth="3" />
                  <text className="tech-place font-mono" x="60" y="300" fill="oklch(1 0 0 / 0.45)" fontSize="12" fontFamily="var(--font-geist-mono)">DXB</text>
                  <text className="tech-place font-mono" x="562" y="30" fill="oklch(1 0 0 / 0.45)" fontSize="12" fontFamily="var(--font-geist-mono)">RUH</text>
                </svg>
              </div>

              {/* Readouts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                {READOUTS.map((r) => (
                  <div key={r.label} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-white/60 mb-1">{r.label}</div>
                    <div className="tech-readout-value font-mono tabular-nums text-sm font-semibold text-white">{r.value}</div>
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
