"use client"

import { useState } from "react"

/*
  FAQ — refined accordion (Phase 3): hairline dividers, smooth height,
  road-freight answers. Buttons + aria for keyboard access.
*/

const faqs = [
  {
    q: "Where do you operate?",
    a: "We're headquartered in Dubai — Green Community, Dubai Investment Park (DIP-1), with our cold chain campus in Dubai Industrial City. Transport and distribution cover the whole UAE, cross-border corridors reach across the GCC, and freight forwarding connects you worldwide.",
  },
  {
    q: "What temperatures can your cold chain handle?",
    a: "Ambient, cool (+15°C to +25°C) and chilled-to-frozen chambers down to −25°C — all under one roof, with continuous SCADA temperature and humidity monitoring, temperature-controlled docks, and BRCGS plus ISO 22000 certification behind every pallet.",
  },
  {
    q: "How does live tracking work?",
    a: "Every truck streams GPS position and door events; cold chain shipments stream temperature too. You get a live map, automatic ETA updates, and a customer portal with order entry and BI reporting — or webhooks and EDI straight into your ERP.",
  },
  {
    q: "What happens at ports and borders?",
    a: "Documents travel ahead of the cargo. Our in-house customs team files import, export and transit declarations before arrival, so containers clear Jebel Ali and trucks cross Ghuweifat without waiting on paperwork.",
  },
  {
    q: "What makes GSL different from other 3PLs?",
    a: "We're part of Al Shirawi Group with freight-forwarding roots since 1975, we own our warehouses and fleet rather than brokering yours, and we hold five quality certifications — ISO 9001, 14001, 22000, 45001 and BRCGS — audited externally every year.",
  },
  {
    q: "I ship a few pallets a week — am I too small?",
    a: "No. Shared warehousing and consolidated distribution exist exactly for that: you pay for the pallet positions and drops you use, with the same tracking, portal and single point of contact as our largest accounts.",
  },
  {
    q: "Can you handle in-store work too?",
    a: "Yes — stocktaking and merchandising are part of the service: cyclical counts, shelf-ready preparation and in-store teams that keep your inventory truth in sync with your system, from our warehouse to your shop floor.",
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
