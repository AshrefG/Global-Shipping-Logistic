"use client"

import { useEffect, useRef } from "react"
import { gsap, EASE } from "@/lib/gsap"

/*
  The Shift: brand centerpiece (Phase 2).
  Entry: the section opens like container doors parting from the centre
  (clip-path inset, scrubbed from "top bottom" to "top top", fully open the
  instant the pin starts, so there is no jump).
  Pinned, scrubbed scene: a cargo container morphs into a truck (MorphSVG),
  wheels drop in, the road paints itself under it and the rig drives out
  past the right edge of the section (the section edge is the mask), handing
  over to the Journey rig that arrives from the left.
  Copy beats are sequenced, never cross-faded on top of each other.
  Reduced motion / below lg: the final truck composition with all copy
  stacked, no pin (the doors part on desktop only).
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

// SVG user space: the stage is 800 wide, the rig's rear edge sits at x=110
const VIEW_W = 800
const RIG_REAR_X = 110
const WHEEL_R = 26
// The road bleeds past the stage to both section edges (overflow visible)
const ROAD_X1 = -1200
const ROAD_X2 = 2000

const BEATS = [
  { title: "Freight used to sit still.", sub: "Locked to ports, timetables and big-batch schedules." },
  { title: "We put it on the road.", sub: "Smart, flexible, door-to-door, tracked every kilometre." },
  { title: "A $400B industry, moving.", sub: "The shift to intelligent road freight is already rolling." },
]

export default function ShiftSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const scene = sceneRef.current
    const stage = stageRef.current
    if (!section || !scene || !stage) return

    const q = gsap.utils.selector(section)
    const body = q<SVGPathElement>(".shift-body")[0]
    const panel = q<SVGPathElement>(".shift-panel")[0]
    const beats = q<HTMLElement>(".shift-beat")
    const wheels = q<SVGGElement>(".shift-wheel")

    // How far (SVG units) the rig travels so its rear clears the section's
    // right edge. Layout boxes only, so transforms never skew the maths.
    const exitX = () => {
      const svgLeft = scene.offsetLeft + stage.offsetLeft
      const unit = stage.offsetWidth / VIEW_W
      return (section.offsetWidth - svgLeft) / unit - RIG_REAR_X + 24
    }

    const mm = gsap.matchMedia()

    mm.add(
      {
        full: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        compact: "(max-width: 1023px)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { full } = ctx.conditions ?? {}

        // ── Entry: container doors part from the centre ──────────────────
        // Desktop only: the doors hand straight into the pin. On phones there
        // is no pin, and the opening strip would ride over the Services stack.
        if (full) {
          const seals = q<HTMLElement>(".shift-seal")
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                // locked to the scrollbar so it is exactly open when the pin starts
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(section, { clipPath: "inset(0% 50% 0% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, 0)
            .fromTo(seals[0], { x: 0 }, { x: () => -section.offsetWidth / 2, duration: 1 }, 0)
            .fromTo(seals[1], { x: 0 }, { x: () => section.offsetWidth / 2, duration: 1 }, 0)
            .fromTo(seals, { opacity: 1 }, { opacity: 0, duration: 0.2 }, 0.8)
        }

        // ── Static composition: final truck, all copy visible, no pin ─────
        if (!full) {
          gsap.set(body, { morphSVG: BODY_TRAILER })
          gsap.set(panel, { morphSVG: PANEL_CAB })
          gsap.set(q(".shift-rib"), { opacity: 0 })
          gsap.set(wheels, { scale: 1, opacity: 1 })
          gsap.set(q(".shift-window"), { opacity: 1 })
          gsap.set(beats, { position: "static", opacity: 1, y: 0, marginBottom: "2rem" })
          // the beats box is a fixed-height stack on lg: let it grow so the
          // stacked beats never run into the truck (reduced motion on desktop)
          gsap.set(q(".shift-beats"), { height: "auto" })
          return
        }

        // ── Full cinematic scrub ─────────────────────────────────────────
        gsap.set(wheels, { scale: 0, opacity: 0, transformOrigin: "50% 50%" })
        gsap.set(q(".shift-window"), { opacity: 0 })
        gsap.set(q(".shift-road-mask"), { scaleX: 0, transformOrigin: "0% 50%" })
        gsap.set(beats, { opacity: 0, y: 24 })
        gsap.set(beats[0], { opacity: 1, y: 0 })

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=260%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        tl
          // beat 1 leaves, then beat 2 arrives: never both on screen
          .to(beats[0], { opacity: 0, y: -24, duration: 0.35, ease: EASE.exit }, 0.4)
          .to(beats[1], { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.8)
          // ribs dissolve, body + panel morph
          .to(q(".shift-rib"), { opacity: 0, duration: 0.5, stagger: 0.05 }, 0.5)
          .to(body, { morphSVG: BODY_TRAILER, duration: 1.4, ease: "power1.inOut" }, 0.8)
          .to(panel, { morphSVG: PANEL_CAB, duration: 1.4, ease: "power1.inOut" }, 0.8)
          // wheels + window arrive
          .to(wheels, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: EASE.enterSoft }, 2.1)
          .to(q(".shift-window"), { opacity: 1, duration: 0.3 }, 2.3)
          // road paints under the rig, beat 2 → 3
          .to(q(".shift-road-mask"), { scaleX: 1, duration: 1.2 }, 2.4)
          .to(beats[1], { opacity: 0, y: -24, duration: 0.35, ease: EASE.exit }, 2.8)
          .to(beats[2], { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 3.2)
          // the rig drives out past the section edge; wheels turn with the distance
          .to(q(".shift-rig"), { x: exitX, duration: 1.8, ease: "power1.in" }, 3.0)
          .to(wheels, {
            rotation: () => (exitX() / (2 * Math.PI * WHEEL_R)) * 360,
            duration: 1.8,
            ease: "power1.in",
          }, 3.0)

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
      {/* Door seals: decorative, shown only while the entry doors part */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
        {/* left seal sits just inside the left door edge, right seal just inside the right one */}
        <div className="shift-seal absolute inset-y-0 left-1/2 w-0.5 bg-primary/70 opacity-0" />
        <div className="shift-seal absolute inset-y-0 left-1/2 w-0.5 -ml-0.5 bg-primary/70 opacity-0" />
      </div>

      <div ref={sceneRef} className="relative max-w-7xl mx-auto px-6 w-full pt-24 lg:pt-28">
        {/* Copy beats */}
        <div className="shift-beats relative h-auto lg:h-36 mb-10 lg:mb-4 text-center">
          {BEATS.map((b, i) => (
            <div key={i} className="shift-beat lg:absolute lg:inset-x-0 lg:top-0 mb-8 lg:mb-0">
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight text-balance">
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

        {/* Morph stage: overflow visible so the rig and road run to the section edge */}
        <div ref={stageRef} className="max-w-4xl mx-auto">
          <svg viewBox={`0 0 ${VIEW_W} 360`} className="block w-full h-auto overflow-visible" fill="none" aria-hidden="true">
            <defs>
              <clipPath id="shift-road-clip">
                <rect className="shift-road-mask" x={ROAD_X1} y={300} width={ROAD_X2 - ROAD_X1} height={36} />
              </clipPath>
            </defs>
            {/* road: hairline lane + amber dashes, painted left to right */}
            <g clipPath="url(#shift-road-clip)">
              <line x1={ROAD_X1} y1="318" x2={ROAD_X2} y2="318" stroke="oklch(1 0 0 / 0.15)" strokeWidth="1.5" />
              <line x1={ROAD_X1} y1="318" x2={ROAD_X2} y2="318" stroke="oklch(0.78 0.15 75)" strokeWidth="3" strokeLinecap="round" strokeDasharray="18 14" />
            </g>
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
                <circle cx="196" cy="286" r={WHEEL_R} fill="oklch(0.14 0.01 255)" stroke="oklch(0.5 0.012 255)" strokeWidth="5" />
                <line x1="196" y1="272" x2="196" y2="300" stroke="oklch(0.5 0.012 255)" strokeWidth="4" />
              </g>
              <g className="shift-wheel">
                <circle cx="268" cy="286" r={WHEEL_R} fill="oklch(0.14 0.01 255)" stroke="oklch(0.5 0.012 255)" strokeWidth="5" />
                <line x1="268" y1="272" x2="268" y2="300" stroke="oklch(0.5 0.012 255)" strokeWidth="4" />
              </g>
              <g className="shift-wheel">
                <circle cx="612" cy="286" r={WHEEL_R} fill="oklch(0.14 0.01 255)" stroke="oklch(0.78 0.15 75)" strokeWidth="5" />
                <line x1="612" y1="272" x2="612" y2="300" stroke="oklch(0.78 0.15 75)" strokeWidth="4" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}
