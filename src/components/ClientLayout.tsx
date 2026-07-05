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

    return () => {
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
