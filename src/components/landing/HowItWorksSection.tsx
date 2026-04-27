import { UserPlus, ShieldCheck, Layers, Briefcase } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Profile",
      desc: "Build your structured medical profile with credentials, experience, and career preferences.",
    },
    {
      icon: ShieldCheck,
      title: "Verify Credentials",
      desc: "We securely verify your medical documents and licenses for GCC compliance.",
    },
    {
      icon: Layers,
      title: "Smart Matching",
      desc: "Our proprietary engine matches you with the most relevant opportunities.",
    },
    {
      icon: Briefcase,
      title: "Interview & Hire",
      desc: "Connect directly with hospital decision-makers, interview, and get hired.",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-slate-50/50">
      <div className="container mx-auto px-6 text-center max-w-6xl">
        <div className="mb-20">
          <p className="text-teal-600 font-bold uppercase tracking-wider text-sm mb-3">How It Works</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#041a3a]">Simple Steps. Meaningful Connections.</h2>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-[45px] left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-slate-300 z-0" />
          
          {steps.map((step, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-200/60 shadow-lg shadow-slate-200/40 relative z-10 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-20 h-20 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-8 relative border border-teal-100 shadow-inner">
                <step.icon size={32} strokeWidth={1.5} />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#041a3a] text-white flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#041a3a] mb-4">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
