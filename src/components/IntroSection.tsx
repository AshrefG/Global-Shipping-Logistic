"use client"

import TextReveal from "@/components/motion/TextReveal"
import CountUp from "@/components/motion/CountUp"

/*
  About — typographic manifesto (Phase 3). No cards, no imagery:
  the statement carries the section, revealed line by line on scroll.
*/

export default function IntroSection() {
  return (
    <section id="about" className="py-28 md:py-40 bg-canvas">
      <div className="max-w-7xl mx-auto px-6">
        <TextReveal
          as="h2"
          className="font-display text-3xl md:text-5xl lg:text-[3.4rem] font-bold text-gray-900 leading-[1.15] tracking-tight max-w-5xl"
          stagger={0.08}
        >
          GSL is a third-party logistics company from Dubai, part of the{" "}
          <span className="text-primary">Al Shirawi Group.</span> Freight
          forwarding, customs, transport, cold chain and distribution —{" "}
          <span className="text-primary">door-to-door, tracked live.</span>{" "}
          Our roots run back to 1975, and we&apos;ve been driven by one thing
          ever since: you.
        </TextReveal>

        <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-y-10 border-t border-line pt-10">
          <div>
            <div className="font-mono text-3xl md:text-4xl font-bold text-white">
              <CountUp value={1975} grouping={false} />
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.13em] text-gray-500">Freight roots · UAE</div>
          </div>
          <div>
            <div className="font-mono text-3xl md:text-4xl font-bold text-white">
              <CountUp value={5} />
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.13em] text-gray-500">Quality certifications</div>
          </div>
          <div>
            <div className="font-mono text-3xl md:text-4xl font-bold text-white">
              <CountUp value={9} />
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.13em] text-gray-500">Industries served</div>
          </div>
          <div>
            <div className="font-mono text-3xl md:text-4xl font-bold text-white">
              −<CountUp value={25} />°C
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.13em] text-gray-500">Cold chain floor</div>
          </div>
        </div>
      </div>
    </section>
  )
}
