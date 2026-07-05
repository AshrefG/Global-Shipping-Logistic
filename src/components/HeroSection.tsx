"use client"

import { useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { gsap, SplitText, EASE, prefersReducedMotion } from "@/lib/gsap"
import { useMagnetic } from "@/components/motion/useMagnetic"

const HeroGlobe = dynamic(() => import("@/components/globe/HeroGlobe"), {
  ssr: false,
  loading: () => <div className="w-full h-[300px]" aria-hidden="true" />,
})

const TICKER = [
  "HAM→MIL · E45 · ON TIME",
  "ROT→MAD · A62 · 12:40 CET",
  "MIL→TUN · RO-RO · LOADING",
  "HAM→WAW · A2 · ON TIME",
  "MIL→IST · O-3 · IN TRANSIT",
  "HAM→ROT · A1 · DELIVERED",
]

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const shipRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const ctaRef = useMagnetic<HTMLAnchorElement>(6)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      if (shipRef.current) {
        gsap.to(shipRef.current, {
          y: -40,
          duration: 2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        })
      }

      // Masked line reveal on the display headline (loader gate is ~2.8s)
      let split: SplitText | null = null
      if (titleRef.current) {
        split = SplitText.create(titleRef.current, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        })
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.05,
          stagger: 0.09,
          ease: EASE.enter,
          delay: 0.15,
        })
      }

      const heroEls = [subRef.current, visualRef.current].filter(
        (el): el is HTMLDivElement => Boolean(el),
      )
      gsap.from(heroEls, {
        y: 54,
        opacity: 0,
        duration: 0.95,
        stagger: 0.14,
        delay: 0.35,
        ease: EASE.enterSoft,
      })

      if (visualRef.current) {
        gsap.from(visualRef.current.querySelectorAll(".hero__metric-card"), {
          y: 28,
          opacity: 0,
          duration: 0.72,
          stagger: 0.1,
          delay: 0.55,
          ease: EASE.enterSoft,
        })
      }

      return () => split?.revert()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center pt-32 md:pt-36 pb-16 overflow-hidden">
      {/* Night-highway backdrop — replaced by the 3D globe scene in Phase 1 */}
      <div className="absolute inset-0 bg-dark">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 70% 110%, oklch(0.78 0.15 75 / 0.16), transparent 60%), radial-gradient(ellipse 60% 45% at 15% -10%, oklch(0.23 0.014 255 / 0.9), transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          }}
        />
      </div>

      <div ref={shipRef} className="absolute right-[-5%] top-[15%] w-[200px] h-[275px] opacity-10 z-10 hidden md:block">
        <svg viewBox="0 0 200 275" fill="none" className="w-full h-full">
          <path d="M100 275L0 150L100 50L200 150L100 275Z" fill="white"/>
          <rect x="85" y="0" width="30" height="80" fill="white"/>
        </svg>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_.95fr] gap-10 xl:gap-16 items-center">
          <div className="max-w-4xl">
            <div className="hero__eyebrow inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/80 text-sm font-medium mb-6">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
              Global Shipping &amp; Logistics
            </div>

            <h1 ref={titleRef} className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.02] tracking-tight mb-6">
              Moving the world{" "}
              <span className="text-primary">by road.</span>
            </h1>

            <div ref={subRef} className="max-w-2xl">
              <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8">
                FTL, LTL and cross-border corridors — tracked{" "}
                <span className="text-primary font-semibold">live</span>, delivered{" "}
                <span className="text-primary font-semibold">door-to-door</span>, with{" "}
                <span className="text-primary font-semibold">lower emissions</span> per kilometre.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="#contact" ref={ctaRef} className="btn btn-pri btn-lg" data-popup="contact">
                  Get started
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M30.44 3.68L3 31.12.88 29l27.44-27.44L30.44 3.68z" fill="white"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.5 1.5h26v26h-3V4.5h-23v-3z" fill="white"/>
                  </svg>
                </a>
                <a href="#about" className="btn border border-white/30 text-white hover:bg-white/10 px-8 py-3.5">
                  Learn more
                </a>
              </div>

              <div className="hero__stat-panel grid grid-cols-3 mt-10 max-w-md">
                <div className="hero__stat">
                  <span className="hero__stat-value">98.6%</span>
                  <span className="hero__stat-label">On-time</span>
                </div>
                <div className="hero__stat">
                  <span className="hero__stat-value">40+</span>
                  <span className="hero__stat-label">Corridors</span>
                </div>
                <div className="hero__stat">
                  <span className="hero__stat-value">−35%</span>
                  <span className="hero__stat-label">CO₂ / km</span>
                </div>
              </div>
            </div>
          </div>

          <div ref={visualRef} className="hero__visual-card hidden xl:flex flex-col justify-between">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-white/56 text-xs uppercase tracking-widest mb-1">Route intelligence</div>
                <div className="text-white font-semibold font-mono">HAM → MIL · E45</div>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white/80">
                Live corridor
              </div>
            </div>

            <div className="my-3 -mx-2">
              <HeroGlobe className="w-full h-[300px]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="hero__metric-card">
                <span className="hero__metric-value">Live GPS</span>
                <span className="hero__metric-label">Fleet telematics</span>
              </div>
              <div className="hero__metric-card">
                <span className="hero__metric-value">AI routed</span>
                <span className="hero__metric-label">Traffic aware</span>
              </div>
              <div className="hero__metric-card">
                <span className="hero__metric-value">Direct</span>
                <span className="hero__metric-label">Door-to-door</span>
              </div>
              <div className="hero__metric-card">
                <span className="hero__metric-value">Traceable</span>
                <span className="hero__metric-label">Real-time ops</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live corridor ticker — telemetry voice, soft fade at both edges */}
        <div
          className="mt-12 -mx-6 border-y border-white/10 bg-white/[0.02]"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="marquee py-2.5">
            <div className="marquee-inner items-center gap-10 pr-10" style={{ animationDuration: "46s" }}>
              {[...TICKER, ...TICKER].map((t, i) => (
                <span key={i} className="flex items-center gap-10 whitespace-nowrap font-mono text-xs tracking-wider text-white/55">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
