"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger, SplitText, EASE, DUR, STAGGER, prefersReducedMotion } from "@/lib/gsap"

/*
  Career (#career). Open roles as hairline rows with mono metadata; the whole
  row is a mailto.

  Enters under the canvas-coloured container doors (ContainerWipe in
  page.tsx), so the section sits on bg-dark for the doors to read, and the
  heading waits until the doors have rolled clear ("top 64%").
  Motion, once: heading lines rise, the sentence follows, the OPEN ROLES
  readout wipes in like a display; then rows arrive one by one, each hairline
  drawing left to right before its cells settle.
  Hover / focus: an amber marker rises at the row's left edge, the title steps
  in, the arrow leaves to the top right and a fresh one arrives from the
  bottom left.
  Reduced motion: no reveals; hover keeps the colour and marker, drops travel.
*/

const ROLES = [
  { title: "Heavy Vehicle Driver (HGV)", dept: "Fleet", loc: "Dubai (DIP-1)", type: "Full-time" },
  { title: "Operations Dispatcher", dept: "Ops", loc: "Dubai (DIP-1)", type: "Full-time" },
  { title: "Cold Store Supervisor", dept: "Warehousing", loc: "Dubai Industrial City", type: "Full-time" },
  { title: "Customs Clearance Specialist", dept: "Cross-border", loc: "Jebel Ali", type: "Full-time" },
  { title: "WMS & Systems Engineer", dept: "Engineering", loc: "Dubai / Hybrid", type: "Full-time" },
]

function Arrow({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M30.44 3.68L3 31.12.88 29l27.44-27.44L30.44 3.68z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M4.5 1.5h26v26h-3V4.5h-23v-3z" fill="currentColor" />
    </svg>
  )
}

const travel = "transition-transform duration-[400ms] ease-quint motion-reduce:transition-none"

export default function CareerSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = sectionRef.current
      if (!root || prefersReducedMotion()) return

      /* Heading block: after the doors */
      const head = root.querySelector<HTMLElement>("[data-career-head]")
      const title = root.querySelector<HTMLElement>("[data-career-title]")
      const lede = root.querySelector<HTMLElement>("[data-career-lede]")
      const readout = root.querySelector<HTMLElement>("[data-career-readout]")
      const headStart = "top 64%"

      let split: SplitText | null = null
      if (head && title) {
        split = SplitText.create(title, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.9,
              ease: EASE.enter,
              stagger: STAGGER.line,
              scrollTrigger: { trigger: head, start: headStart, toggleActions: "play none none none" },
            }),
        })
      }

      if (head && lede && readout) {
        gsap
          .timeline({ scrollTrigger: { trigger: head, start: headStart, toggleActions: "play none none none" } })
          .from(lede, { y: 20, opacity: 0, duration: DUR.reveal, ease: EASE.enter, clearProps: "transform,opacity" }, 0.22)
          .fromTo(
            readout,
            { clipPath: "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: EASE.enterSoft, clearProps: "clipPath" },
            0.42,
          )
          .from(readout.querySelector("[data-readout-dot]"), { scale: 0, duration: 0.5, ease: EASE.enter }, 0.9)
      }

      /* Rows: hairline draws, then the cells settle; row by row */
      const rows = gsap.utils.toArray<HTMLElement>("[data-role-row]", root)
      rows.forEach((row) => {
        gsap.set(row.querySelectorAll("[data-row-line]"), { scaleX: 0 })
        gsap.set(row.querySelectorAll("[data-row-cell]"), { y: 16, opacity: 0 })
      })

      // Rows trigger a little higher than usual so the first one never lands
      // before the heading (which waits for the doors at "top 64%").
      ScrollTrigger.batch(rows, {
        start: "top 80%",
        once: true,
        interval: 0.12,
        onEnter: (batch) => {
          batch.forEach((row, i) => {
            const at = i * 0.09
            gsap
              .timeline({ delay: at })
              .to(row.querySelectorAll("[data-row-line]"), {
                scaleX: 1,
                duration: 0.9,
                ease: EASE.enter,
                stagger: 0.25,
              })
              .to(
                row.querySelectorAll("[data-row-cell]"),
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.7,
                  ease: EASE.enter,
                  stagger: 0.05,
                  clearProps: "transform,opacity",
                },
                0.12,
              )
          })
        },
      })

      return () => split?.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section id="career" ref={sectionRef} className="py-24 md:py-32 bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div data-career-head className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <h2
              data-career-title
              className="font-display text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight"
            >
              Drive the <span className="text-primary">shift.</span>
            </h2>
            <p data-career-lede className="mt-4 text-gray-600 text-lg max-w-md">
              We hire people who like moving real things in the real world:
              on the road, in the hubs, and in the codebase.
            </p>
          </div>
          <div
            data-career-readout
            className="inline-flex items-center gap-2.5 self-start md:self-auto font-mono text-xs tracking-[0.15em] text-gray-500"
          >
            <span data-readout-dot aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
            {ROLES.length} OPEN ROLES
          </div>
        </div>

        <div>
          {ROLES.map((role, i) => (
            <a
              key={role.title}
              data-role-row
              href={`mailto:info@gsldubai.com?subject=${encodeURIComponent(`Application: ${role.title}`)}`}
              className="group relative grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center py-6 no-underline transition-colors duration-[var(--t-hover)] hover:bg-white/[0.015] focus-visible:bg-white/[0.015]"
            >
              {/* hairlines: drawn by GSAP, full width by default */}
              <span data-row-line aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-line" />
              {i === ROLES.length - 1 && (
                <span data-row-line aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-line" />
              )}
              {/* amber lane marker */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-4 bottom-4 w-[2px] origin-center scale-y-0 bg-primary transition-transform duration-[var(--t-ui)] ease-quint group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none"
              />

              <h3
                data-row-cell
                className={`md:col-span-5 text-lg md:text-xl font-semibold text-gray-900 group-hover:text-primary group-focus-visible:text-primary transition-[color,transform] duration-[var(--t-ui)] ease-quint group-hover:translate-x-4 group-focus-visible:translate-x-4 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0`}
              >
                {role.title}
              </h3>
              <span data-row-cell className="md:col-span-2 font-mono text-xs text-gray-500">{role.dept.toUpperCase()}</span>
              <span data-row-cell className="md:col-span-3 text-sm text-gray-600">{role.loc}</span>
              <span data-row-cell className="md:col-span-1 whitespace-nowrap text-sm text-gray-500">{role.type}</span>
              <span data-row-cell className="hidden md:flex md:col-span-1 justify-end">
                <span className="relative block h-[18px] w-[18px] overflow-hidden text-gray-500 transition-colors duration-[var(--t-hover)] group-hover:text-primary group-focus-visible:text-primary">
                  <Arrow className={`block ${travel} group-hover:translate-x-[120%] group-hover:-translate-y-[120%] group-focus-visible:translate-x-[120%] group-focus-visible:-translate-y-[120%]`} />
                  <Arrow className={`absolute inset-0 -translate-x-[120%] translate-y-[120%] ${travel} group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0`} />
                </span>
              </span>
            </a>
          ))}
        </div>

        <p className="mt-10 text-sm text-gray-500">
          Nothing that fits?{" "}
          <a
            href="mailto:info@gsldubai.com"
            className="group/open inline-flex items-center gap-1 py-2 -my-2 text-primary hover:text-primary-dark transition-colors duration-[var(--t-hover)] no-underline font-medium"
          >
            Send an open application
            <span aria-hidden="true" className={`inline-block ${travel} group-hover/open:translate-x-1`}>→</span>
          </a>
        </p>
      </div>
    </section>
  )
}
