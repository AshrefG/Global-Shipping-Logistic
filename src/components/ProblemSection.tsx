"use client"

import { useEffect, useRef } from "react"
import { gsap, prefersReducedMotion } from "@/lib/gsap"
import CountUp from "@/components/motion/CountUp"

/*
  Problem — the pain of legacy road freight (Phase 3).
  Typographic pain rows with hairline dividers + a dark stat band in the
  mono telemetry voice. No image grid, no identical cards.
*/

const PAINS = [
  {
    title: "Black-hole tracking",
    desc: "“Where is my truck?” still takes three phone calls and a spreadsheet. Most forwarders go dark between pickup and delivery.",
  },
  {
    title: "Fragmented handoffs",
    desc: "Broker to carrier to subcontractor — every handoff adds cost, delay and someone else to blame when cargo is late.",
  },
  {
    title: "Empty kilometres",
    desc: "Trucks run partly or fully empty on return legs. You pay for the waste, and so does the climate.",
  },
  {
    title: "Borders on paper",
    desc: "Customs still runs on printed CMRs and waiting bays. A single missing stamp strands a trailer for a day.",
  },
  {
    title: "Rigid schedules",
    desc: "Fixed departures built for the carrier's convenience, not your production line. Just-in-time becomes just-hope.",
  },
]

const STATS = [
  { value: 25, suffix: "%", label: "of EU truck-km run empty" },
  { value: 43, suffix: "h", label: "avg. dwell lost at borders / mo" },
  { value: 3, suffix: "+", label: "middlemen on a typical load" },
  { value: 70, suffix: "%", label: "of shippers lack live ETA" },
]

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".problem-row", sectionRef.current).forEach((row) => {
        gsap.from(row, {
          y: 36,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 85%" },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight max-w-3xl mb-6">
          Road freight moves 70% of Europe&apos;s goods.
          <span className="text-gray-400"> It still runs like 1995.</span>
        </h2>

        {/* Stat band — the cost of the status quo */}
        <div className="mt-14 mb-20 rounded-2xl bg-dark border border-line grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={i} className={`px-7 py-8 ${i > 0 ? "border-l border-white/5" : ""}`}>
              <div className="font-mono text-3xl md:text-4xl font-bold text-primary">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.12em] text-white/45 leading-relaxed">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Pain rows */}
        <div>
          {PAINS.map((p, i) => (
            <div
              key={i}
              className="problem-row group grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 py-8 border-t border-line last:border-b hover:bg-white/[0.015] transition-colors"
            >
              <h3 className="md:col-span-4 text-xl md:text-2xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {p.title}
              </h3>
              <p className="md:col-span-6 text-gray-600 leading-relaxed max-w-xl">{p.desc}</p>
              <div className="hidden md:flex md:col-span-2 items-start justify-end">
                <span className="font-mono text-xs text-gray-400 group-hover:text-primary transition-colors">
                  FAULT {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
