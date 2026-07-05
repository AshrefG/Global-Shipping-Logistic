"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function IntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return
      const els = sectionRef.current.querySelectorAll(".reveal")
      els.forEach((el, i) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-24 md:py-32 bg-canvas">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-3">
            <div className="reveal text-sm font-medium text-primary uppercase tracking-widest">Company</div>
          </div>

          <div className="lg:col-span-9">
            <h2 className="reveal text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight mb-8">
              Welcome to Global Shipping and Logistics, where{" "}
              <span className="text-primary">engineering excellence</span> meets{" "}
              <span className="text-secondary">innovation</span>
            </h2>

            <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600"
                  alt="Welcome to GSL"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col gap-6">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600"
                    alt="GSL Team"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <h3 className="text-xl font-medium text-gray-800 leading-relaxed">
                  We are a logistics company based in Hamburg redefining how freight moves by road.
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  Global Shipping &amp; Logistics (GSL) is a road-freight-first logistics company based in
                  Hamburg, Germany. Founded in 2022, we run FTL, LTL and cross-border corridors —
                  door-to-door, tracked live, with lower emissions per kilometre.
                </p>

                <p className="text-gray-600 leading-relaxed">
                  We believe land transport is where logistics is won or lost. Our telematics-driven
                  fleet and AI-routed corridors move goods to any address — with ocean and rail as
                  complementary modes when the lane calls for it.
                </p>

                <a href="#services" className="reveal text-secondary font-medium hover:text-primary transition-colors no-underline inline-flex items-center gap-2 group">
                  More about us
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" className="transition-transform group-hover:translate-x-1">
                    <path fillRule="evenodd" clipRule="evenodd" d="M30.44 3.68L3 31.12.88 29l27.44-27.44L30.44 3.68z" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.5 1.5h26v26h-3V4.5h-23v-3z" fill="currentColor"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
