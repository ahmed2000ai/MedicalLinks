import { Quote, Star } from "lucide-react"

export function TestimonialSection() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 md:gap-16 shadow-2xl shadow-slate-200/50">
          
          <div className="md:w-2/3 relative">
            <Quote size={60} className="text-teal-100 absolute -top-8 -left-6 md:-left-10 rotate-180 fill-current" />
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} className="fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-xl md:text-2xl text-[#041a3a] leading-relaxed font-bold relative z-10">
              "MedicalLinks has transformed how we recruit. The quality of candidates and the efficiency of the platform have helped us build a stronger team in significantly less time."
            </p>
          </div>

          <div className="md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left relative z-10 md:border-l border-slate-200 md:pl-12 w-full">
            <div className="h-20 w-20 rounded-full bg-slate-200 shrink-0 bg-cover bg-center mb-4 border-4 border-white shadow-md" style={{backgroundImage: 'url("https://i.pravatar.cc/150?img=11")'}} />
            <div>
              <p className="font-extrabold text-[#041a3a] text-lg">Dr. Faisal Al Mansoori</p>
              <p className="text-sm text-teal-600 font-semibold mb-1">Chief Medical Officer</p>
              <p className="text-sm text-slate-500">Al Noor Medical City, Abu Dhabi</p>
            </div>
          </div>
          
        </div>
        
        {/* Carousel dots mockup */}
        <div className="flex justify-center gap-3 mt-12">
          <div className="w-8 h-2 rounded-full bg-teal-600" />
          <div className="w-2 h-2 rounded-full bg-slate-300 hover:bg-slate-400 cursor-pointer transition-colors" />
          <div className="w-2 h-2 rounded-full bg-slate-300 hover:bg-slate-400 cursor-pointer transition-colors" />
          <div className="w-2 h-2 rounded-full bg-slate-300 hover:bg-slate-400 cursor-pointer transition-colors" />
        </div>
      </div>
    </section>
  )
}
