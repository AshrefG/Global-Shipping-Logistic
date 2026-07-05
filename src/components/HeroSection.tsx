"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const shipRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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

      const heroEls = [titleRef.current, subRef.current, visualRef.current].filter(
        (el): el is HTMLHeadingElement | HTMLDivElement => Boolean(el),
      )
      gsap.from(heroEls, {
        y: 54,
        opacity: 0,
        duration: 0.95,
        stagger: 0.14,
        ease: "power3.out",
      })

      if (visualRef.current) {
        gsap.from(visualRef.current.querySelectorAll(".hero__metric-card"), {
          y: 28,
          opacity: 0,
          duration: 0.72,
          stagger: 0.1,
          delay: 0.25,
          ease: "power3.out",
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark/62 via-dark/28 to-dark/74 z-10" />
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1566576912321-b58ed61e2673?w=1920"
        >
          <source src="https://cdn.coverr.co/videos/coverr-shipping-container-ship-at-sunset-5210/1080p.mp4" type="video/mp4" />
        </video>
        <img
          src="https://images.unsplash.com/photo-1566576912321-b58ed61e2673?w=1920"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div ref={shipRef} className="absolute right-[-5%] top-[15%] w-[200px] h-[275px] opacity-20 z-10 hidden md:block">
        <svg viewBox="0 0 200 275" fill="none" className="w-full h-full">
          <path d="M100 275L0 150L100 50L200 150L100 275Z" fill="white"/>
          <rect x="85" y="0" width="30" height="80" fill="white"/>
        </svg>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_.95fr] gap-10 xl:gap-16 items-center">
          <div className="max-w-4xl">
            <div className="hero__eyebrow inline-block px-4 py-2 rounded-full bg-primary-bg/80 backdrop-blur-sm text-primary-dark text-sm font-medium mb-6">
              Global Shipping & Logistics
            </div>

            <h1 ref={titleRef} className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
              Smart Maritime{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-lightest to-secondary-lighter">
                Solutions
              </span>
            </h1>

            <div ref={subRef} className="max-w-2xl">
              <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8">
                We develop innovative shipping solutions to transport freight{" "}
                <span className="text-primary-lighter font-semibold">more efficiently</span>,
                <span className="text-secondary-lighter font-semibold"> with lower emissions</span> and
                <span className="text-primary-lighter font-semibold"> at lower costs</span> than ever before.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="#contact" className="btn btn-pri btn-lg" data-popup="contact">
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

              <div className="hero__metrics grid grid-cols-3 gap-3 mt-10 max-w-xl">
                <div className="hero__metric-card hero__metric-card--dark">
                  <span className="hero__metric-value">70%</span>
                  <span className="hero__metric-label">Fuel savings</span>
                </div>
                <div className="hero__metric-card hero__metric-card--dark">
                  <span className="hero__metric-value">320</span>
                  <span className="hero__metric-label">Containers</span>
                </div>
                <div className="hero__metric-card hero__metric-card--dark">
                  <span className="hero__metric-value">30%</span>
                  <span className="hero__metric-label">Faster routes</span>
                </div>
              </div>
            </div>
          </div>

          <div ref={visualRef} className="hero__visual-card hidden xl:flex flex-col justify-between">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-white/56 text-xs uppercase tracking-widest mb-1">Route intelligence</div>
                <div className="text-white font-semibold">Hamburg → New York</div>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white/80">
                Live corridor
              </div>
            </div>

            <div className="my-8">
              <svg viewBox="0 0 460 260" className="w-full h-auto" fill="none">
                <defs>
                  <linearGradient id="heroRouteGradient" x1="40" y1="210" x2="420" y2="50" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#81C784" />
                    <stop offset="1" stopColor="#42A5F5" />
                  </linearGradient>
                </defs>
                <path className="hero__route-path" d="M40 210C110 120 150 188 210 126C282 52 340 116 420 50" />
                <circle className="hero__route-dot" cx="40" cy="210" r="7" fill="#81C784" />
                <circle className="hero__route-dot" cx="210" cy="126" r="7" fill="#90CAF9" style={{ animationDelay: "0.45s" }} />
                <circle className="hero__route-dot" cx="420" cy="50" r="7" fill="#42A5F5" style={{ animationDelay: "0.9s" }} />
                <path d="M78 224H382" stroke="rgba(255,255,255,.18)" strokeWidth="1" strokeDasharray="5 9" />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="hero__metric-card">
                <span className="hero__metric-value">Low CO₂</span>
                <span className="hero__metric-label">Wind assisted</span>
              </div>
              <div className="hero__metric-card">
                <span className="hero__metric-value">AI routed</span>
                <span className="hero__metric-label">Weather aware</span>
              </div>
              <div className="hero__metric-card">
                <span className="hero__metric-value">Direct</span>
                <span className="hero__metric-label">Point-to-point</span>
              </div>
              <div className="hero__metric-card">
                <span className="hero__metric-value">Traceable</span>
                <span className="hero__metric-label">Real-time ops</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="text-xs text-white/50 uppercase tracking-widest mb-4">Trusted by industry leaders</div>
          <div className="flex flex-wrap items-center gap-8 opacity-60">
            <span className="text-white/70 text-lg font-semibold">Maersk</span>
            <span className="text-white/70 text-lg font-semibold">MSC</span>
            <span className="text-white/70 text-lg font-semibold">CMA CGM</span>
            <span className="text-white/70 text-lg font-semibold">Hapag-Lloyd</span>
            <span className="text-white/70 text-lg font-semibold">ONE</span>
            <span className="text-white/70 text-lg font-semibold">Evergreen</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-white/50 text-xs uppercase tracking-widest animate-pulse">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  )
}
