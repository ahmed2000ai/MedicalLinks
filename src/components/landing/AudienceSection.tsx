import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, UserPlus, Building2, ArrowRight } from "lucide-react"

export function AudienceSection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#041a3a] mb-4">Tailored for Your Success</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">Whether you are a doctor advancing your career or a hospital building a world-class team, MedicalLinks provides the tools you need.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* For Doctors Card */}
          <div className="bg-white rounded-[2rem] p-8 lg:p-12 border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col justify-between overflow-hidden relative group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            {/* Subtle glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none" />
            
            <div className="relative z-10 mb-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <UserPlus size={28} strokeWidth={2} />
                </div>
                <h3 className="text-3xl font-bold text-[#041a3a]">For Doctors</h3>
              </div>
              <p className="text-slate-600 mb-8 text-lg font-medium">Find the right opportunity and grow your medical career in the GCC.</p>
              
              <ul className="space-y-5 mb-10">
                {[
                  "Increase profile visibility to top GCC hospitals",
                  "Access curated, verified opportunities",
                  "Receive licensing and readiness guidance",
                  "Track applications and interview progress"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-700 font-medium">
                    <CheckCircle2 size={20} className="text-blue-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/login">
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-14 text-base shadow-lg shadow-blue-600/20 w-full sm:w-auto transition-transform group-hover:scale-[1.02]">
                  Explore Opportunities <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
            
            {/* Image Placeholder */}
            <div className="h-64 w-full bg-slate-100 rounded-2xl bg-cover bg-center border border-slate-200 relative z-10 transition-transform duration-700 group-hover:scale-105 shadow-inner" 
                 style={{backgroundImage: 'url("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800&h=500")'}} 
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </div>
          </div>

          {/* For Hospitals Card */}
          <div className="bg-white rounded-[2rem] p-8 lg:p-12 border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col justify-between overflow-hidden relative group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            {/* Subtle glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none" />

            <div className="relative z-10 mb-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
                  <Building2 size={28} strokeWidth={2} />
                </div>
                <h3 className="text-3xl font-bold text-[#041a3a]">For Hospitals</h3>
              </div>
              <p className="text-slate-600 mb-8 text-lg font-medium">Hire the best talent faster with our specialized matching technology.</p>
              
              <ul className="space-y-5 mb-10">
                {[
                  "Access a vetted pipeline of qualified doctors",
                  "Specialty-based AI matching and recommendations",
                  "Shortlist and manage candidates efficiently",
                  "Integrated interview scheduling and communication"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-700 font-medium">
                    <CheckCircle2 size={20} className="text-teal-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/login">
                <Button className="gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 h-14 text-base shadow-lg shadow-teal-600/20 w-full sm:w-auto transition-transform group-hover:scale-[1.02]">
                  Get Started <ArrowRight size={18} />
                </Button>
              </Link>
            </div>

            {/* Image Placeholder */}
            <div className="h-64 w-full bg-slate-100 rounded-2xl bg-cover bg-center border border-slate-200 relative z-10 transition-transform duration-700 group-hover:scale-105 shadow-inner" 
                 style={{backgroundImage: 'url("https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800&h=500")'}} 
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
