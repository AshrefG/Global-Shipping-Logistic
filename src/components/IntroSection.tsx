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
          GSL is a road-freight company from Hamburg. We run FTL, LTL and
          cross-border corridors across Europe and North Africa —{" "}
          <span className="text-primary">door-to-door, tracked live,</span>{" "}
          with lower emissions per kilometre. Founded in 2022 to prove that
          land transport is where logistics is won.
        </TextReveal>

        <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-y-10 border-t border-line pt-10">
          <div>
            <div className="font-mono text-3xl md:text-4xl font-bold text-white">
              <CountUp value={2022} grouping={false} />
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.13em] text-gray-500">Founded · Hamburg</div>
          </div>
          <div>
            <div className="font-mono text-3xl md:text-4xl font-bold text-white">
              <CountUp value={40} suffix="+" />
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.13em] text-gray-500">Active corridors</div>
          </div>
          <div>
            <div className="font-mono text-3xl md:text-4xl font-bold text-white">
              <CountUp value={1.4} decimals={1} suffix="M km" />
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.13em] text-gray-500">Driven monthly</div>
          </div>
          <div>
            <div className="font-mono text-3xl md:text-4xl font-bold text-white">
              <CountUp value={98.6} decimals={1} suffix="%" />
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.13em] text-gray-500">On-time delivery</div>
          </div>
        </div>
      </div>
    </section>
  )
}
