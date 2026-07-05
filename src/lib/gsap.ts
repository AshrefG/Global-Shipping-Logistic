import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { SplitText } from "gsap/SplitText"
import { Flip } from "gsap/Flip"

// Single registration point for the whole app (GSAP ≥3.13 ships all former
// Club plugins). Import gsap/plugins from here, never from "gsap" directly.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin, DrawSVGPlugin, SplitText, Flip)
}

export { gsap, ScrollTrigger, MorphSVGPlugin, DrawSVGPlugin, SplitText, Flip }

/** DESIGN.md motion system: entrances ease out hard, scrubs travel evenly. */
export const EASE = {
  enter: "expo.out",
  enterSoft: "power4.out",
  travel: "power2.inOut",
  exit: "power2.in",
} as const

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}
