"use client"

import { useEffect, useRef } from "react"
import { gsap, EASE, markLoaderDone, prefersReducedMotion } from "@/lib/gsap"
import Logo from "@/components/Logo"
import HeroSection from "@/components/HeroSection"
import IntroSection from "@/components/IntroSection"
import ProblemSection from "@/components/ProblemSection"
import SolutionSection from "@/components/SolutionSection"
import ShiftSection from "@/components/ShiftSection"
import JourneySection from "@/components/JourneySection"
import TechSection from "@/components/TechSection"
import WhyUsSection from "@/components/WhyUsSection"
import PartnersSection from "@/components/PartnersSection"
import CareerSection from "@/components/CareerSection"
import NewsSection from "@/components/NewsSection"
import CertBand from "@/components/CertBand"
import FaqSection from "@/components/FaqSection"
import ContainerWipe from "@/components/motion/ContainerWipe"
import LaneSeam from "@/components/motion/LaneSeam"

const loaderCopy = [
  "Driven by You",
  "Freight · Customs · Cold Chain",
  "Part of Al Shirawi Group",
]

// The five quality marks (LRQA audited, UKAS accredited)
const backers = [
  "ISO 9001",
  "ISO 14001",
  "ISO 22000",
  "ISO 45001",
  "BRCGS",
]

export default function Home() {
  const loadingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = loadingRef.current
    if (!el) return

    const previousOverflow = document.body.style.overflow
    const release = () => {
      el.style.display = "none"
      el.setAttribute("aria-hidden", "true")
      document.body.style.overflow = previousOverflow
    }

    // Reduced motion: no gate, the page is there at once
    if (prefersReducedMotion()) {
      release()
      markLoaderDone()
      return
    }

    document.body.style.overflow = "hidden"
    el.setAttribute("aria-hidden", "false")

    const ctx = gsap.context(() => {
      const ribs = el.querySelectorAll<HTMLElement>(".trans__item")
      const copy = el.querySelectorAll<HTMLElement>(".trans__logo, .trans__home-inner")
      const laneFill = el.querySelector<HTMLElement>(".trans__lane-fill")
      const countValue = el.querySelector<HTMLElement>(".trans__count-value")
      const title = el.querySelector<HTMLElement>(".trans__home-title")

      /*
        Fixed, linear sequence (updated_state.md). The door is closed from the
        first painted frame (CSS), so nothing has to arrive before counting.
          0.00-1.60  counter and lane marking fill together, 00 to 100
          1.60-1.85  hold at 100%
          1.85-2.15  loader copy leaves (short ease-in)
          2.00       gate opens: markLoaderDone(), hero entrance starts
          2.00-2.80  roller door rolls up, centre ribs first
      */
      const progress = { value: 0 }
      let copyIndex = 0

      const tl = gsap.timeline({
        onComplete: () => {
          release()
          markLoaderDone()
        },
      })

      tl.to(progress, {
        value: 100,
        duration: 1.6,
        ease: "power1.inOut",
        onUpdate: () => {
          const v = Math.round(progress.value)
          if (countValue) countValue.textContent = String(v).padStart(2, "0")
          const next = Math.min(loaderCopy.length - 1, Math.floor((v / 100) * loaderCopy.length))
          if (title && next !== copyIndex) {
            copyIndex = next
            title.textContent = loaderCopy[next]
          }
        },
      }, 0)

      if (laneFill) {
        tl.fromTo(
          laneFill,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.6, ease: "power1.inOut" },
          0,
        )
      }

      tl.addLabel("exit", 1.85)
        .to(copy, { y: -16, opacity: 0, duration: 0.3, ease: EASE.exit }, "exit")
        .addLabel("open", "exit+=0.15")
        // Gate starts opening: first-screen entrances play now, in view
        .call(markLoaderDone, [], "open")
        .to(ribs, {
          yPercent: -100,
          duration: 0.72,
          ease: "power3.inOut",
          stagger: { each: 0.04, from: "center" },
        }, "open")
    }, el)

    return () => {
      ctx.revert()
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <>
      {/* Without JS the gate never opens, so it is never shown */}
      <noscript>
        <style>{".trans__wrapper{display:none}"}</style>
      </noscript>
      <div ref={loadingRef} className="trans__wrapper" role="status" aria-label="Loading Global Shipping and Logistics">
        {/* Container roller door: six ribs, closed from the first frame */}
        <div className="trans__inner" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="trans__item" />
          ))}
        </div>

        <div className="trans__logo" aria-hidden="true">
          <Logo height={44} />
        </div>

        <div className="trans__home">
          <div className="trans__home-inner">
            <div className="trans__count" aria-hidden="true">
              <div className="trans__count-number">
                <span className="trans__count-value">00</span>
                <span className="trans__count-percent">%</span>
              </div>
              {/* Progress as a lane marking: dashes paint in amber */}
              <div className="trans__lane">
                <div className="trans__lane-fill" />
              </div>
            </div>

            <div>
              <p className="trans__home-title">{loaderCopy[0]}</p>
              <div className="trans__backers">
                <div className="trans__backers-label">LRQA audited · UKAS accredited</div>
                <div className="trans__backers-inner">
                  {backers.map((backer) => (
                    <span key={backer}>{backer}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*
        Transition map: the scroll is a trip along a freight corridor.
        Seams vary by boundary so no two neighbours hand over the same way.
          Hero → Intro        hero recedes (inside HeroSection)
          Intro → Problem     lane marking paints across
          Problem → Services  container roller doors open
          Services → Shift    container doors part (inside ShiftSection)
          Shift → Journey     truck drives on into the corridor (inside both)
          Journey → Tech      container roller doors open
          Tech → Why us       lane marking paints across
          Partners → Career   container roller doors open
          Career → News       lane marking paints across
          FAQ → Footer        curtain footer (Footer + ClientLayout)
      */}
      <HeroSection />
      <IntroSection />
      <LaneSeam />
      <ProblemSection />
      <ContainerWipe from="var(--color-gray-50)" />
      <SolutionSection />
      <ShiftSection />
      <JourneySection />
      <ContainerWipe from="var(--color-dark-2)" />
      <TechSection />
      <LaneSeam />
      <WhyUsSection />
      <CertBand />
      <PartnersSection />
      <ContainerWipe from="var(--color-canvas)" />
      <CareerSection />
      <LaneSeam />
      <NewsSection />
      <FaqSection />
    </>
  )
}
