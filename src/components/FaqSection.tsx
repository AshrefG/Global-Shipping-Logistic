"use client"

import { useId, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger, EASE, DUR, STAGGER, prefersReducedMotion } from "@/lib/gsap"
import TextReveal from "@/components/motion/TextReveal"

/*
  FAQ: hairline lane dividers, road-freight answers.
  Entrance (once): the heading rises line by line from its mask, then the
  questions arrive row by row, each lane divider painting left to right
  under its question. Accordion opens with grid-template-rows 0fr to 1fr
  (real content height, no max-height guess). Reduced motion: everything
  is in place at once and the accordion snaps open.
*/

const faqs = [
  {
    q: "Where do you operate?",
    a: "We're headquartered at Green Community, Dubai Investment Park (DIP-1), with our cold chain campus in Dubai Industrial City. Transport and distribution cover the whole UAE, cross-border corridors reach across the GCC, and freight forwarding connects you worldwide.",
  },
  {
    q: "What temperatures can your cold chain handle?",
    a: "Ambient, cool (+15°C to +25°C) and chilled-to-frozen chambers down to −25°C, all under one roof, with continuous SCADA temperature and humidity monitoring, temperature-controlled docks, and BRCGS plus ISO 22000 certification behind every pallet.",
  },
  {
    q: "How does live tracking work?",
    a: "Every truck streams GPS position and door events; cold chain shipments stream temperature too. You get a live map, automatic ETA updates, and a customer portal with order entry and BI reporting, or webhooks and EDI straight into your ERP.",
  },
  {
    q: "What happens at ports and borders?",
    a: "Documents travel ahead of the cargo. Our in-house customs team files import, export and transit declarations before arrival, so containers clear Jebel Ali and trucks cross Ghuweifat without waiting on paperwork.",
  },
  {
    q: "What makes GSL different from other 3PLs?",
    a: "We're part of Al Shirawi Group with freight-forwarding roots since 1975, we own our warehouses and fleet rather than brokering yours, and we hold five quality certifications, ISO 9001, 14001, 22000, 45001 and BRCGS, audited externally every year.",
  },
  {
    q: "I ship a few pallets a week. Am I too small?",
    a: "No. Shared warehousing and consolidated distribution exist exactly for that: you pay for the pallet positions and drops you use, with the same tracking, portal and single point of contact as our largest accounts.",
  },
  {
    q: "Can you handle in-store work too?",
    a: "Yes, stocktaking and merchandising are part of the service: cyclical counts, shelf-ready preparation and in-store teams that keep your inventory truth in sync with your system, from our warehouse to your shop floor.",
  },
]

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const baseId = useId()

  useGSAP(
    () => {
      const root = sectionRef.current
      if (!root || prefersReducedMotion()) return

      const aside = root.querySelectorAll<HTMLElement>("[data-faq-aside]")
      gsap.set(aside, { y: 20, opacity: 0 })
      ScrollTrigger.create({
        trigger: root,
        start: "top 70%",
        once: true,
        onEnter: () =>
          gsap.to(aside, {
            y: 0,
            opacity: 1,
            duration: DUR.reveal,
            ease: EASE.enter,
            delay: 0.15,
            clearProps: "transform,opacity",
          }),
      })

      const rows = gsap.utils.toArray<HTMLElement>(".faq-item", root)
      rows.forEach((row) => {
        gsap.set(row.querySelector(".faq-item__head"), { y: 18, opacity: 0 })
        gsap.set(row.querySelector(".faq-item__rule"), { scaleX: 0 })
      })
      ScrollTrigger.batch(rows, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          const tl = gsap.timeline()
          batch.forEach((row, i) => {
            const at = i * STAGGER.item
            tl.to(
              row.querySelector(".faq-item__head"),
              { y: 0, opacity: 1, duration: 0.7, ease: EASE.enter, clearProps: "transform,opacity" },
              at,
            ).to(
              row.querySelector(".faq-item__rule"),
              { scaleX: 1, duration: 0.9, ease: EASE.enter, clearProps: "transform" },
              at + 0.05,
            )
          })
        },
      })
    },
    { scope: sectionRef },
  )

  return (
    <section id="faq" ref={sectionRef} className="py-24 md:py-32 bg-canvas">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <TextReveal
              as="h2"
              start="top 80%"
              className="font-display text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight"
            >
              Questions, <span className="text-primary">answered.</span>
            </TextReveal>
          </div>
          <div data-faq-aside className="lg:col-span-4 lg:col-start-9 lg:text-right">
            <p className="text-gray-600 text-sm mb-2">Can&apos;t find what you&apos;re looking for?</p>
            <a
              href="mailto:info@gsldubai.com"
              className="text-primary font-medium hover:text-primary-dark transition-colors no-underline"
            >
              info@gsldubai.com
            </a>
          </div>
        </div>

        <div className="max-w-4xl">
          {faqs.map((faq, i) => {
            const open = activeIndex === i
            const headId = `${baseId}-q${i}`
            const panelId = `${baseId}-a${i}`
            return (
              <div key={i} className={`faq-item ${open ? "active" : ""}`}>
                <h3 className="m-0">
                  <button
                    type="button"
                    id={headId}
                    className="faq-item__head w-full text-left bg-transparent border-0 cursor-pointer"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setActiveIndex(open ? null : i)}
                  >
                    <span className="faq-item__q flex-1 text-base md:text-lg font-medium text-gray-900">{faq.q}</span>
                    <span className="faq-item__icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1.5v13M1.5 8h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={headId} className="faq-item__body">
                  <div className="faq-item__inner" inert={!open}>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl pb-6">{faq.a}</p>
                  </div>
                </div>
                <span className="faq-item__rule" aria-hidden="true" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
