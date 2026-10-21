"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, prefersReducedMotion } from "@/lib/gsap"

/**
 * Lane-marking seam (DESIGN.md road motif). Placed BETWEEN two sections in
 * page.tsx: a dashed lane line along the section boundary that paints itself
 * left to right as the boundary rises through the viewport, led by a single
 * amber headlight that fades out once the lane is complete.
 *
 * The lane renders fully drawn: no JS / reduced motion = static dashed line.
 */
export default function LaneSeam() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return

      const lane = el.querySelector(".ls-lane")
      const light = el.querySelector(".ls-light")

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          end: "top 38%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      tl.fromTo(lane, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
        // the light switches on as the lane starts painting, never earlier
        .fromTo(light, { x: 0, opacity: 0 }, { x: () => el.offsetWidth, duration: 1 }, 0)
        .to(light, { opacity: 1, duration: 0.04 }, 0)
        .to(light, { opacity: 0, duration: 0.15 }, 0.85)
    },
    { scope: ref },
  )

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative h-0 pointer-events-none"
      style={{ zIndex: "var(--z-seam)" }}
    >
      {/* clip sideways only: the headlight glow may spill above and below the
          lane, never past the viewport edges. overflow-x: clip (not
          clip-path, which hides pixels but still widens the page) */}
      <div className="absolute inset-x-0 -top-px h-[2px]" style={{ overflowX: "clip", overflowY: "visible" }}>
        <div
          className="ls-lane absolute inset-0 origin-left"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, oklch(1 0 0 / 0.22) 0 28px, transparent 28px 56px)",
          }}
        />
        <span
          className="ls-light absolute -left-1 -top-[3px] h-2 w-2 rounded-full bg-primary opacity-0"
          style={{ boxShadow: "0 0 14px 3px oklch(0.78 0.15 75 / 0.55)" }}
        />
      </div>
    </div>
  )
}
