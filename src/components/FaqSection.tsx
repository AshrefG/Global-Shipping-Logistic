"use client"

import { useState } from "react"

/*
  FAQ — refined accordion (Phase 3): hairline dividers, smooth height,
  road-freight answers. Buttons + aria for keyboard access.
*/

const faqs = [
  {
    q: "What lanes do you cover?",
    a: "Our core network is 40+ corridors across Europe and between Europe and North Africa (including Tunisia via RO-RO). If your lane isn't listed, ask — the network grows where our customers ship.",
  },
  {
    q: "Do you handle temperature-controlled or special cargo?",
    a: "Yes. Reefer trailers with live temperature telemetry, ADR-certified units for hazardous goods, and open plans for oversized loads. Every special requirement is confirmed in the quote, not discovered at the dock.",
  },
  {
    q: "How does live tracking work?",
    a: "Every truck streams GPS position, door events and (for reefers) temperature. You get a live map, automatic ETA updates within ±15 minutes, and webhooks or EDI straight into your ERP — no phone calls, no spreadsheets.",
  },
  {
    q: "What happens at borders?",
    a: "Documents travel ahead of the truck. e-CMR, T1 transit and customs declarations are filed digitally and pre-cleared before arrival, so the trailer rolls through instead of waiting in a bay.",
  },
  {
    q: "How do you cut emissions on the road?",
    a: "Consolidation fills trailers instead of running them empty, AI routing avoids congestion idling, and the fleet renews toward low-emission tractors. Every invoice reports CO₂ per shipment, so the reduction is measurable, not marketing.",
  },
  {
    q: "I ship a few pallets a week — am I too small?",
    a: "No. That's exactly what LTL is for: you pay for pallet slots, we fill the rest of the trailer. You get the same tracking, the same ETAs and the same single point of contact as an FTL customer.",
  },
  {
    q: "I'm a carrier. Can I join the network?",
    a: "We partner with owner-operators and mid-size fleets on selected corridors. You get steady volume, fast payment terms and our telematics kit — write to us and tell us where your trucks run.",
  },
]

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              Questions, <span className="text-primary">answered.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:text-right">
            <p className="text-gray-600 text-sm mb-2">Can&apos;t find what you&apos;re looking for?</p>
            <a
              href="mailto:info@globalshipping-logistics.com"
              className="text-primary font-medium hover:text-primary-dark transition-colors no-underline"
            >
              info@globalshipping-logistics.com
            </a>
          </div>
        </div>

        <div className="max-w-4xl">
          {faqs.map((faq, i) => {
            const open = activeIndex === i
            return (
              <div key={i} className={`faq-item ${open ? "active" : ""}`}>
                <button
                  type="button"
                  className="faq-item__head w-full text-left bg-transparent border-0 cursor-pointer"
                  aria-expanded={open}
                  onClick={() => setActiveIndex(open ? null : i)}
                >
                  <span className="flex-1 text-base md:text-lg font-medium text-gray-900">{faq.q}</span>
                  <span className={`faq-item__icon ${open ? "text-primary" : "text-gray-500"}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1.5v13M1.5 8h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <div className="faq-item__body">
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl">{faq.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
