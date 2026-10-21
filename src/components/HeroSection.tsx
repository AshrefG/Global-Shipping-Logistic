"use client"

import { useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { gsap, SplitText, EASE, onLoaderDone, prefersReducedMotion } from "@/lib/gsap"
import { useMagnetic } from "@/components/motion/useMagnetic"

const HeroGlobe = dynamic(() => import("@/components/globe/HeroGlobe"), {
  ssr: false,
  loading: () => <div className="w-full h-[340px]" aria-hidden="true" />,
})

const TICKER = [
  "DXB→RUH · E11 · ON TIME",
  "JEA→DOH · GATE-OUT 06:12",
  "CCW · −25°C · IN SPEC",
  "DXB→KWI · E11 · IN TRANSIT",
  "DXB→MCT · E44 · ON TIME",
  "AUH→JED · POD 17:48",
]

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const leadRef = useRef<HTMLParagraphElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const visualWrapRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)
  const shadeRef = useRef<HTMLDivElement>(null)
  const ctaRef = useMagnetic<HTMLAnchorElement>(6)

  useEffect(() => {
    const section = sectionRef.current
    // Reduced motion: everything is in place on the first frame, nothing moves
    if (!section || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      /*
        Hero to Intro: the hero recedes instead of scrolling off. Scrubbed,
        linear, locked to the scrollbar while the hero leaves: the copy
        lifts and fades, the globe card lags behind it (parallax under 8%),
        and a flat shade darkens the whole first screen.
      */
      const recede = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
      recede
        .to(copyRef.current, { yPercent: -7, duration: 1 }, 0)
        .to(copyRef.current, { opacity: 0, duration: 0.7 }, 0)
        .to(visualWrapRef.current, { yPercent: 6, duration: 1 }, 0)
        .to(shadeRef.current, { opacity: 0.5, duration: 1 }, 0)
    }, section)

    /*
      Entrance, in view: starts the moment the loader gate opens, so it plays
      as the roller door rolls up instead of under it. Four steps, settled
      about 1.2s after the gate opens:
        1. eyebrow + headline lines rise from their masks
        2. the supporting sentence
        3. actions and the stat panel
        4. the globe card opens upward (clip-path), ticker fades in
    */
    const play = () =>
      ctx.add(() => {
        const tl = gsap.timeline({ defaults: { ease: EASE.enter } })

        let split: SplitText | null = null
        if (titleRef.current) {
          split = SplitText.create(titleRef.current, { type: "lines", mask: "lines" })
          tl.from(split.lines, { yPercent: 110, duration: 0.9, stagger: 0.08 }, 0.12)
        }
        // Give the plain text back once settled so it rewraps naturally
        tl.eventCallback("onComplete", () => split?.revert())

        tl.from(eyebrowRef.current, { y: 16, opacity: 0, duration: 0.7, clearProps: "transform,opacity" }, 0.12)
          .from(leadRef.current, { y: 24, opacity: 0, duration: 0.8, clearProps: "transform,opacity" }, 0.3)
          .from([actionsRef.current, statsRef.current], {
            y: 24,
            opacity: 0,
            duration: 0.75,
            stagger: 0.07,
            clearProps: "transform,opacity",
          }, 0.4)

        if (visualRef.current) {
          tl.fromTo(
            visualRef.current,
            { clipPath: "inset(100% 0% 0% 0% round 34px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 34px)",
              duration: 1,
              ease: "power3.inOut",
              clearProps: "clipPath",
            },
            0.2,
          )
        }
        tl.from(tickerRef.current, { opacity: 0, duration: 0.8, ease: "none", clearProps: "opacity" }, 0.4)
      })

    const offLoader = onLoaderDone(play)

    return () => {
      offLoader()
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center pt-32 md:pt-36 pb-16 overflow-hidden"
    >
      {/* Night-highway backdrop */}
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

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_.95fr] gap-10 xl:gap-16 items-center">
          <div ref={copyRef} className="max-w-4xl">
            <div
              ref={eyebrowRef}
              className="hero__eyebrow inline-flex items-center gap-2 px-4 py-2 rounded-full text-white/80 text-sm font-medium mb-6"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
              Part of Al Shirawi Group · Dubai
            </div>

            <h1 ref={titleRef} className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.02] tracking-tight mb-6">
              Moving the world{" "}
              <span className="text-primary">by road.</span>
            </h1>

            <div className="max-w-2xl">
              <p ref={leadRef} className="text-lg md:text-xl text-white/80 leading-relaxed mb-8">
                Freight, customs, transport and{" "}
                <span className="text-primary font-semibold">cold chain</span> across the GCC,
                tracked <span className="text-primary font-semibold">live</span>, delivered{" "}
                <span className="text-primary font-semibold">door-to-door</span>.
              </p>

              <div ref={actionsRef} className="flex flex-wrap gap-4">
                <a href="#contact" ref={ctaRef} className="btn btn-pri btn-lg" data-popup="contact">
                  Get started
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M30.44 3.68L3 31.12.88 29l27.44-27.44L30.44 3.68z" fill="white"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.5 1.5h26v26h-3V4.5h-23v-3z" fill="white"/>
                  </svg>
                </a>
                <a href="#about" className="hero__ghost">
                  Learn more
                </a>
              </div>

              <div ref={statsRef} className="hero__stat-panel grid grid-cols-3 mt-10 max-w-md">
                <div className="hero__stat">
                  <span className="hero__stat-value">1975</span>
                  <span className="hero__stat-label">Freight roots</span>
                </div>
                <div className="hero__stat">
                  <span className="hero__stat-value">5×</span>
                  <span className="hero__stat-label">Certified · LRQA</span>
                </div>
                <div className="hero__stat">
                  <span className="hero__stat-value">−25°C</span>
                  <span className="hero__stat-label">Cold chain</span>
                </div>
              </div>
            </div>
          </div>

          <div ref={visualWrapRef} className="hidden xl:block">
            <div ref={visualRef} className="hero__visual-card flex flex-col justify-between">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-white/56 text-xs uppercase tracking-widest mb-1">Route intelligence</div>
                  <div className="text-white font-semibold font-mono">DXB → RUH · E11</div>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white/80">
                  Live corridor
                </div>
              </div>

              <div className="my-3 -mx-2">
                <HeroGlobe className="w-full h-[340px]" />
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
        </div>

        {/* Live corridor ticker: telemetry voice, soft fade at both edges */}
        <div
          ref={tickerRef}
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
                // the second copy only closes the loop: screen readers hear each route once
                <span key={i} aria-hidden={i >= TICKER.length || undefined} className="flex items-center gap-10 whitespace-nowrap font-mono text-xs tracking-wider text-white/55">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recede shade: flat ink, raised by the scroll as the hero leaves */}
      <div
        ref={shadeRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 opacity-0"
        style={{ background: "oklch(0.08 0.008 255)" }}
      />
    </section>
  )
}
