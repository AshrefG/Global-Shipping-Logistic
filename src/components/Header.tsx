"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { gsap, EASE, prefersReducedMotion } from "@/lib/gsap"
import Logo from "@/components/Logo"

const navLinks = [
  { label: "Home.", href: "#" },
  { label: "About us.", href: "#about" },
  { label: "Services.", href: "#services" },
  { label: "Technology.", href: "#tech" },
  { label: "Career.", href: "#career" },
  { label: "News & Media.", href: "#news" },
]

// Sections that light the amber active dot in the nav
const trackedIds = ["about", "services", "tech", "career", "news"]

/*
  Header (DESIGN.md nav): transparent over the hero, asphalt + blur once
  scrolled. Slides away while reading down and returns on the first scroll
  up (never near the top, while the mobile menu is open or while focus is
  inside it). The link of the section under the reading line carries an
  amber dot. Reduced motion: the header simply stays put.
*/
export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const allowHide = !prefersReducedMotion()
    let lastY = window.scrollY
    let frame = 0

    const update = () => {
      frame = 0
      const y = window.scrollY
      setScrolled(y > 50)

      // Direction with a small dead zone so trackpad jitter does not flicker it
      const dy = y - lastY
      if (y < 120) {
        setHidden(false)
        lastY = y
      } else if (Math.abs(dy) > 8) {
        // a nav link or deep link is travelling (ClientLayout goTo): the
        // visitor did not scroll down, so keep the header in place
        const navigating = document.documentElement.dataset.navScroll === "true"
        setHidden(allowHide && dy > 0 && !navigating)
        lastY = y
      }

      // Active section: the one crossing a reading line 40% down the viewport
      const line = window.innerHeight * 0.4
      let current: string | null = null
      for (const id of trackedIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top <= line && r.bottom > line) {
          current = id
          break
        }
      }
      setActive(current)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const closeMobile = useCallback((restoreFocus = false) => {
    setMobileOpen(false)
    if (restoreFocus) toggleRef.current?.focus()
  }, [])

  // Mobile menu: links arrive one by one, focus is trapped, Escape closes
  useEffect(() => {
    if (!mobileOpen) return
    const nav = navRef.current
    const toggle = toggleRef.current
    if (!nav) return

    const items = nav.querySelectorAll<HTMLElement>("li")
    let tween: gsap.core.Tween | null = null
    if (!prefersReducedMotion()) {
      tween = gsap.fromTo(
        items,
        { x: 28, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: EASE.enter,
          stagger: 0.06,
          delay: 0.12,
          overwrite: true,
          clearProps: "transform,opacity",
        },
      )
    }

    const focusables = () => [
      ...(toggle ? [toggle] : []),
      ...Array.from(nav.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")),
    ]
    nav.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        closeMobile(true)
        return
      }
      if (e.key !== "Tab") return
      const els = focusables()
      if (!els.length) return
      const first = els[0]
      const last = els[els.length - 1]
      const current = document.activeElement as HTMLElement | null
      const inside = current ? els.includes(current) : false
      if (e.shiftKey && (current === first || !inside)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (current === last || !inside)) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      if (tween) {
        tween.kill()
        gsap.set(items, { clearProps: "transform,opacity" })
      }
    }
  }, [mobileOpen, closeMobile])

  const isHidden = hidden && !mobileOpen

  return (
    <>
      <header
        className={cn("header", scrolled && "scrolled", isHidden && "header--hidden")}
        onFocusCapture={() => setHidden(false)}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center no-underline" aria-label="Global Shipping & Logistics, home">
            <Logo height={42} />
          </a>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
            {navLinks.map((link) => {
              const isActive = active !== null && link.href === `#${active}`
              return (
                <a
                  key={link.label}
                  href={link.href}
                  aria-current={isActive ? "location" : undefined}
                  className={cn("header__link text-sm font-medium", isActive ? "text-ink" : "text-ink-muted")}
                >
                  {link.label}
                  <span className="header__dot" aria-hidden="true" />
                </a>
              )
            })}
          </nav>

          <div className="flex items-center gap-4">
            <button
              data-popup="contact"
              className="btn btn-pri text-sm px-5 py-2.5 hidden sm:flex"
            >
              Get in touch
            </button>

            <button
              ref={toggleRef}
              type="button"
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              <span className={cn(
                "w-6 h-0.5 transition-all duration-300",
                scrolled ? "bg-gray-800" : "bg-white",
                mobileOpen && "rotate-45 translate-y-1.5"
              )} />
              <span className={cn(
                "w-6 h-0.5 transition-all duration-300",
                scrolled ? "bg-gray-800" : "bg-white",
                mobileOpen && "opacity-0"
              )} />
              <span className={cn(
                "w-6 h-0.5 transition-all duration-300",
                scrolled ? "bg-gray-800" : "bg-white",
                mobileOpen && "-rotate-45 -translate-y-1.5"
              )} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="nav-overlay active" onClick={() => closeMobile()} />
      )}

      <nav
        ref={navRef}
        id="mobile-nav"
        aria-label="Menu"
        className={cn("header__nav", mobileOpen && "active")}
        inert={!mobileOpen}
        data-lenis-prevent
      >
        <ul className="flex flex-col gap-6 list-none p-0 m-0">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                aria-current={active !== null && link.href === `#${active}` ? "location" : undefined}
                className="header__nav-link text-lg font-medium text-gray-800 no-underline"
                onClick={() => closeMobile()}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-4">
            <button data-popup="contact" onClick={() => closeMobile()} className="btn btn-pri px-6 py-3 text-base font-semibold">
              Get in touch
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M30.44 3.68L3 31.12.88 29l27.44-27.44L30.44 3.68z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M4.5 1.5h26v26h-3V4.5h-23v-3z" fill="white"/>
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}
