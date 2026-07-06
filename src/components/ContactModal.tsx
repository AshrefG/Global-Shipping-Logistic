"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/*
  Contact modal (Phase 4): controlled open state, real submission to
  /api/contact with field validation, sending/success/error states,
  focus trap + Escape close + focus restore.
  Anything with [data-popup="contact"] anywhere in the page opens it.
*/

type FieldErrors = { name?: string; email?: string; message?: string }
type Status = "idle" | "sending" | "success" | "error"

export default function ContactModal() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  const [errors, setErrors] = useState<FieldErrors>({})
  const dialogRef = useRef<HTMLDivElement>(null)
  const lastTriggerRef = useRef<HTMLElement | null>(null)

  const close = useCallback(() => {
    setOpen(false)
    setStatus((s) => (s === "sending" ? s : "idle"))
    lastTriggerRef.current?.focus()
  }, [])

  // Global triggers: any [data-popup="contact"] element opens the modal
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement)?.closest<HTMLElement>("[data-popup='contact']")
      if (!trigger) return
      e.preventDefault()
      lastTriggerRef.current = trigger
      setOpen(true)
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  // Focus trap + Escape while open
  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    if (!dialog) return

    const focusables = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          "button, [href], input, textarea, [tabindex]:not([tabindex='-1'])",
        ),
      ).filter((el) => !el.hasAttribute("disabled"))

    // Focus once the .popup visibility transition lets it take — retry
    // briefly since focus() fails silently on a still-hidden element.
    let focusTimer = 0
    const tryFocus = (attempt: number) => {
      const el = focusables()[0]
      el?.focus()
      if (el && document.activeElement !== el && attempt < 6) {
        focusTimer = window.setTimeout(() => tryFocus(attempt + 1), 110)
      }
    }
    focusTimer = window.setTimeout(() => tryFocus(0), 60)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== "Tab") return
      const els = focusables()
      if (els.length === 0) return
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, close, status])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    }

    setStatus("sending")
    setErrors({})
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.status === 422) {
        const data = (await res.json()) as { errors?: FieldErrors }
        setErrors(data.errors ?? {})
        setStatus("idle")
        return
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      form.reset()
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  const fieldClass =
    "w-full px-0 py-3 border-b text-base bg-transparent outline-none transition-colors"

  return (
    <div className={`popup contact-popup ${open ? "active" : ""}`} aria-hidden={!open}>
      <div className="popup__overlay" onClick={close} />
      <div
        ref={dialogRef}
        className="popup__main"
        role="dialog"
        aria-modal="true"
        aria-label="Contact Global Shipping & Logistics"
      >
        {status === "success" ? (
          <div className="flex flex-col items-start gap-5 py-6">
            <div className="w-12 h-12 rounded-full bg-primary-bg flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                <path d="M4.6 10.4l3.6 3.6L15.4 6.6" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">Message sent.</h3>
            <p className="text-gray-600 text-sm max-w-sm">
              Thanks for reaching out — a corridor specialist will get back to
              you within one business day.
            </p>
            <button type="button" onClick={close} className="btn btn-pri px-8 py-3">
              Done
            </button>
          </div>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={onSubmit} noValidate>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Get in touch with us!
              </h3>
              <p className="text-gray-600 text-sm">
                Tell us what you ship and where it goes — we&apos;ll come back
                with a corridor plan and a quote.
              </p>
            </div>

            <div className="mb-2">
              <div className="text-sm text-gray-500 mb-1">Or just wanna say hi?</div>
              <a href="mailto:info@gsldubai.com" className="text-lg font-medium text-primary hover:text-primary-dark transition-colors no-underline">
                info@gsldubai.com
              </a>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  className={`${fieldClass} ${errors.name ? "border-accent" : "border-gray-300 focus:border-primary"}`}
                />
                {errors.name && <p className="mt-1.5 text-xs text-accent">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  className={`${fieldClass} ${errors.email ? "border-accent" : "border-gray-300 focus:border-primary"}`}
                />
                {errors.email && <p className="mt-1.5 text-xs text-accent">{errors.email}</p>}
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="What are you shipping, and on which lane?"
                  rows={3}
                  aria-invalid={Boolean(errors.message)}
                  className={`${fieldClass} resize-none ${errors.message ? "border-accent" : "border-gray-300 focus:border-primary"}`}
                />
                {errors.message && <p className="mt-1.5 text-xs text-accent">{errors.message}</p>}
              </div>
            </div>

            {status === "error" && (
              <p className="text-sm text-accent">
                Something went wrong sending your message — please try again,
                or email us directly.
              </p>
            )}

            <button type="submit" disabled={status === "sending"} className="btn btn-pri self-start px-8 py-3 disabled:opacity-60 disabled:cursor-wait">
              {status === "sending" ? "Sending…" : "Send message"}
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M30.44 3.68L3 31.12.88 29l27.44-27.44L30.44 3.68z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M4.5 1.5h26v26h-3V4.5h-23v-3z" fill="white" />
              </svg>
            </button>
          </form>
        )}

        <button type="button" className="popup__close" onClick={close} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <path d="M25.19 6.81L6.81 25.19M6.81 6.81l18.38 18.38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
