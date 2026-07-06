"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Logo from "@/components/Logo"

const navLinks = [
  { label: "Home.", href: "#" },
  { label: "About us.", href: "#about" },
  { label: "Services.", href: "#services" },
  { label: "Technology.", href: "#tech" },
  { label: "Career.", href: "#career" },
  { label: "News & Media.", href: "#news" },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  // Modal open is handled globally by ContactModal via [data-popup="contact"];
  // here we only collapse the mobile nav.
  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <header className={cn("header", scrolled && "scrolled")}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center no-underline" aria-label="Global Shipping & Logistics — home">
            <Logo height={42} />
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-colors duration-300 text-ink-muted hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              data-popup="contact"
              className="btn btn-pri text-sm px-5 py-2.5 hidden sm:flex"
            >
              Get in touch
            </button>

            <button
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
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
        <div className="nav-overlay active" onClick={() => setMobileOpen(false)} />
      )}

      <nav className={cn("header__nav", mobileOpen && "active")}>
        <ul className="flex flex-col gap-6 list-none p-0 m-0">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-lg font-medium text-gray-800 no-underline hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-4">
            <button data-popup="contact" onClick={closeMobile} className="btn btn-pri px-6 py-3 text-base font-semibold">
              Get in touch
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
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
