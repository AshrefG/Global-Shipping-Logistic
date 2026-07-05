"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const items = [
  {
    title: "Patented Technology",
    desc: "Our unique combination of logistics optimization, routing algorithms, and operational systems are first of their kind in the industry.",
  },
  {
    title: "Unlimited market opportunity",
    desc: "Our solutions know no geographical limit. From intra-Europe shipping to trans-Pacific routes, every market segment can be optimized.",
  },
  {
    title: "Massive Scalability",
    desc: "We aim to bring economies of scale to logistics operations. Inspired by modern supply chain management, we transform shipping from rigid schedules to flexible, on-demand service.",
  },
]

export default function WhyUsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return
      gsap.from(sectionRef.current.querySelectorAll(".why-item"), {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="why-item text-sm font-medium text-primary uppercase tracking-widest mb-4">Why us</div>
            <h2 className="why-item text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight mb-6">
              <span className="text-primary">Transforming</span> a 500-year-old, $400B market
            </h2>
            <a href="#contact" className="why-item btn btn-pri btn-lg inline-flex" data-popup="contact">
              Let&apos;s discuss today!
            </a>
          </div>

          <div className="lg:col-span-7 lg:col-start-6 grid grid-cols-1 gap-8">
            {items.map((item, i) => (
              <div key={i} className="why-item bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-bg to-secondary-bg flex items-center justify-center flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
