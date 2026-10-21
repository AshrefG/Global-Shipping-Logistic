"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, prefersReducedMotion } from "@/lib/gsap"

type ContainerWipeProps = {
  /** Background of the OUTGOING section (CSS color), e.g. "var(--color-gray-50)" */
  from: string
  /** Number of door ribs (slats) */
  ribs?: number
  /** How far the doors reach into the incoming section */
  reach?: string
}

/**
 * Container-door section transition (DESIGN.md motif). Placed BETWEEN two
 * sections in page.tsx: a zero-height seam whose ribs, painted in the
 * outgoing section's colour, hang over the top of the incoming section and
 * roll up into the seam as it scrolls in, centre ribs first, like a
 * warehouse roller door. Scrubbed, so it travels with the scroll.
 *
 * The ribs render open (scaleY 0): no JS / reduced motion = a plain hard cut.
 */
export default function ContainerWipe({
  from,
  ribs = 7,
  reach = "55vh",
}: ContainerWipeProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return

      gsap.fromTo(
        el.querySelectorAll(".cw-rib"),
        { scaleY: 1 },
        {
          scaleY: 0,
          ease: "none",
          stagger: { each: 0.07, from: "center" },
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top 42%",
            scrub: true,
          },
        },
      )
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
      <div className="absolute inset-x-0 top-0 flex" style={{ height: reach }}>
        {Array.from({ length: ribs }, (_, i) => (
          <div
            key={i}
            className="cw-rib flex-1 origin-top"
            style={{
              background: from,
              transform: "scaleY(0)",
              // rib seams: the corrugation of a container door
              boxShadow: "inset -1px 0 0 oklch(1 0 0 / 0.045), inset 0 -2px 0 oklch(0.78 0.15 75 / 0.35)",
            }}
          />
        ))}
      </div>
    </div>
  )
}
