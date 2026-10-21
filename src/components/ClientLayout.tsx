"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger, prefersReducedMotion, onLoaderDone, SCROLL_LOCK, SCROLL_UNLOCK } from "@/lib/gsap"
import Header from "./Header"
import Footer from "./Footer"
import ContactModal from "./ContactModal"

// gsap.addEventListener exists at runtime (matchMedia lifecycle) but is untyped
type MediaEvents = {
  addEventListener(type: string, cb: () => void): void
  removeEventListener(type: string, cb: () => void): void
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      // Reduced motion: native wheel scrolling, no glide after the hand stops
      smoothWheel: !reduced,
    })
    lenisRef.current = lenis

    lenis.on("scroll", ScrollTrigger.update)

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    // Hold the page still behind the loader gate. Lenis drives the scroll
    // itself, so body overflow alone does not stop the wheel.
    if (document.documentElement.dataset.loaded !== "true") lenis.stop()

    /*
      One way to travel to an in-page target, for nav clicks and deep links.
      The header clearance comes from html { scroll-padding-top } in
      globals.css, which Lenis applies to element targets, so keyboard focus,
      native jumps and these glides all clear the header by the same amount.
      - reduced motion jumps instead of gliding;
      - the header stays visible while the page travels (data-nav-scroll);
      - a target inside the curtain footer measures at the viewport bottom
        (the footer is sticky), so go to the page end, where it is uncovered;
      - focus moves with the view, so the next Tab continues from there;
      - the URL carries the hash, so it can be shared and Back works.
    */
    const goTo = (target: HTMLElement | null, hash: string, push: boolean) => {
      const root = document.documentElement
      root.dataset.navScroll = "true"
      const done = () => {
        delete root.dataset.navScroll
      }

      if (!target) lenis.scrollTo(0, { immediate: reduced, onComplete: done })
      else if (target.closest("footer[data-curtain]")) lenis.scrollTo(lenis.limit, { immediate: reduced, onComplete: done })
      else lenis.scrollTo(target, { immediate: reduced, onComplete: done })
      if (reduced) done()

      const url = target ? hash : location.pathname + location.search
      if (push) history.pushState(null, "", url)
      else history.replaceState(null, "", url)

      const focusable = target ?? document.getElementById("main-content")
      if (focusable) {
        if (!focusable.matches("a[href], button, input, select, textarea, [tabindex]")) {
          focusable.setAttribute("tabindex", "-1")
        }
        focusable.focus({ preventScroll: true })
      }
    }

    // In-page anchor links. Contact links use [data-popup] and are handled by
    // ContactModal, so skip them.
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor || anchor.dataset.popup) return

      const hash = anchor.getAttribute("href") ?? ""
      event.preventDefault()
      if (hash === "#") {
        goTo(null, hash, true)
        return
      }
      const target = document.querySelector<HTMLElement>(hash)
      if (target) goTo(target, hash, true)
    }
    document.addEventListener("click", onAnchorClick)

    // Sections mix layout effects (useGSAP) and passive effects (useEffect),
    // so triggers are not created in page order. Re-sort by start position and
    // recompute once fonts have settled and the loader has opened, so pinned
    // scenes push every later trigger (seams, reveals, counters) correctly.
    const resync = () => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    }
    let fontsCancelled = false
    document.fonts?.ready.then(() => {
      if (!fontsCancelled) resync()
    })

    // Gate open: release the scroll, then replay a #hash the visitor arrived
    // with (stashed by the scroll-reset script in layout.tsx).
    const offLoader = onLoaderDone(() => {
      lenis.start()
      resync()
      const w = window as Window & { __gslHash?: string }
      const hash = w.__gslHash
      w.__gslHash = undefined
      const target = hash ? document.querySelector<HTMLElement>(hash) : null
      if (hash && target) goTo(target, hash, false)
      else lenis.scrollTo(0, { immediate: true, force: true })
    })
    window.addEventListener("load", resync)

    // Crossing a matchMedia breakpoint (e.g. lg) rebuilds the pinned scenes:
    // they land at the end of the refresh order and the document height
    // changes under the reader. Remember where they were, re-sort, put them back.
    // ScrollTrigger measures with the scroll at 0 and several refreshes follow
    // one resize, so the position is put back after each of them for a moment.
    const media = gsap as unknown as MediaEvents
    let restoreY: number | null = null
    let restoreTimer = 0
    const onMediaInit = () => {
      if (restoreY === null) restoreY = lenis.scroll
    }
    const restore = () => {
      if (restoreY === null) return
      lenis.scrollTo(Math.min(restoreY, lenis.limit), { immediate: true, force: true })
    }
    const onMedia = () => {
      window.clearTimeout(restoreTimer)
      requestAnimationFrame(() => {
        resync()
        restore()
      })
      restoreTimer = window.setTimeout(() => {
        restore()
        restoreY = null
      }, 1200)
    }
    media.addEventListener("matchMediaInit", onMediaInit)
    media.addEventListener("matchMedia", onMedia)
    ScrollTrigger.addEventListener("refresh", restore)

    // Keyboard safety net: Tab can reach a control before its scroll reveal
    // has run (it lands at the very bottom of the viewport). Any ancestor
    // still faded by a reveal finishes it at once, so focus is never invisible.
    const onFocusIn = (e: FocusEvent) => {
      for (let el = e.target as HTMLElement | null; el && el !== document.body; el = el.parentElement) {
        const faded = el.style.opacity !== "" && parseFloat(el.style.opacity) < 1
        if (faded) {
          gsap.killTweensOf(el, "opacity,x,y")
          gsap.set(el, { opacity: 1, x: 0, y: 0 })
        }
      }
    }
    document.addEventListener("focusin", onFocusIn)

    // Overlays hold the page still while open
    const lock = () => lenis.stop()
    const unlock = () => lenis.start()
    window.addEventListener(SCROLL_LOCK, lock)
    window.addEventListener(SCROLL_UNLOCK, unlock)

    return () => {
      fontsCancelled = true
      offLoader()
      window.removeEventListener("load", resync)
      window.removeEventListener(SCROLL_LOCK, lock)
      window.removeEventListener(SCROLL_UNLOCK, unlock)
      media.removeEventListener("matchMediaInit", onMediaInit)
      media.removeEventListener("matchMedia", onMedia)
      ScrollTrigger.removeEventListener("refresh", restore)
      window.clearTimeout(restoreTimer)
      document.removeEventListener("click", onAnchorClick)
      document.removeEventListener("focusin", onFocusIn)
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
      gsap.ticker.lagSmoothing(0)
    }
  }, [])

  return (
    <>
      {/* Keyboard users skip the header straight to the content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[500] btn btn-pri px-5 py-2.5 text-sm"
      >
        Skip to content
      </a>
      <Header />
      {/* main carries its own ground so the curtain footer (sticky, z -1,
          see Footer) stays covered until the last section lifts off it.
          No z-index here: a stacking context on main would trap the
          loader (z 400) under the header. */}
      <main id="main-content" tabIndex={-1} className="bg-canvas outline-none">{children}</main>
      <Footer />
      <ContactModal />
    </>
  )
}
