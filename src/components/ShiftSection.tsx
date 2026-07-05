"use client"

import { useEffect, useRef } from "react"
import { gsap, EASE } from "@/lib/gsap"

/*
  The Shift — brand centerpiece (Phase 2).
  Pinned, scrubbed scene: a cargo container morphs into a truck (MorphSVG),
  wheels drop in, the road draws itself (DrawSVG) and the truck rolls out.
  Copy beats are synced to the morph. Reduced motion / mobile: the final
  truck composition with all copy stacked, no pin.
*/

// Container body → trailer body
const BODY_CONTAINER =
  "M216 60 H584 Q616 60 616 92 V248 Q616 280 584 280 H216 Q184 280 184 248 V92 Q184 60 216 60 Z"
const BODY_TRAILER =
  "M138 100 H492 Q520 100 520 128 V264 H138 Q110 264 110 236 V128 Q110 100 138 100 Z"

// Container door panel → truck cab
const PANEL_DOOR = "M520 76 H600 V264 H520 Z"
const PANEL_CAB =
  "M536 264 V172 Q536 148 560 148 H614 Q636 148 648 166 L678 210 Q684 220 684 232 V244 Q684 264 664 264 Z"

const RIB_XS = [256, 304, 352, 400, 448, 496]

const BEATS = [
  { title: "Freight used to sit still.", sub: "Locked to ports, timetables and big-batch schedules." },
  { title: "We put it on the road.", sub: "Smart, flexible, door-to-door — tracked every kilometre." },
  { title: "A $400B industry, moving.", sub: "The shift to intelligent road freight is already rolling." },
]

export default function ShiftSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const scene = sceneRef.current
    if (!section || !scene) return

    const q = gsap.utils.selector(scene)
    const body = q<SVGPathElement>(".shift-body")[0]
    const panel = q<SVGPathElement>(".shift-panel")[0]

    const mm = gsap.matchMedia()

    mm.add(
      {
        full: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        still: "(max-width: 1023px), (prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        // Static composition: final truck, all copy visible, no pin
        if (ctx.conditions?.still) {
          gsap.set(body, { morphSVG: BODY_TRAILER })
          gsap.set(panel, { morphSVG: PANEL_CAB })
          gsap.set(q(".shift-rib"), { opacity: 0 })
          gsap.set(q(".shift-wheel"), { scale: 1, opacity: 1 })
          gsap.set(q(".shift-window"), { opacity: 1 })
          gsap.set(q(".shift-road"), { drawSVG: "100%" })
          gsap.set(q(".shift-beat"), { position: "static", opacity: 1, y: 0 })
          return
        }

        // Full cinematic scrub
        gsap.set(q(".shift-wheel"), { scale: 0, opacity: 0, transformOrigin: "50% 50%" })
        gsap.set(q(".shift-window"), { opacity: 0 })
        gsap.set(q(".shift-road"), { drawSVG: "0%" })
        gsap.set(q(".shift-beat"), { opacity: 0, y: 26 })
        gsap.set(q(".shift-beat")[0], { opacity: 1, y: 0 })

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=260%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        })

        tl
          // beat 1 → 2
          .to(q(".shift-beat")[0], { opacity: 0, y: -26, duration: 0.5 }, 0.4)
          .to(q(".shift-beat")[1], { opacity: 1, y: 0, duration: 0.5 }, 0.7)
          // ribs dissolve, body + panel morph
          .to(q(".shift-rib"), { opacity: 0, duration: 0.5, stagger: 0.05 }, 0.5)
          .to(body, { morphSVG: BODY_TRAILER, duration: 1.4, ease: "power1.inOut" }, 0.8)
          .to(panel, { morphSVG: PANEL_CAB, duration: 1.4, ease: "power1.inOut" }, 0.8)
          // wheels + window arrive
          .to(q(".shift-wheel"), { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: EASE.enterSoft }, 2.1)
          .to(q(".shift-window"), { opacity: 1, duration: 0.3 }, 2.3)
          // road draws, truck rolls out, beat 2 → 3
          .to(q(".shift-road"), { drawSVG: "100%", duration: 1.2 }, 2.4)
          .to(q(".shift-beat")[1], { opacity: 0, y: -26, duration: 0.5 }, 2.9)
          .to(q(".shift-beat")[2], { opacity: 1, y: 0, duration: 0.5 }, 3.2)
          .to(q(".shift-rig"), { x: 260, duration: 1.6, ease: "power1.in" }, 3.0)
          .to(q(".shift-wheel"), { rotation: 540, transformOrigin: "50% 50%", duration: 1.6, ease: "power1.in" }, 3.0)

        return () => tl.scrollTrigger?.kill()
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="grain relative bg-dark overflow-hidden lg:min-h-screen flex items-center py-24 lg:py-0"
    >
      <div ref={sceneRef} className="relative max-w-7xl mx-auto px-6 w-full pt-24 lg:pt-28">
        {/* Copy beats */}
        <div className="relative h-auto lg:h-36 mb-10 lg:mb-4 text-center">
          {BEATS.map((b, i) => (
            <div key={i} className="shift-beat lg:absolute lg:inset-x-0 lg:top-0 mb-8 lg:mb-0">
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                {i === 2 ? (
                  <>A <span className="text-primary">$400B</span> industry, moving.</>
                ) : (
                  b.title
                )}
              </h2>
              <p className="mt-3 text-base md:text-lg text-white/60">{b.sub}</p>
            </div>
          ))}
        </div>

        {/* Morph stage */}
        <div className="max-w-4xl mx-auto">
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" aria-hidden="true">
            {/* rolling rig: body + panel + wheels move out together */}
            <g className="shift-rig">
              <path className="shift-body" d={BODY_CONTAINER} fill="oklch(0.21 0.012 255)" stroke="oklch(0.78 0.15 75)" strokeWidth="3" />
              {RIB_XS.map((x) => (
                <line key={x} className="shift-rib" x1={x} y1={78} x2={x} y2={262} stroke="oklch(0.34 0.012 255)" strokeWidth="3" />
              ))}
              <path className="shift-panel" d={PANEL_DOOR} fill="oklch(0.26 0.02 75)" stroke="oklch(0.78 0.15 75)" strokeWidth="3" />
              <path className="shift-window" d="M560 168 h46 l24 34 h-70 Z" fill="oklch(0.6 0.06 240 / 0.5)" />
              {/* wheels */}
              <g className="shift-wheel">
                <circle cx="196" cy="286" r="26" fill="oklch(0.14 0.01 255)" stroke="oklch(0.5 0.012 255)" strokeWidth="5" />
                <line x1="196" y1="272" x2="196" y2="300" stroke="oklch(0.5 0.012 255)" strokeWidth="4" />
              </g>
              <g className="shift-wheel">
                <circle cx="268" cy="286" r="26" fill="oklch(0.14 0.01 255)" stroke="oklch(0.5 0.012 255)" strokeWidth="5" />
                <line x1="268" y1="272" x2="268" y2="300" stroke="oklch(0.5 0.012 255)" strokeWidth="4" />
              </g>
              <g className="shift-wheel">
                <circle cx="612" cy="286" r="26" fill="oklch(0.14 0.01 255)" stroke="oklch(0.78 0.15 75)" strokeWidth="5" />
                <line x1="612" y1="272" x2="612" y2="300" stroke="oklch(0.78 0.15 75)" strokeWidth="4" />
              </g>
            </g>
            {/* road */}
            <line className="shift-road" x1="40" y1="318" x2="760" y2="318" stroke="oklch(0.78 0.15 75)" strokeWidth="3" strokeLinecap="round" strokeDasharray="18 14" />
          </svg>
        </div>
      </div>
    </section>
  )
}
