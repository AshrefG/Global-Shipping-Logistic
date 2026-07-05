"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, prefersReducedMotion } from "@/lib/gsap"

type RouteLineProps = {
  /** SVG path `d` attribute — the route to draw */
  d: string
  viewBox: string
  className?: string
  strokeWidth?: number
  /** Draw synced to scroll (default) or once on enter */
  scrub?: boolean
  /** Dashed lane-marking style instead of solid */
  dashed?: boolean
}

/**
 * DrawSVG route line (DESIGN.md road motif). The path is fully drawn by
 * default; scroll drawing is an enhancement. Reduced motion = static path.
 */
export default function RouteLine({
  d,
  viewBox,
  className,
  strokeWidth = 2,
  scrub = true,
  dashed = false,
}: RouteLineProps) {
  const pathRef = useRef<SVGPathElement>(null)

  useGSAP(
    () => {
      if (!pathRef.current || prefersReducedMotion()) return
      gsap.from(pathRef.current, {
        drawSVG: "0%",
        ease: scrub ? "none" : "power2.out",
        duration: scrub ? undefined : 1.4,
        scrollTrigger: {
          trigger: pathRef.current,
          start: "top 85%",
          ...(scrub ? { scrub: 0.6, end: "bottom 35%" } : {}),
        },
      })
    },
    { scope: pathRef },
  )

  return (
    <svg viewBox={viewBox} fill="none" className={className} aria-hidden="true">
      <path
        ref={pathRef}
        d={d}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dashed ? "10 14" : undefined}
      />
    </svg>
  )
}
