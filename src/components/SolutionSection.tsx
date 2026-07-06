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
    name: "International Freight",
    tag: "FRT",
    desc: "Air, sea and land freight forwarding on the lanes your supply chain lives on — roots in the business since 1975, one accountable partner end to end.",
    specs: ["Air · Sea · Land", "Since 1975", "Door-to-door plans"],
  },
  {
    code: "SVC-02",
    name: "Customs Clearance",
    tag: "CCL",
    desc: "Documentation filed ahead of arrival so cargo rolls through instead of waiting. Import, export and transit handled by our in-house team.",
    specs: ["Import / Export / Transit", "Pre-arrival filing", "In-house brokers"],
  },
  {
    code: "SVC-03",
    name: "Port Haulage & Transport",
    tag: "PHL",
    desc: "Container haulage from Jebel Ali and Dubai's ports to anywhere in the UAE and across GCC borders — live-tracked, every kilometre.",
    specs: ["Jebel Ali daily", "GCC cross-border", "Live GPS fleet"],
  },
  {
    code: "SVC-04",
    name: "Cold Chain Warehousing",
    tag: "CCW",
    desc: "Ambient to frozen under one roof: cool, chilled and frozen chambers with continuous SCADA temperature and humidity monitoring, WMS-driven, BRCGS certified.",
    specs: ["AMBIENT · +15…+25°C · 0…−25°C", "SCADA 24/7 monitoring", "BRCGS + ISO 22000", "WMS + customer portal"],
  },
  {
    code: "SVC-05",
    name: "Distribution",
    tag: "DST",
    desc: "Scheduled and on-demand delivery across the Emirates — retail, HORECA and healthcare drops with e-POD, straight into your ERP.",
    specs: ["UAE-wide network", "e-POD + photos", "Retail / HORECA / Pharma"],
  },
  {
    code: "SVC-06",
    name: "Value Added Services",
    tag: "VAS",
    desc: "Everything between the pallet and the shelf: labelling, kitting, repacking, quality inspection and returns — done inside the warehouse, not in transit.",
    specs: ["Labelling + kitting", "Repacking + QC", "Returns handling"],
  },
  {
    code: "SVC-07",
    name: "Stocktaking & Merchandising",
    tag: "S&M",
    desc: "Counted, audited, shelf-ready. In-store merchandising and cyclical stocktakes that keep your inventory truth in sync with your system.",
    specs: ["Cyclical counts", "In-store teams", "BI reporting"],
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
            Seven services, one 3PL, one accountable team — from the port
            gate to the shop shelf, ambient to −25°C.
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
