"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const faqs = [
  {
    q: "Do you handle all types of cargo?",
    a: "Our primary focus is container shipping. However, our logistics platform can be adapted for bulk, break-bulk, and project cargo. Reach out to learn more about your specific requirements.",
  },
  {
    q: "What if my cargo needs special handling?",
    a: "We offer customized solutions for special cargo including refrigerated containers, hazardous materials, and oversized cargo. Our team will work with you to ensure safe and efficient transport.",
  },
  {
    q: "Are your services already operational?",
    a: "Yes, we are fully operational across major European and trans-Atlantic routes. We are continuously expanding our network and will start new routes in Q3 2024.",
  },
  {
    q: "How do you ensure on-time delivery?",
    a: "We use advanced route planning tools and real-time tracking to optimize every journey. Our system analyzes weather data, port congestion, and optimal routing to ensure just-in-time delivery.",
  },
  {
    q: "What makes your approach more sustainable?",
    a: "We optimize routes to minimize fuel consumption, utilize efficient port operations to reduce idle time, and partner with green fuel providers. Our goal is to reduce emissions by up to 70% compared to conventional shipping.",
  },
  {
    q: "I&apos;m a cargo owner. How do I benefit from GSL?",
    a: "You benefit three ways: (i) lower supply chain emissions (ii) faster, more reliable delivery (iii) reduced inventory costs through better transparency and just-in-time delivery.",
  },
  {
    q: "I&apos;m a shipping company. Why partner with GSL?",
    a: "Our logistics platform helps you optimize fleet utilization, reduce operational costs by up to 12%, and offer better service to your customers while ensuring compliance with emission regulations.",
  },
]

export default function FaqSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return
      gsap.from(sectionRef.current.querySelectorAll(".faq-title-el"), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const toggle = (i: number) => {
    setActiveIndex(activeIndex === i ? null : i)
  }

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5 faq-title-el">
            <div className="text-sm font-medium text-primary uppercase tracking-widest mb-4">FAQ</div>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">Quick answers to questions you may have</h2>
          </div>
          <div className="lg:col-span-3 lg:col-start-8 faq-title-el">
            <p className="text-gray-600 text-sm mb-2">Can&apos;t find what you&apos;re looking for?</p>
            <a href="mailto:info@globalshipping-logistics.com" className="text-secondary font-medium hover:text-primary transition-colors no-underline">
              info@globalshipping-logistics.com
            </a>
          </div>
        </div>

        <div className="max-w-4xl">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item ${activeIndex === i ? "active" : ""}`}
              onClick={() => toggle(i)}
            >
              <div className="faq-item__head">
                <div className="flex-1 text-base font-medium text-gray-900">{faq.q}</div>
                <div className="faq-item__icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1.5v13M1.5 8h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="faq-item__body">
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
