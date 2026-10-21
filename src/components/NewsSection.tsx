"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, SplitText, EASE, DUR, STAGGER, prefersReducedMotion } from "@/lib/gsap"

/*
  News & Media (#news). Editorial teaser rows with a hover preview: one
  frame, anchored to the hovered row (never to the cursor), opens with a
  clip wipe, then glides to the next row and crossfades its picture as the
  pointer moves down the list. Desktop fine pointer only; touch and reduced
  motion get the rows alone.
  Links stubbed to #news until the blog/CMS lands (roadmap: Later).

  Entered from Career by the lane-marking seam. Motion, once:
  the heading rises line by line; then each row runs its own short sequence
  as it reaches the lower edge of the screen: hairline paints across, date
  and tag slide in from the margin, the title lines rise from their masks,
  the excerpt and READ follow.
  Hover: title turns amber, READ underlines left to right and its arrow
  steps forward.
  Reduced motion: no reveals, no preview; hover keeps colour, drops travel.
*/

const POSTS = [
  {
    date: "2026-06-18",
    tag: "Network",
    title: "Daily Dubai–Riyadh linehaul departures now live from DIP-1",
    excerpt: "The core GCC corridor gets fixed daily departures, customs pre-cleared before Ghuweifat.",
    img: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=480&q=70",
  },
  {
    date: "2026-05-02",
    tag: "Cold chain",
    title: "Frozen capacity expands at the Dubai Industrial City campus",
    excerpt: "New −25°C chambers with SCADA monitoring and temperature-controlled docks join the cold chain network.",
    img: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=480&q=70",
  },
  {
    date: "2026-03-27",
    tag: "Quality",
    title: "All five certifications renewed under LRQA external audit",
    excerpt: "ISO 9001, 14001, 22000, 45001 and BRCGS: renewed in a single audit cycle, as every year since 2008.",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=480&q=70",
  },
]

/** Masked line rise that re-splits on resize / font load and keeps its progress. */
function riseLines(el: HTMLElement, trigger: Element, start: string, delay = 0) {
  return SplitText.create(el, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 110,
        duration: 0.9,
        ease: EASE.enter,
        stagger: STAGGER.line,
        delay,
        scrollTrigger: { trigger, start, toggleActions: "play none none none" },
      }),
  })
}

export default function NewsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  // Entrance choreography
  useGSAP(
    () => {
      const root = sectionRef.current
      if (!root || prefersReducedMotion()) return

      const splits: SplitText[] = []
      const heading = root.querySelector<HTMLElement>("[data-news-title]")
      if (heading) splits.push(riseLines(heading, heading, "top 82%"))

      gsap.utils.toArray<HTMLElement>(".news-row", root).forEach((row) => {
        const start = "top 86%"
        const title = row.querySelector<HTMLElement>("[data-news-row-title]")
        if (title) splits.push(riseLines(title, row, start, 0.14))

        gsap
          .timeline({ scrollTrigger: { trigger: row, start, toggleActions: "play none none none" } })
          .fromTo(
            row.querySelectorAll("[data-row-line]"),
            { scaleX: 0 },
            { scaleX: 1, duration: 1, ease: EASE.enter, stagger: 0.3 },
            0,
          )
          .from(
            row.querySelectorAll("[data-news-meta] > *"),
            { x: -14, opacity: 0, duration: 0.7, ease: EASE.enter, stagger: 0.06, clearProps: "transform,opacity" },
            0.06,
          )
          .from(
            row.querySelectorAll("[data-news-after]"),
            { y: 14, opacity: 0, duration: DUR.reveal, ease: EASE.enter, stagger: 0.08, clearProps: "transform,opacity" },
            0.3,
          )
      })

      return () => splits.forEach((s) => s.revert())
    },
    { scope: sectionRef },
  )

  // Hover preview, anchored to the row (desktop fine pointer, motion allowed)
  useGSAP(
    () => {
      const section = sectionRef.current
      const list = section?.querySelector<HTMLElement>("[data-news-list]")
      const frame = section?.querySelector<HTMLElement>("[data-news-preview]")
      if (!section || !list || !frame) return
      if (prefersReducedMotion()) return
      if (!window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches) return

      // warm the cache so the first open is never a blank frame
      POSTS.forEach((p) => {
        new Image().src = p.img
      })

      const layers = Array.from(frame.querySelectorAll<HTMLImageElement>("img"))
      let front = 0
      let current = -1
      let open = false

      // centre the frame on the row, kept inside the list
      const yFor = (row: HTMLElement) =>
        gsap.utils.clamp(
          0,
          Math.max(0, list.offsetHeight - frame.offsetHeight),
          row.offsetTop + row.offsetHeight / 2 - frame.offsetHeight / 2,
        )

      const show = (row: HTMLElement, i: number) => {
        if (i === current) return
        current = i
        const y = yFor(row)

        if (!open) {
          open = true
          layers[front].src = POSTS[i].img
          gsap.set(layers, { opacity: (k: number) => (k === front ? 1 : 0) })
          gsap.set(frame, { y })
          gsap.fromTo(
            frame,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: EASE.enter, overwrite: "auto" },
          )
          gsap.fromTo(layers[front], { scale: 1.08 }, { scale: 1, duration: 0.9, ease: EASE.enter })
          return
        }

        // already open: glide to the new row and crossfade the picture
        gsap.to(frame, { y, duration: 0.45, ease: "power3.out", overwrite: "auto" })
        const next = 1 - front
        layers[next].src = POSTS[i].img
        gsap.to(layers[next], { opacity: 1, duration: 0.3, ease: "none", overwrite: "auto" })
        gsap.to(layers[front], { opacity: 0, duration: 0.3, ease: "none", overwrite: "auto" })
        front = next
      }

      const hide = () => {
        if (!open) return
        open = false
        current = -1
        gsap.to(frame, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.35, ease: EASE.exit, overwrite: "auto" })
      }

      const rows = Array.from(list.querySelectorAll<HTMLElement>(".news-row"))
      const handlers = rows.map((row, i) => {
        const onEnter = (e: PointerEvent) => {
          if (e.pointerType === "mouse") show(row, i)
        }
        row.addEventListener("pointerenter", onEnter)
        return { row, onEnter }
      })
      list.addEventListener("pointerleave", hide)

      return () => {
        handlers.forEach(({ row, onEnter }) => row.removeEventListener("pointerenter", onEnter))
        list.removeEventListener("pointerleave", hide)
      }
    },
    { scope: sectionRef },
  )

  return (
    <section id="news" ref={sectionRef} className="relative py-24 md:py-32 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2
          data-news-title
          className="font-display text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-14"
        >
          On the <span className="text-primary">record.</span>
        </h2>

        <div data-news-list className="relative">
          {/* Hover preview frame: decorative, opened by GSAP on desktop only */}
          <div
            data-news-preview
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-28 z-10 hidden lg:block w-[min(21%,260px)] aspect-[3/2] overflow-hidden rounded-xl bg-surface"
            style={{ clipPath: "inset(100% 0% 0% 0%)" }}
          >
            {[0, 1].map((k) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={k} src={POSTS[0].img} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ))}
          </div>

          {POSTS.map((post, i) => (
            <article
              key={post.title}
              className="news-row group relative grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 py-8 transition-colors duration-[var(--t-hover)] hover:bg-white/[0.015]"
            >
              {/* hairlines: painted by GSAP, full width by default */}
              <span data-row-line aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-line" />
              {i === POSTS.length - 1 && (
                <span data-row-line aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-line" />
              )}

              <div data-news-meta className="md:col-span-2 flex md:flex-col gap-3 md:gap-2">
                <time dateTime={post.date} className="font-mono text-xs text-gray-500">{post.date}</time>
                <span className="font-mono text-xs text-primary">{post.tag.toUpperCase()}</span>
              </div>
              <div className="md:col-span-8 lg:col-span-6">
                <h3
                  data-news-row-title
                  className="text-xl md:text-2xl font-semibold text-gray-900 group-hover:text-primary transition-colors duration-[var(--t-hover)] leading-snug max-w-2xl"
                >
                  {post.title}
                </h3>
                <p data-news-after className="mt-3 text-gray-600 leading-relaxed max-w-xl lg:max-w-lg">{post.excerpt}</p>
              </div>
              <div data-news-after className="hidden md:flex md:col-span-2 lg:col-start-11 items-start justify-end">
                <span className="inline-flex items-center gap-1.5 pr-1.5 font-mono text-xs text-gray-400 transition-colors duration-[var(--t-hover)] group-hover:text-primary">
                  <span className="relative pb-1">
                    READ
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-[400ms] ease-quint group-hover:scale-x-100 motion-reduce:transition-none"
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-block pb-1 transition-transform duration-[400ms] ease-quint group-hover:translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  >
                    →
                  </span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
