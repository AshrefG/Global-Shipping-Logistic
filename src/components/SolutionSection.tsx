"use client"

/*
  Services — sticky-stacked panels (Phase 3).
  Each service is a full-width dark panel that pins under the header while
  the next slides over it — pure CSS sticky, no scroll-jacking, degrades
  perfectly on mobile and reduced motion.
*/

const SERVICES = [
  {
    code: "SVC-01",
    name: "Full Truckload",
    tag: "FTL",
    desc: "A dedicated truck for your cargo, dock to dock. AI-routed around traffic and weather, live-tracked every kilometre, one partner end to end.",
    specs: ["13.6m MEGA & STANDARD", "GPS + door sensors", "ETA accuracy ±15 min"],
  },
  {
    code: "SVC-02",
    name: "Less Than Truckload",
    tag: "LTL",
    desc: "Pay for the pallets, not the truck. Smart consolidation fills every trailer — fewer empty kilometres, lower cost, lower CO₂ per shipment.",
    specs: ["1–15 pallet slots", "48h corridor network", "−35% CO₂ per pallet"],
  },
  {
    code: "SVC-03",
    name: "Cross-Border",
    tag: "CBX",
    desc: "Europe ↔ North Africa corridors with customs pre-cleared before the truck arrives. Digital CMR, T1 transit handled, no waiting bays.",
    specs: ["e-CMR native", "T1 / EX1 handled", "TUN–EU RO-RO lanes"],
  },
  {
    code: "SVC-04",
    name: "Last-Mile",
    tag: "LMD",
    desc: "The final kilometres decide the customer experience. Time-slotted delivery, e-signature POD and photo proof, straight into your ERP.",
    specs: ["Slot booking", "e-POD + photos", "API / EDI integration"],
  },
  {
    code: "SVC-05",
    name: "Warehousing",
    tag: "WHS",
    desc: "Bonded and ambient space at the corridor hubs. Cross-dock in minutes, store for a season — inventory visible in the same dashboard.",
    specs: ["Bonded + ambient", "Cross-dock < 30 min", "Live stock levels"],
  },
  {
    code: "SVC-06",
    name: "Ocean & Rail",
    tag: "MML",
    desc: "When the lane calls for it, we extend the road: RO-RO and container legs woven into the same door-to-door plan, tracked in one place.",
    specs: ["RO-RO integration", "FCL / LCL on demand", "One tracking view"],
  },
]

export default function SolutionSection() {
  return (
    <section id="services" className="py-24 md:py-32 bg-canvas">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 max-w-3xl">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
            One partner, <span className="text-primary">every lane.</span>
          </h2>
          <p className="mt-5 text-lg text-gray-600 max-w-xl">
            Six services, one dashboard, one accountable team — from a single
            pallet to a dedicated fleet.
          </p>
        </div>

        {/* Sticky stack */}
        <div className="flex flex-col gap-6">
          {SERVICES.map((s, i) => (
            <div
              key={s.code}
              className="lg:sticky rounded-2xl border border-line bg-surface p-8 md:p-12 shadow-[0_-18px_50px_rgba(0,0,0,0.45)]"
              style={{ top: `${92 + i * 26}px` }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start gap-3">
                  <span className="font-mono text-xs tracking-[0.2em] text-gray-400">{s.code}</span>
                  <span className="font-display text-2xl font-extrabold text-primary">{s.tag}</span>
                </div>
                <div className="lg:col-span-6">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-4">{s.name}</h3>
                  <p className="text-gray-600 leading-relaxed max-w-lg">{s.desc}</p>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-2.5">
                  {s.specs.map((spec) => (
                    <div key={spec} className="inline-flex self-start px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 font-mono text-xs text-white/70">
                      {spec}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
