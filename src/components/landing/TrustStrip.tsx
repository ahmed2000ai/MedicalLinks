import { Users, Globe, ShieldCheck, Target } from "lucide-react"

export function TrustStrip() {
  const items = [
    { icon: Users, title: "50,000+", subtitle: "Qualified Doctors" },
    { icon: Globe, title: "100%", subtitle: "GCC-Focused Recruitment" },
    { icon: ShieldCheck, title: "Verified", subtitle: "Credentials Workflow" },
    { icon: Target, title: "Specialty-Based", subtitle: "Smart AI Matching" },
  ]

  return (
    <section className="bg-white border-y border-slate-200 py-10 relative z-20 shadow-sm">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {items.map((item, i) => (
            <div key={i} className={`flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-5 ${i !== 0 ? 'md:pl-8 pt-6 md:pt-0' : ''}`}>
              <div className="p-3 bg-teal-50 rounded-2xl text-teal-600 shrink-0 shadow-sm border border-teal-100">
                <item.icon size={28} strokeWidth={2} />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#041a3a] tracking-tight">{item.title}</div>
                <div className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wide">{item.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
