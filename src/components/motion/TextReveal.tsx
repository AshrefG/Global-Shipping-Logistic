"use client"

import { createElement, useRef, type ElementType, type ReactNode } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, SplitText, EASE, prefersReducedMotion } from "@/lib/gsap"

type TextRevealProps = {
  children: ReactNode
  /** Rendered element, defaults to div (pass "h2", "p", ...) */
  as?: ElementType
  className?: string
  /** Seconds between lines */
  stagger?: number
  /** Start reveal when this % of the element hits the viewport bottom */
  start?: string
  /** Scrub with scroll instead of playing once on enter */
  scrub?: boolean
}

/**
 * SplitText masked line reveal (DESIGN.md motion primitive).
 * Content is fully visible by default; the animation only hides it the
 * moment it starts, so no-JS/reduced-motion/headless all read fine.
 */
export default function TextReveal({
  children,
  as: Tag = "div",
  className,
  stagger = 0.06,
  start = "top 82%",
  scrub = false,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return

      const split = SplitText.create(ref.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      })

      gsap.from(split.lines, {
        yPercent: 110,
        duration: 0.9,
        ease: EASE.enter,
        stagger,
        scrollTrigger: {
          trigger: ref.current,
          start,
          ...(scrub ? { scrub: true, end: "top 40%" } : {}),
        },
      })

      return () => split.revert()
    },
    { scope: ref },
  )

  // Passing the ref object to createElement is ref forwarding, not a read.
  // eslint-disable-next-line react-hooks/refs
  return createElement(Tag, { ref, className }, children)
}
