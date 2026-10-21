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

/** Durations (s) and staggers: reveals 0.7-0.9, wipes 1.1-1.3, lists 50-90ms. */
export const DUR = {
  press: 0.14,
  hover: 0.18,
  ui: 0.24,
  reveal: 0.8,
  open: 1.2,
} as const

export const STAGGER = {
  line: 0.09,
  item: 0.07,
} as const

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

/*
  Loader → hero handoff. The loader marks <html data-loaded="true"> and fires
  LOADER_DONE the moment its gate starts opening; first-screen entrances wait
  for it so they play in view instead of under the loader.
*/
export const LOADER_DONE = "gsl:loader-done"

/** Overlays (contact modal) ask ClientLayout to hold the page still (Lenis stop/start). */
export const SCROLL_LOCK = "gsl:scroll-lock"
export const SCROLL_UNLOCK = "gsl:scroll-unlock"

export function markLoaderDone() {
  if (typeof window === "undefined") return
  if (document.documentElement.dataset.loaded === "true") return
  document.documentElement.dataset.loaded = "true"
  window.dispatchEvent(new Event(LOADER_DONE))
}

/** Runs `cb` once the loader gate opens (immediately if it already has). Returns a cleanup. */
export function onLoaderDone(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  if (document.documentElement.dataset.loaded === "true") {
    cb()
    return () => {}
  }
  window.addEventListener(LOADER_DONE, cb, { once: true })
  return () => window.removeEventListener(LOADER_DONE, cb)
}
