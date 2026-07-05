"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Header from "./Header"
import Footer from "./Footer"
import ContactModal from "./ContactModal"

gsap.registerPlugin(ScrollTrigger)

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    })
    lenisRef.current = lenis

    lenis.on("scroll", ScrollTrigger.update)

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    // Smooth-scroll in-page anchor links (offset for the fixed header).
    // Contact links use [data-popup] and are handled by ContactModal, so skip them.
    const HEADER_OFFSET = 90
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor || anchor.dataset.popup) return

      const hash = anchor.getAttribute("href") ?? ""
      event.preventDefault()

      if (hash === "#") {
        lenis.scrollTo(0)
        return
      }

      const target = document.querySelector(hash)
      if (target) {
        lenis.scrollTo(target as HTMLElement, { offset: -HEADER_OFFSET })
      }
    }
    document.addEventListener("click", onAnchorClick)

    return () => {
      document.removeEventListener("click", onAnchorClick)
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
      gsap.ticker.lagSmoothing(0)
    }
  }, [])

  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <ContactModal />
    </>
  )
}
