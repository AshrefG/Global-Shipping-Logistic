import { NextResponse } from "next/server"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const data = body as Record<string, unknown>
  const name = String(data?.name ?? "").trim()
  const email = String(data?.email ?? "").trim()
  const message = String(data?.message ?? "").trim()

  const errors: Record<string, string> = {}
  if (name.length < 2) errors.name = "Please tell us your name."
  if (!EMAIL_RE.test(email)) errors.email = "That email doesn't look right."
  if (message.length < 10) errors.message = "A few more words help us route your request."
  if (message.length > 5000) errors.message = "Message is too long (5000 chars max)."

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 })
  }

  // TODO(phase-later): hand off to an email provider (e.g. Resend / SMTP)
  // using env credentials. Until then the lead is logged server-side so
  // submissions are never silently lost in development.
  console.log("[contact] lead received", {
    name,
    email,
    messageLength: message.length,
    at: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true })
}
