"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/*
  Official company logo (drop the provided asset at /public/logo.png).
  The artwork is green/blue on white, so on the dark theme it sits in a
  white rounded chip — same treatment as the company's own card.
  Falls back to the GSL text mark until the file exists.
*/

type LogoProps = {
  className?: string
  /** Pixel height of the logo chip */
  height?: number
}

export default function Logo({ className, height = 44 }: LogoProps) {
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // The 404 error event can fire before hydration and be lost — re-check
  // the loaded state on mount so the fallback still engages.
  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth === 0) setFailed(true)
  }, [])

  if (failed) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 font-display font-extrabold text-ink text-lg tracking-tight",
          className,
        )}
      >
        <span className="inline-flex w-9 h-9 rounded-full bg-primary items-center justify-center text-sm text-[oklch(0.17_0.03_75)]">
          GSL
        </span>
        <span className="hidden sm:inline">Global Shipping &amp; Logistics</span>
      </span>
    )
  }

  return (
    <span
      className={cn("inline-flex items-center bg-white rounded-xl px-3 py-1.5 shadow-sm", className)}
      style={{ height }}
    >
      {/* Raster brand asset of unknown intrinsic size — plain img keeps the
          aspect ratio without next/image dimension requirements. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src="/logo.png"
        alt="Global Shipping & Logistics"
        className="h-full w-auto"
        onError={() => setFailed(true)}
      />
    </span>
  )
}
