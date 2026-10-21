"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger, SplitText, EASE, DUR, STAGGER, prefersReducedMotion } from "@/lib/gsap"

const supporters = [
  "HAX", "ESA", "Federal Ministry", "TUM", "Fraunhofer CML",
  "Microsoft", "KIC", "Unternehmertum", "Digital Hub Logistics",
]

const investors = [
  { name: "SOSV", logo: "SOSV" },
  { name: "FTTF", logo: "FTTF" },
]

/*
  Partners. Motion, in reading order and once:
    1. Heading block: label wipes in, heading lines rise from their masks,
       the action settles last.
    2. Two marquees travel in opposite lanes (GSAP loop, so it can ease to a
       stop): pointer over a lane brakes it to a halt, leaving releases it.
       Loops pause while the section is off screen. Fast scrolling leans
       the lanes (velocity skew), applied to the lane wrapper so it never
       fights the loop's transform.
    3. Investor tiles arrive one after another.
  Reduced motion: no loop, no skew, no reveal. The supporters render as a
  static wrapped grid (duplicates and the mirrored lane hidden) so every
  name is readable without travel.
*/

const tileBase =
  "flex-shrink-0 w-[200px] h-[120px] mx-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center " +
  "transition-colors duration-[var(--t-hover)] hover:border-gray-200 " +
  "motion-reduce:w-auto motion-reduce:h-[96px] motion-reduce:mx-0"

const nameBase =
  "text-lg font-semibold text-gray-400 transition-colors duration-[var(--t-hover)] group-hover/tile:text-gray-700 text-center px-3"

export default function PartnersSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = sectionRef.current
      if (!root || prefersReducedMotion()) return

      /* 1. Heading block */
      const head = root.querySelector<HTMLElement>("[data-partners-head]")
      const label = root.querySelector<HTMLElement>("[data-partners-label]")
      const title = root.querySelector<HTMLElement>("[data-partners-title]")
      const cta = root.querySelector<HTMLElement>("[data-partners-cta]")

      let split: SplitText | null = null
      if (head && title) {
        split = SplitText.create(title, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.9,
              ease: EASE.enter,
              stagger: STAGGER.line,
              delay: 0.08,
              scrollTrigger: { trigger: head, start: "top 85%", toggleActions: "play none none none" },
            }),
        })
      }

      if (head && label && cta) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: head, start: "top 85%", toggleActions: "play none none none" },
        })
        tl.fromTo(
          label,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: EASE.enterSoft, clearProps: "clipPath" },
          0,
        ).from(
          cta,
          { y: 20, opacity: 0, duration: 0.7, ease: EASE.enter, clearProps: "transform,opacity" },
          0.32,
        )
      }

      /* 2. Marquee lanes */
      const lanes = gsap.utils.toArray<HTMLElement>("[data-lane]", root)
      const loops = lanes.map((lane) => {
        const track = lane.querySelector<HTMLElement>("[data-track]")!
        const reverse = track.dataset.track === "right"
        return gsap.fromTo(
          track,
          { xPercent: reverse ? -50 : 0 },
          { xPercent: reverse ? 0 : -50, duration: 38, ease: "none", repeat: -1, paused: true },
        )
      })

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => loops.forEach((loop) => (self.isActive ? loop.play() : loop.pause())),
      })

      // Brake to a stop under the pointer (fine pointers only), release on leave
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
      const unbind: Array<() => void> = []
      if (fine) {
        lanes.forEach((lane, i) => {
          const loop = loops[i]
          const brake = () => gsap.to(loop, { timeScale: 0, duration: 0.5, ease: "power2.out", overwrite: true })
          const release = () => gsap.to(loop, { timeScale: 1, duration: 0.7, ease: "power2.in", overwrite: true })
          lane.addEventListener("pointerenter", brake)
          lane.addEventListener("pointerleave", release)
          unbind.push(() => {
            lane.removeEventListener("pointerenter", brake)
            lane.removeEventListener("pointerleave", release)
          })
        })
      }

      // Velocity-reactive skew: fast scrolling leans the lanes (depth pass)
      const proxy = { skew: 0 }
      const applySkew = gsap.quickSetter(lanes, "skewX", "deg")
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = gsap.utils.clamp(-8, 8, self.getVelocity() / -300)
          if (Math.abs(velocity) > Math.abs(proxy.skew)) {
            proxy.skew = velocity
            gsap.to(proxy, {
              skew: 0,
              duration: 0.8,
              ease: "power3.out",
              overwrite: true,
              onUpdate: () => applySkew(proxy.skew),
            })
          }
        },
      })

      /* 3. Investors */
      const invest = root.querySelector<HTMLElement>("[data-investors]")
      if (invest) {
        gsap
          .timeline({ scrollTrigger: { trigger: invest, start: "top 88%", toggleActions: "play none none none" } })
          .from(invest.querySelectorAll("[data-investors-copy]"), {
            y: 20,
            opacity: 0,
            duration: DUR.reveal,
            ease: EASE.enter,
            stagger: STAGGER.item,
            clearProps: "transform,opacity",
          })
          .fromTo(
            invest.querySelectorAll("[data-investor]"),
            { y: 28, opacity: 0, clipPath: "inset(100% 0% 0% 0% round 12px)" },
            {
              y: 0,
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0% round 12px)",
              duration: 0.9,
              ease: EASE.enter,
              stagger: 0.09,
              clearProps: "transform,opacity,clipPath",
            },
            0.12,
          )
      }

      return () => {
        unbind.forEach((fn) => fn())
        split?.revert()
      }
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-canvas overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div data-partners-head className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-4">
            <div data-partners-label className="text-sm font-medium text-primary uppercase tracking-widest mb-4">
              Investors & Supporters
            </div>
          </div>
          <div className="lg:col-span-4">
            <h2 data-partners-title className="font-display text-3xl md:text-4xl font-bold tracking-tight leading-tight text-gray-900">
              Trusted by top Partners & Supporters
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <a href="#contact" data-partners-cta className="btn btn-pri btn-lg" data-popup="contact">
              Partner with us today
            </a>
          </div>
        </div>
      </div>

      {/* Lane 1: leftbound. Under reduced motion it becomes a static grid. */}
      <div data-lane className="overflow-hidden mb-12 motion-reduce:overflow-visible">
        <div
          data-track="left"
          className="flex w-max motion-reduce:w-auto motion-reduce:max-w-7xl motion-reduce:mx-auto motion-reduce:px-6 motion-reduce:grid motion-reduce:grid-cols-2 motion-reduce:gap-4 sm:motion-reduce:grid-cols-3 lg:motion-reduce:grid-cols-5"
        >
          {[...supporters, ...supporters].map((name, i) => {
            const dup = i >= supporters.length
            return (
              <div
                key={i}
                aria-hidden={dup || undefined}
                className={`group/tile ${tileBase} ${dup ? "motion-reduce:hidden" : ""}`}
              >
                <span className={nameBase}>{name}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lane 2: rightbound mirror of lane 1 (decorative duplicate) */}
      <div data-lane aria-hidden="true" className="overflow-hidden motion-reduce:hidden">
        <div data-track="right" className="flex w-max">
          {[...supporters, ...supporters].map((name, i) => (
            <div key={i} className={`group/tile ${tileBase}`}>
              <span className={nameBase}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div data-investors className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-3">
            <h3 data-investors-copy className="text-lg font-semibold text-gray-900">Investors</h3>
            <p data-investors-copy className="text-gray-500 text-sm mt-1">Backed by leading venture funds</p>
          </div>
          <div className="lg:col-span-9 flex flex-wrap gap-6">
            {investors.map((inv, i) => (
              <div
                key={i}
                data-investor
                className="w-[200px] h-[100px] rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center"
              >
                <span className="text-xl font-bold text-gray-400">{inv.logo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
