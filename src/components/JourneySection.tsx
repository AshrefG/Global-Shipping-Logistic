"use client"

import { useEffect, useRef } from "react"
import { gsap, ScrollTrigger, EASE, DUR, STAGGER } from "@/lib/gsap"
import TextReveal from "@/components/motion/TextReveal"

/*
  The Journey: pinned horizontal scrub (Phase 2).
  Handoff from the Shift: the Shift rig drives out to the right, so this
  scene opens with the same rig driving in from the left to its spot on the
  road (first part of the pin). Then the corridor slides past while the rig
  keeps driving forward, so it ends parked under the last stop: Delivery.
  The amber lane line is the road already driven: its head is locked to the
  rig's front bumper, and a stop lights the moment the bumper reaches it
  (both read from the rendered positions, so they never drift apart).
  Wheels turn and the rig bobs only while it drives (locked to the scroll,
  no idle loops). At Delivery the rig pauses a beat (the stop lights), then
  pulls away and drives on out of the frame before the pin releases: the
  shipment has been delivered and the truck goes on to its next job.
  This is a genuinely ordered flow, so the stop numbers carry meaning.
  Below lg / reduced motion: vertical stacked stops, all lit, no pin.
*/

const STOPS = [
  { id: "01", name: "Pickup", desc: "Loaded at your dock, sealed, weighed, photographed.", code: "GATE-OUT 06:12" },
  { id: "02", name: "Linehaul", desc: "FTL corridor, AI-routed around traffic and weather.", code: "E11 · 87 KM/H" },
  { id: "03", name: "Border", desc: "Customs pre-cleared before the truck arrives.", code: "GHUWEIFAT · CLEARED" },
  { id: "04", name: "Hub", desc: "Cross-docked in minutes, never overnight.", code: "DWELL 00:23" },
  { id: "05", name: "Delivery", desc: "Door-to-door, e-signed, emissions reported.", code: "POD 17:48" },
]

// Front bumper of the truck glyph, as a share of its width (path ends at x=174 of 200)
const BUMPER = 174 / 200

// Pinned timeline segments (timeline seconds; scroll length follows TRAVEL 1:1)
const ARRIVE = 0.2
const TRAVEL = 1
const DWELL = 0.1 // parked at Delivery, the stop lit
const EXIT = 0.35 // pulls away and leaves the frame

const ACTIVE = "journey-stop--active"

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

    const stops = gsap.utils.toArray<HTMLElement>(".journey-stop", section)
    const mm = gsap.matchMedia()

    // ── Desktop: pinned drive ───────────────────────────────────────────
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => track.scrollWidth - window.innerWidth
      const wheels = gsap.utils.toArray<SVGGElement>(".journey-wheel", section)
      const rig = section.querySelector<HTMLElement>(".journey-rig")
      const progressLine = section.querySelector<HTMLElement>(".journey-progress")
      const dots = stops.map((s) => s.querySelector<HTMLElement>(".journey-stop-dot"))
      if (!rig || !progressLine) return

      // Layout positions (transform-free, recomputed on every refresh):
      // the rig's parked bumper x and each stop dot's centre, both measured
      // from the section's left edge.
      let bumper0 = 0
      let dotXs: number[] = []
      // Rig travel during the drive: its bumper ends on the Delivery dot
      let driveX = 0
      const measure = () => {
        bumper0 = rig.offsetLeft + rig.offsetWidth * BUMPER
        dotXs = dots.map((dot, i) => (dot?.offsetLeft ?? stops[i].offsetLeft) + (dot?.offsetWidth ?? 0) / 2)
        const lastDot = dotXs[dotXs.length - 1] ?? bumper0
        driveX = Math.max(0, lastDot - distance() - bumper0)
      }
      measure()

      // Everything below reads the RENDERED rig and track positions, so the
      // line head, the bumper and the lit stops stay in lockstep under scrub.
      const setLine = gsap.quickSetter(progressLine, "scaleX")
      let lit = -1
      const light = () => {
        const bumper = bumper0 + (gsap.getProperty(rig, "x") as number)
        const trackX = gsap.getProperty(track, "x") as number
        setLine(gsap.utils.clamp(0, 1, bumper / section.offsetWidth))
        // 2px tolerance so the last stop lights exactly when the rig parks
        const count = dotXs.filter((x) => x + trackX <= bumper + 2).length
        if (count === lit) return
        lit = count
        stops.forEach((s, i) => s.classList.toggle(ACTIVE, i < count))
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: light,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + distance() * ((ARRIVE + TRAVEL + DWELL + EXIT) / TRAVEL),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measure()
            lit = -1
            light()
          },
        },
      })

      tl
        // the Shift rig rolls in from the left edge to its spot on the road
        .fromTo(
          rig,
          { x: () => -(rig.offsetLeft + rig.offsetWidth + 40) },
          { x: 0, duration: ARRIVE, ease: EASE.travel },
          0,
        )
        // then the corridor slides past while the rig drives on to Delivery
        .fromTo(track, { x: 0 }, { x: () => -distance(), duration: TRAVEL }, ARRIVE)
        .fromTo(rig, { x: 0 }, { x: () => (measure(), driveX), duration: TRAVEL, immediateRender: false }, ARRIVE)
        // wheels turn and the rig bobs only while it is driving
        .fromTo(
          wheels,
          { rotation: 0 },
          { rotation: 1800, transformOrigin: "50% 50%", duration: ARRIVE + TRAVEL, immediateRender: false },
          0,
        )
        .fromTo(
          rig,
          { y: 0 },
          { y: -3, duration: (ARRIVE + TRAVEL) / 40, repeat: 39, yoyo: true, ease: "sine.inOut", immediateRender: false },
          0,
        )
        // dwell: parked under Delivery, lit (nothing moves)
        // exit: pulls away, gathering speed, until it is past the right edge;
        // the lane line keeps following the bumper to the edge of the frame
        .to(
          rig,
          { x: () => section.offsetWidth - rig.offsetLeft + 40, duration: EXIT, ease: "power1.in" },
          ARRIVE + TRAVEL + DWELL,
        )
        .to(wheels, { rotation: "+=900", duration: EXIT, ease: "power1.in" }, ARRIVE + TRAVEL + DWELL)
        .fromTo(
          rig,
          { y: 0 },
          { y: -3, duration: EXIT / 10, repeat: 9, yoyo: true, ease: "sine.inOut", immediateRender: false },
          ARRIVE + TRAVEL + DWELL,
        )

      light()

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
        stops.forEach((s) => s.classList.remove(ACTIVE))
      }
    })

    // ── Below lg / reduced motion: stacked, finished state ──────────────
    mm.add(
      {
        compact: "(max-width: 1023px)",
        reduced: "(prefers-reduced-motion: reduce)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { compact, reduced } = ctx.conditions ?? {}
        if (!compact && !reduced) return

        stops.forEach((s) => s.classList.add(ACTIVE))

        // phone with motion: stops arrive row by row as they are reached
        if (compact && !reduced) {
          gsap.set(stops, { opacity: 0, y: 24 })
          const batch = ScrollTrigger.batch(stops, {
            start: "top 88%",
            once: true,
            onEnter: (els) =>
              gsap.to(els, {
                opacity: 1,
                y: 0,
                duration: DUR.reveal,
                ease: EASE.enter,
                stagger: STAGGER.item,
                overwrite: true,
              }),
          })
          return () => {
            batch.forEach((t) => t.kill())
            stops.forEach((s) => s.classList.remove(ACTIVE))
          }
        }

        return () => stops.forEach((s) => s.classList.remove(ACTIVE))
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="grain relative bg-dark-2 overflow-hidden lg:h-screen motion-reduce:lg:h-auto motion-reduce:lg:pb-44"
    >
      {/* Sliding corridor (reduced motion on lg: intro on top, five stops in one row) */}
      <div
        ref={trackRef}
        className="flex flex-col lg:flex-row lg:h-full lg:w-max motion-reduce:lg:w-full motion-reduce:lg:flex-wrap motion-reduce:lg:px-[4.5rem]"
      >
        {/* Intro panel */}
        <div className="flex flex-col justify-center px-6 pt-24 pb-10 lg:py-0 lg:pl-24 lg:pr-20 lg:w-[44vw] shrink-0 motion-reduce:lg:w-full motion-reduce:lg:pl-6 motion-reduce:lg:pt-32 motion-reduce:lg:pb-16">
          <TextReveal
            as="h2"
            start="top 85%"
            stagger={0.08}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight text-balance"
          >
            One corridor.<br />
            <span className="text-primary">Zero handoffs.</span>
          </TextReveal>
          <p className="mt-5 max-w-md text-white/60 text-lg">
            Follow a shipment across the network. Every stage tracked, timed
            and owned by one partner.
          </p>
          <div className="mt-8 hidden lg:flex motion-reduce:hidden! items-center gap-3 font-mono text-xs tracking-wider text-white/40">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary motion-safe:animate-pulse" />
            SCROLL TO DRIVE
          </div>
        </div>

        {STOPS.map((stop) => (
          <div
            key={stop.id}
            className="journey-stop flex flex-col justify-center px-6 py-10 lg:py-0 lg:px-16 lg:w-[38vw] shrink-0 lg:border-l lg:border-white/5 motion-reduce:lg:w-1/5 motion-reduce:lg:justify-start motion-reduce:lg:px-6 motion-reduce:lg:py-8"
          >
            <div className="journey-stop-dot w-3 h-3 rounded-full border-2 border-white/25 mb-6 transition-[background-color,border-color,box-shadow] duration-500" />
            <div className="font-mono text-xs tracking-[0.2em] text-white/60 mb-2">STOP {stop.id}</div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white/85 tracking-tight journey-stop-name transition-colors duration-500">
              {stop.name}
            </h3>
            {/* two-line slot on lg so every stop centres on the same line */}
            <p className="mt-3 max-w-xl lg:max-w-xs text-white/60 leading-relaxed lg:min-h-[3.25rem]">{stop.desc}</p>
            <div className="mt-5 inline-flex self-start px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 font-mono text-xs text-primary/90">
              {stop.code}
            </div>
          </div>
        ))}
      </div>

      {/* Road + rig: fixed inside the pinned viewport (desktop only) */}
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
          // full by default (no JS / reduced motion); the drive scrub starts it at 0
          style={{ transformOrigin: "left center" }}
        />
        {/* the rig */}
        <div className="journey-rig absolute left-[12%] -top-[69px]">
          <TruckGlyph className="w-[190px] h-auto drop-shadow-[0_18px_24px_rgba(0,0,0,0.5)]" />
        </div>
      </div>
    </section>
  )
}
