"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const problems = [
  {
    img: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=600",
    title: "Not reliable due to lack of resilience",
    desc: "One single incident such as a port strike or canal blockage shuts down major shipping routes, causing billions in damages within days.",
  },
  {
    img: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600",
    title: "Not sustainable",
    desc: "Ships run on heavy fuel oil, making global shipping responsible for nearly 1 Gigatonne of CO₂ emissions per year — more than all of Germany.",
  },
  {
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600",
    title: "Only for standard routes",
    desc: "Ultra-large vessels are cost-efficient on major routes, but 95% of ports lack the infrastructure for them. Smaller routes face twice the cost.",
  },
  {
    img: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=600",
    title: "Not customer-oriented",
    desc: "Serving thousands of customers with single vessels makes individualized routing and just-in-time delivery nearly impossible.",
  },
  {
    img: "https://images.unsplash.com/photo-1506521781265-d8422e82f27a?w=600",
    title: "Slow",
    desc: "98% of ports are not directly connected. Time-intensive stops and transshipments add unnecessary transportation time.",
  },
]

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return
      gsap.from(sectionRef.current.querySelectorAll(".problem-item"), {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
          <div className="lg:col-span-3">
            <div className="text-sm font-medium text-primary uppercase tracking-widest">Problem</div>
          </div>
          <div className="lg:col-span-9">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
              Ocean shipping is the backbone of global trade, but...
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <div key={i} className={`problem-item group cursor-pointer ${i === 0 ? "md:col-span-2 lg:col-span-2" : ""} ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}>
              <div className={`relative rounded-2xl overflow-hidden mb-4 ${i === 0 ? "aspect-[16/9]" : ""} ${i === 1 || i === 2 ? "aspect-square" : ""} ${i === 3 ? "aspect-[3/4]" : ""} ${i === 4 ? "aspect-[4/3]" : ""}`}>
                <img
                  src={p.img}
                  alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{p.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
