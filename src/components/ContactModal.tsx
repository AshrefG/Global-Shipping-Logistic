"use client"

import { useEffect } from "react"

export default function ContactModal() {
  useEffect(() => {
    const closeBtns = document.querySelectorAll("[data-popup='close']")
    const overlay = document.querySelector(".contact-popup .popup__overlay")
    const triggers = document.querySelectorAll("[data-popup='contact']")

    const open = () => document.querySelector(".contact-popup")?.classList.add("active")
    const close = () => document.querySelector(".contact-popup")?.classList.remove("active")

    triggers.forEach((t) => t.addEventListener("click", (e) => { e.preventDefault(); open() }))
    closeBtns.forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); close() }))
    overlay?.addEventListener("click", close)

    return () => {
      triggers.forEach((t) => t.removeEventListener("click", open))
    }
  }, [])

  return (
    <div className="popup contact-popup">
      <div className="popup__overlay"></div>
      <div className="popup__main">
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Get in touch with us!
            </h3>
            <p className="text-gray-600 text-sm">
              We are redefining global shipping. Reach out to learn how Global Shipping and Logistics can transform your supply chain.
            </p>
          </div>

          <div className="mb-2">
            <div className="text-sm text-gray-500 mb-1">Or just wanna say hi?</div>
            <a href="mailto:info@globalshipping-logistics.com" className="text-lg font-medium text-secondary hover:text-primary transition-colors no-underline">
              info@globalshipping-logistics.com
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <input type="text" placeholder="Your name" required
              className="w-full px-0 py-3 border-b border-gray-300 text-base bg-transparent outline-none focus:border-primary transition-colors" />
            <input type="email" placeholder="Your email" required
              className="w-full px-0 py-3 border-b border-gray-300 text-base bg-transparent outline-none focus:border-primary transition-colors" />
            <textarea placeholder="Message" rows={3}
              className="w-full px-0 py-3 border-b border-gray-300 text-base bg-transparent outline-none focus:border-primary transition-colors resize-none" />
          </div>

          <button type="submit" className="btn btn-pri self-start px-8 py-3">
            Send message
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M30.44 3.68L3 31.12.88 29l27.44-27.44L30.44 3.68z" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M4.5 1.5h26v26h-3V4.5h-23v-3z" fill="white"/>
            </svg>
          </button>
        </form>

        <button className="popup__close" data-popup="close" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <path d="M25.19 6.81L6.81 25.19M6.81 6.81l18.38 18.38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
