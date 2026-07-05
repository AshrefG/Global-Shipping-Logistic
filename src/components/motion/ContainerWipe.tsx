"use client"

import { useRef, type ReactNode } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, EASE, prefersReducedMotion } from "@/lib/gsap"

type ContainerWipeProps = {
  children: ReactNode
  className?: string
  /** Wipe direction the container "doors" open toward */
  direction?: "up" | "left"
}

/**
 * Container-door section transition (DESIGN.md motif): content reveals
 * behind a clip-path wipe ribbed like container doors. Content is visible
 * by default; the wipe only engages when the animation actually runs.
 * Reduced motion = simple fade-in handled by CSS default state.
 */
export default function ContainerWipe({
  children,
  className,
  direction = "up",
}: ContainerWipeProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return

      const from =
        direction === "up"
          ? "inset(100% 0% 0% 0%)"
          : "inset(0% 100% 0% 0%)"

      gsap.fromTo(
        el,
        { clipPath: from },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1,
          ease: EASE.travel,
          scrollTrigger: { trigger: el, start: "top 78%" },
        },
      )
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
