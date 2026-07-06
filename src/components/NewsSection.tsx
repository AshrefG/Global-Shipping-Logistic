"use client"

import { useEffect, useRef } from "react"
import { gsap, prefersReducedMotion } from "@/lib/gsap"

/*
  News & Media (#news) — real section replacing the interim footer anchor.
  Editorial teaser rows: mono date, tag, headline. Links stubbed to #news
  until the blog/CMS lands (Later-phase roadmap item).
*/

const POSTS = [
  {
    date: "2026-06-18",
    tag: "Network",
    title: "GSL opens the Milan–Tunis RO-RO corridor with daily departures",
    excerpt: "The new lane links our Lombardy hub with Tunis in under 40 hours, customs pre-cleared on the water.",
  },
  {
    date: "2026-05-02",
    tag: "Fleet",
    title: "First 20 low-emission tractors join the northern corridors",
    excerpt: "The renewal program starts on the Hamburg–Rotterdam lane, cutting CO₂ per kilometre by a third.",
  },
  {
    date: "2026-03-27",
    tag: "Product",
    title: "Emissions ledger ships: CO₂ per shipment on every invoice",
    excerpt: "Audit-ready carbon reporting is now standard for all FTL and LTL customers — no extra fee, no estimates.",
  },
]

export default function NewsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(".news-row", {
        y: 28,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="news" ref={sectionRef} className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-14">
          On the <span className="text-primary">record.</span>
        </h2>

        <div>
          {POSTS.map((post) => (
            <article key={post.title} className="news-row group grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 py-8 border-t border-line last:border-b hover:bg-white/[0.015] transition-colors">
              <div className="md:col-span-2 flex md:flex-col gap-3 md:gap-2">
                <time className="font-mono text-xs text-gray-500">{post.date}</time>
                <span className="font-mono text-xs text-primary">{post.tag.toUpperCase()}</span>
              </div>
              <div className="md:col-span-8">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 group-hover:text-primary transition-colors leading-snug max-w-2xl">
                  {post.title}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed max-w-xl">{post.excerpt}</p>
              </div>
              <div className="hidden md:flex md:col-span-2 items-start justify-end">
                <span className="font-mono text-xs text-gray-400 group-hover:text-primary transition-colors">READ →</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
