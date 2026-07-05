"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import HeroSection from "@/components/HeroSection"
import IntroSection from "@/components/IntroSection"
import ProblemSection from "@/components/ProblemSection"
import SolutionSection from "@/components/SolutionSection"
import ShiftSection from "@/components/ShiftSection"
import TechSection from "@/components/TechSection"
import WhyUsSection from "@/components/WhyUsSection"
import PartnersSection from "@/components/PartnersSection"
import FaqSection from "@/components/FaqSection"

const loaderCopy = [
  "Low Emission Road Freight",
  "Cross-Border Trucking Network",
  "Door-to-Door. Data-Driven.",
]

const backers = [
  "Bayern Kapital",
  "SOSV",
  "Lowercarbon",
  "FTTF",
  "Future Planet",
  "Farvatn",
]

export default function Home() {
  const loadingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = loadingRef.current
    if (!el) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    el.setAttribute("aria-hidden", "false")

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      el.style.display = "none"
      el.setAttribute("aria-hidden", "true")
      document.body.style.overflow = previousOverflow
      return
    }

    let frame = 0
    const startedAt = performance.now()
    const duration = 1850

    const updateProgress = (now: number) => {
      const elapsed = now - startedAt
      const nextProgress = Math.min(100, Math.round((elapsed / duration) * 100))
      const nextCopyIndex = Math.min(
        loaderCopy.length - 1,
        Math.floor((nextProgress / 100) * loaderCopy.length),
      )

      if (countValue) {
        countValue.textContent = String(nextProgress).padStart(2, "0")
      }
      if (loaderTitle) {
        loaderTitle.textContent = loaderCopy[nextCopyIndex]
      }

      if (nextProgress < 100) {
        frame = requestAnimationFrame(updateProgress)
      }
    }

    frame = requestAnimationFrame(updateProgress)

    const items = el.querySelectorAll<HTMLDivElement>(".trans__item")
    const logo = el.querySelector<HTMLElement>(".trans__logo")
    const home = el.querySelector<HTMLElement>(".trans__home")
    const bar = el.querySelector<HTMLElement>(".trans__count-bar-inner")
    const countValue = el.querySelector<HTMLElement>(".trans__count-value")
    const loaderTitle = el.querySelector<HTMLElement>(".trans__home-title")

    gsap.set(items, {
      scaleY: 0,
      transformOrigin: "bottom",
    })
    if (logo) {
      gsap.set(logo, {
        y: -24,
        opacity: 0,
        scale: 0.96,
      })
    }
    if (home) {
      gsap.set(home, {
        y: 36,
        opacity: 0,
      })
    }
    if (bar) {
      gsap.set(bar, {
        width: "0%",
      })
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        el.style.display = "none"
        el.setAttribute("aria-hidden", "true")
        document.body.style.overflow = previousOverflow
      },
    })

    timeline
      .to(items, {
        scaleY: 1,
        duration: 0.62,
        stagger: 0.045,
        ease: "power3.inOut",
      })

    if (logo) {
      timeline.to(logo, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: "power3.out",
      }, "-=0.25")
    }

    if (home) {
      timeline.to(home, {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
      }, "-=0.35")
    }

    if (bar) {
      timeline.to(bar, {
        width: "100%",
        duration: 1.7,
        ease: "power2.inOut",
      }, 0.15)
    }

    timeline.add("fadeOut", 2.2)

    if (home) {
      timeline.to(home, {
        y: -24,
        opacity: 0,
        duration: 0.42,
        ease: "power2.in",
      }, "fadeOut")
    }

    if (logo) {
      timeline.to(logo, {
        y: -18,
        opacity: 0,
        scale: 0.92,
        duration: 0.42,
        ease: "power2.in",
      }, "fadeOut")
    }

    timeline.to(items, {
      scaleY: 0,
      duration: 0.62,
      stagger: 0.045,
      ease: "power3.inOut",
      transformOrigin: "top",
    }, "fadeOut+=0.3")

    return () => {
      cancelAnimationFrame(frame)
      timeline.kill()
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <>
      <div ref={loadingRef} className="trans__wrapper" role="status" aria-label="Loading Global Shipping and Logistics">
        <div className="trans__logo" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none">
            <rect x="8" y="8" width="48" height="48" rx="18" fill="url(#loaderLogoGradient)" />
            <path d="M18 39.5L32 19.5L46 39.5H18Z" fill="white" />
            <path d="M23 39.5H41" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <path d="M16 45H48" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
            <defs>
              <linearGradient id="loaderLogoGradient" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F2B04B" />
                <stop offset="1" stopColor="#E08A2E" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="trans__inner" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="trans__item" />
          ))}
        </div>

        <div className="trans__home">
          <div className="trans__home-inner">
            <div className="trans__count" aria-hidden="true">
              <div className="trans__count-number">
                <span className="trans__count-value">00</span>
                <span className="trans__count-percent">%</span>
              </div>
              <div className="trans__count-bar">
                <div className="trans__count-bar-inner" />
              </div>
            </div>

            <div>
              <h1 className="trans__home-title">{loaderCopy[0]}</h1>
              <div className="trans__backers">
                <div className="trans__backers-label">Backed by top-tier investors</div>
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

      <HeroSection />
      <IntroSection />
      <ProblemSection />
      <SolutionSection />
      <ShiftSection />
      <TechSection />
      <WhyUsSection />
      <PartnersSection />
      <FaqSection />
    </>
  )
}
