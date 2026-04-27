import Link from "next/link"
import { ArrowRight, MapPin, HeartPulse, Stethoscope, Activity, Syringe, Building } from "lucide-react"

export function FeaturedOpportunitiesSection() {
  const opps = [
    {
      title: "Internal Medicine Consultant",
      hospital: "Al Noor Medical City",
      location: "Abu Dhabi, UAE",
      tags: ["Full-time", "Senior Level"],
      icon: HeartPulse,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Pediatrics Specialist",
      hospital: "Gulf Children's Hospital",
      location: "Dubai, UAE",
      tags: ["Full-time", "Mid-Senior"],
      icon: Stethoscope,
      color: "text-teal-600",
      bg: "bg-teal-50"
    },
    {
      title: "Emergency Medicine Consultant",
      hospital: "Riyadh Care Hospital",
      location: "Riyadh, Saudi Arabia",
      tags: ["Full-time", "Senior Level"],
      icon: Activity,
      color: "text-rose-500",
      bg: "bg-rose-50"
    },
    {
      title: "Anesthesiology Consultant",
      hospital: "Emirates Hospital",
      location: "Sharjah, UAE",
      tags: ["Full-time", "Senior Level"],
      icon: Syringe,
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ]

  return (
    <section className="py-24 bg-slate-50/80">
      <div className="container mx-auto px-6 max-w-6xl text-center">
        <div className="mb-16">
          <p className="text-teal-600 font-bold uppercase tracking-wider text-sm mb-3">Featured Opportunities</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#041a3a]">Top Specialties. Leading Hospitals.</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left mb-12">
          {opps.map((opp, i) => (
            <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-slate-200/60 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${opp.bg} ${opp.color} group-hover:scale-110 transition-transform`}>
                  <opp.icon size={28} strokeWidth={1.5} />
                </div>
                <div className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-full border border-teal-100">
                  New
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-[#041a3a] text-lg leading-tight mb-2 line-clamp-2">{opp.title}</h4>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-1">
                  <Building size={14} />
                  <span className="truncate">{opp.hospital}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-6">
                  <MapPin size={14} />
                  <span>{opp.location}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100">
                {opp.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg border border-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Link href="/opportunities" className="inline-flex items-center gap-2 text-[#041a3a] font-bold hover:text-teal-600 transition-colors px-6 py-3 rounded-full hover:bg-white shadow-sm border border-transparent hover:border-slate-200">
          View all opportunities <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  )
}
