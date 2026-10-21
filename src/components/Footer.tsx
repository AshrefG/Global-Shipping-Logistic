"use client"

import { useEffect, useRef, useState } from "react"
import { gsap, ScrollTrigger, SplitText, EASE, STAGGER, prefersReducedMotion } from "@/lib/gsap"
import Logo from "@/components/Logo"

/*
  Footer: a designed close, then the contact sheet.
    1. "Driven by You." set large in Archivo with the amber CTA (opens the
       contact modal), the page's last call to action.
    2. Newsletter, links, offices and contact lines, legal and privacy.

  Curtain (FAQ to Footer): on lg+ with motion allowed, and only when the
  whole footer fits in the viewport, the footer sits sticky at the bottom
  of the page UNDER <main> (main carries its own background), so the last
  section lifts away like a roller door and uncovers it. The footer's
  content rises the last stretch into place while a scrim lifts off it,
  locked to the scroll. Otherwise (phones, short windows, reduced motion)
  it is a normal block in the flow, whose close rises in once.

  The close itself plays once, when the footer is about a third uncovered
  (or scrolls into view): "Driven by You" rises out of its baseline letter
  by letter, then the amber full stop lands and flashes once, like
  headlights switching on. Reduced motion: set, no travel.
*/

const linkClass =
  "text-lg text-gray-700 no-underline transition-colors duration-[180ms] hover:text-white"
const lineHover = "transition-colors duration-[180ms] hover:text-primary"

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const [curtain, setCurtain] = useState(false)

  // Decide between curtain and normal flow, and keep deciding on resize
  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return
    const wide = window.matchMedia("(min-width: 1024px)")
    const measure = () => {
      setCurtain(
        wide.matches &&
          !prefersReducedMotion() &&
          footer.offsetHeight <= window.innerHeight,
      )
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(footer)
    window.addEventListener("resize", measure)
    wide.addEventListener("change", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
      wide.removeEventListener("change", measure)
    }
  }, [])

  // Motion for whichever mode is active
  useEffect(() => {
    const footer = footerRef.current
    const main = document.getElementById("main-content")
    if (!footer || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const inner = footer.querySelector<HTMLElement>(".footer__inner")
      const scrim = footer.querySelector<HTMLElement>(".footer__scrim")

      /* "Driven by You." headline, played once from either mode below */
      const driven = footer.querySelector<HTMLElement>("[data-driven]")
      const dot = footer.querySelector<HTMLElement>("[data-driven-dot]")
      let split: SplitText | undefined
      let close: gsap.core.Timeline | undefined
      if (driven && dot) {
        split = SplitText.create(driven, { type: "chars", mask: "chars" })
        close = gsap
          .timeline({ paused: true })
          .from(split.chars, { yPercent: 115, duration: 0.9, ease: EASE.enter, stagger: 0.035 })
          .fromTo(
            dot,
            { scale: 0, opacity: 0, transformOrigin: "50% 85%" },
            { scale: 1, opacity: 1, duration: 0.5, ease: EASE.enter },
            "-=0.4",
          )
          .fromTo(
            dot,
            { textShadow: "0 0 0px oklch(0.78 0.15 75 / 0)" },
            { textShadow: "0 0 28px oklch(0.78 0.15 75 / 0.85)", duration: 0.22, ease: "power2.out", yoyo: true, repeat: 1 },
            "<0.12",
          )
      }
      const playClose = () => close?.play()

      if (curtain && main && inner && scrim) {
        // Locked to scroll: main's bottom edge travels from the viewport
        // bottom to the footer's top, uncovering the footer from below.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: main,
              start: "bottom bottom",
              end: () => `bottom bottom-=${footer.offsetHeight}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(inner, { y: () => footer.offsetHeight * 0.16 }, { y: 0 }, 0)
          .fromTo(scrim, { opacity: 0.75 }, { opacity: 0 }, 0)
        ScrollTrigger.create({
          trigger: main,
          start: () => `bottom bottom-=${footer.offsetHeight * 0.35}`,
          onEnter: playClose,
        })

        // Keyboard: focus can land in the footer while <main> still covers
        // it (the browser thinks it is in view). Uncover it at once.
        const uncover = () => {
          const covered = main.getBoundingClientRect().bottom > window.innerHeight - footer.offsetHeight + 1
          if (covered) window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" })
        }
        footer.addEventListener("focusin", uncover)
        return () => {
          footer.removeEventListener("focusin", uncover)
          split?.revert()
        }
      }

      // Normal flow: the close arrives once, headline then action
      ScrollTrigger.create({ trigger: footer, start: "top 75%", onEnter: playClose })
      const parts = gsap.utils.toArray<HTMLElement>("[data-footer-reveal]", footer)
      if (!parts.length) return () => split?.revert()
      gsap.set(parts, { y: 24, opacity: 0 })
      ScrollTrigger.create({
        trigger: footer,
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(parts, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: EASE.enter,
            stagger: STAGGER.item,
            clearProps: "transform,opacity",
          }),
      })
      return () => split?.revert()
    }, footer)

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [curtain])

  return (
    <footer
      ref={footerRef}
      data-curtain={curtain ? "true" : undefined}
      className="relative overflow-hidden bg-dark text-white data-[curtain=true]:sticky data-[curtain=true]:bottom-0 data-[curtain=true]:z-[-1]"
    >
      <div className="footer__inner max-w-7xl mx-auto px-6">
        {/* The close */}
        <div className="pt-16 pb-12 lg:pt-20 lg:pb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 border-b border-white/10">
          <div>
            <p
              data-footer-reveal
              className="font-mono text-xs text-ink-muted mb-5"
            >
              Since 1975 · Part of Al Shirawi Group<span className="hidden sm:inline"> · Dubai, UAE</span>
            </p>
            <p className="font-display font-extrabold text-ink leading-[0.95] tracking-[-0.03em] text-[clamp(2.75rem,7vw,6rem)] lg:whitespace-nowrap">
              <span data-driven>Driven by You</span>
              <span data-driven-dot className="inline-block text-primary">.</span>
            </p>
          </div>
          <div data-footer-reveal className="flex flex-col items-start gap-4 lg:items-end lg:text-right lg:pb-3">
            <p className="text-ink-muted text-base max-w-sm">
              Tell us what you ship and where it goes. We&apos;ll come back with a corridor plan and a quote.
            </p>
            <a
              href="#contact"
              data-popup="contact"
              className="btn btn-pri px-7 py-3.5 text-base font-semibold no-underline"
            >
              Get in touch
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M30.44 3.68L3 31.12.88 29l27.44-27.44L30.44 3.68z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M4.5 1.5h26v26h-3V4.5h-23v-3z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Contact sheet */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="mb-5">
              <Logo height={40} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Subscribe to Newsletters</h3>
            <p className="text-gray-400 text-sm mb-5">Want to stay up to date? Sign up for our monthly update.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                required
                className="w-full min-w-0 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-primary transition-colors text-sm"
              />
              <button type="submit" className="btn btn-pri shrink-0 justify-center px-5 py-3 text-sm">
                Subscribe
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4.6 9.4l3.8 3.8L16 5.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
            <p className="text-gray-500 text-xs mt-3">Don&apos;t worry about spam. We hate it too!</p>
          </div>

          {/* Links */}
          <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-6">
            <div className="flex flex-col gap-3">
              <a href="#" className={linkClass}>Home.</a>
              <a href="#career" className={linkClass}>Career. <span className="text-primary text-xs ml-1">We&apos;re hiring</span></a>
              <a href="#tech" className={linkClass}>Technology.</a>
              <a href="#news" className={linkClass}>News & Media.</a>
              <a href="#contact" className={linkClass} data-popup="contact">Get in touch.</a>
            </div>
          </nav>

          {/* Offices */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Head Office</div>
              <p className="text-sm text-gray-700">
                Global Shipping &amp; Logistics (L.L.C)<br />
                Green Community, Dubai Investment Park (DIP-1)<br />
                Dubai, United Arab Emirates
              </p>
            </div>
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Cold Chain Campus</div>
              <p className="text-sm text-gray-700">
                Dubai Industrial City<br />
                Dubai, United Arab Emirates
              </p>
            </div>
          </div>

          {/* Direct lines */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Email</div>
              <a href="mailto:info@gsldubai.com" className={`${lineHover} text-base text-white no-underline`}>
                info@gsldubai.com
              </a>
            </div>
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Phone</div>
              <a href="tel:+97148851566" className={`${lineHover} text-base text-white no-underline font-mono`}>
                +971 4 885 1566
              </a>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div id="legal" className="scroll-mt-24">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Legal notice</div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-md">
              Global Shipping &amp; Logistics (L.L.C) · Part of Al Shirawi Group ·
              Green Community, Dubai Investment Park (DIP-1), Dubai, UAE ·
              Licensed in the Emirate of Dubai · TRN available on request.
            </p>
          </div>
          <div id="privacy" className="scroll-mt-24">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Privacy</div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-md">
              We process contact-form data solely to answer your request and never sell it.
              Tracking data from shipments stays between you and your consignee.
              Questions: <a href="mailto:info@gsldubai.com" className="text-gray-400 transition-colors duration-[180ms] hover:text-white">info@gsldubai.com</a>.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-500 text-xs text-center md:text-left">© 2026, Global Shipping & Logistics (L.L.C) · Part of Al Shirawi Group. All Rights Reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#legal" className="inline-block py-2 -my-2 whitespace-nowrap text-gray-400 text-xs no-underline transition-colors duration-[180ms] hover:text-white">Legal notice</a>
            <a href="#privacy" className="inline-block py-2 -my-2 whitespace-nowrap text-gray-400 text-xs no-underline transition-colors duration-[180ms] hover:text-white">Privacy policy</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="inline-block py-2 -my-2 whitespace-nowrap text-gray-400 text-xs no-underline transition-colors duration-[180ms] hover:text-white">LinkedIn</a>
          </div>
        </div>
      </div>

      {/* Darkness lifting off the footer as the page above rolls away (GSAP only) */}
      <div className="footer__scrim pointer-events-none absolute inset-0 bg-dark opacity-0" aria-hidden="true" />
    </footer>
  )
}
