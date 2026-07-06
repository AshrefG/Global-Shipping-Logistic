"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, prefersReducedMotion } from "@/lib/gsap"

type CountUpProps = {
  /** Final value */
  value: number
  /** Prefix/suffix rendered around the number (e.g. "+", "%", "t CO₂") */
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
  /** Thousands separators (off for years, route codes, ...) */
  grouping?: boolean
}

/**
 * Mono count-up stat (DESIGN.md): renders the final value by default and
 * counts up from 0 when scrolled into view. Reduced motion = static value.
 */
export default function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.6,
  className,
  grouping = true,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const format = (v: number) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: grouping,
    })

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return
      const counter = { v: 0 }
      gsap.to(counter, {
        v: value,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
        onUpdate: () => {
          if (ref.current) ref.current.textContent = format(counter.v)
        },
      })
    },
    { scope: ref },
  )

  return (
    <span className={className}>
      {prefix}
      <span ref={ref} className="font-mono tabular-nums">{format(value)}</span>
      {suffix}
    </span>
  )
}
