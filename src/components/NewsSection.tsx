"use client"

import { useEffect, useRef } from "react"
import { gsap, EASE, prefersReducedMotion } from "@/lib/gsap"

/*
  News & Media (#news) — editorial teaser rows with a cursor image trail:
  while hovering a row, images spawn along the pointer path, tilt in and
  dissolve. Desktop fine-pointer only; reduced motion gets rows only.
  Links stubbed to #news until the blog/CMS lands (roadmap: Later).
*/

const POSTS = [
  {
    date: "2026-06-18",
    tag: "Network",
    title: "GSL opens the Milan–Tunis RO-RO corridor with daily departures",
    excerpt: "The new lane links our Lombardy hub with Tunis in under 40 hours, customs pre-cleared on the water.",
    img: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=480&q=70",
  },
  {
    date: "2026-05-02",
    tag: "Fleet",
    title: "First 20 low-emission tractors join the northern corridors",
    excerpt: "The renewal program starts on the Hamburg–Rotterdam lane, cutting CO₂ per kilometre by a third.",
    img: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=480&q=70",
  },
  {
    date: "2026-03-27",
    tag: "Product",
    title: "Emissions ledger ships: CO₂ per shipment on every invoice",
    excerpt: "Audit-ready carbon reporting is now standard for all FTL and LTL customers — no extra fee, no estimates.",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=480&q=70",
  },
]

const SPAWN_DISTANCE = 90 // px of pointer travel between images

export default function NewsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  // Entrance reveal
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

  // Cursor image trail
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (prefersReducedMotion()) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    // warm the cache so the first spawn isn't blank
    POSTS.forEach((p) => {
      const img = new Image()
      img.src = p.img
    })

    const last = { x: -9999, y: -9999 }
    const live = new Set<HTMLImageElement>()

    const spawn = (src: string, x: number, y: number) => {
      const el = document.createElement("img")
      el.src = src
      el.alt = ""
      el.setAttribute("aria-hidden", "true")
      el.className = "news-trail-img"
      el.style.left = `${x}px`
      el.style.top = `${y}px`
      section.appendChild(el)
      live.add(el)

      const rot = gsap.utils.random(-9, 9)
      gsap.fromTo(
        el,
        { xPercent: -50, yPercent: -50, scale: 0.45, opacity: 0, rotation: rot * 1.6 },
        { scale: 1, opacity: 1, rotation: rot, duration: 0.45, ease: EASE.enter },
      )
      gsap.to(el, {
        opacity: 0,
        scale: 0.92,
        yPercent: -38,
        duration: 0.55,
        delay: 0.4,
        ease: "power2.in",
        onComplete: () => {
          live.delete(el)
          el.remove()
        },
      })
    }

    const rows = Array.from(section.querySelectorAll<HTMLElement>(".news-row"))
    const handlers = rows.map((row, i) => {
      const onMove = (e: MouseEvent) => {
        const dx = e.clientX - last.x
        const dy = e.clientY - last.y
        if (Math.hypot(dx, dy) < SPAWN_DISTANCE) return
        last.x = e.clientX
        last.y = e.clientY
        const rect = section.getBoundingClientRect()
        spawn(POSTS[i].img, e.clientX - rect.left, e.clientY - rect.top)
      }
      row.addEventListener("mousemove", onMove)
      return { row, onMove }
    })

    return () => {
      handlers.forEach(({ row, onMove }) => row.removeEventListener("mousemove", onMove))
      live.forEach((el) => {
        gsap.killTweensOf(el)
        el.remove()
      })
      live.clear()
    }
  }, [])

  return (
    <section id="news" ref={sectionRef} className="relative py-24 md:py-32 bg-gray-50 overflow-hidden">
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
