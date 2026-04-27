import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, Building, CheckCircle2, ChevronRight, LayoutDashboard, FileText, Briefcase, MessageSquare, Bell, Search } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 pt-16 pb-16 lg:pt-28 lg:pb-24">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid xl:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="max-w-2xl xl:pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-semibold mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              The GCC&apos;s #1 Medical Recruitment Platform
            </div>
            
            <h1 className="text-5xl lg:text-[4rem] font-extrabold text-[#041a3a] leading-[1.05] tracking-tight mb-6">
              Connecting Doctors with <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Leading Hospitals</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
              We help hospitals hire faster and empower doctors to find the right opportunities to grow their careers across the GCC.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/login" className="flex-1 sm:flex-none">
                <Button size="lg" className="w-full gap-2 bg-teal-600 hover:bg-teal-700 text-lg px-8 h-14 rounded-full shadow-xl shadow-teal-600/20 transition-all hover:-translate-y-0.5">
                  <User size={20} />
                  Find Opportunities
                </Button>
              </Link>
              <Link href="/login" className="flex-1 sm:flex-none">
                <Button variant="outline" size="lg" className="w-full gap-2 text-[#041a3a] border-slate-200 hover:bg-slate-100 text-lg px-8 h-14 rounded-full shadow-sm transition-all hover:-translate-y-0.5 bg-white">
                  <Building size={20} />
                  Hire Doctors
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 text-sm font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" /> Verified Opportunities
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" /> Direct Hospital Access
              </div>
            </div>
          </div>

          {/* Right Content - Ultra Realistic CSS Mockup */}
          <div className="relative mx-auto w-full max-w-[600px] xl:max-w-none perspective-[1000px]">
            {/* Laptop Frame */}
            <div className="relative rounded-[1.5rem] bg-[#eef2f6] border-[8px] border-white shadow-2xl overflow-hidden aspect-[16/10] z-10 transform-gpu rotate-y-[-5deg] rotate-x-[5deg] shadow-[-20px_20px_40px_rgba(4,26,58,0.1)]">
              {/* Browser Top Bar */}
              <div className="bg-slate-100 border-b border-slate-200 h-12 flex items-center px-4 gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-white flex-1 h-7 rounded-md border border-slate-200 flex items-center px-3 text-xs text-slate-400 gap-2 shadow-sm">
                  <Search size={12} /> app.medicallinks.com/dashboard
                </div>
              </div>

              {/* App UI */}
              <div className="flex h-full bg-[#f8fafc]">
                {/* Sidebar */}
                <div className="w-48 bg-[#041a3a] h-full p-4 flex flex-col gap-4 text-white/70">
                  <div className="flex items-center gap-2 text-white font-bold mb-4">
                    <div className="bg-white/20 p-1 rounded"><User size={14} /></div> MedicalLinks
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 text-white px-3 py-2 rounded-lg text-xs font-medium"><LayoutDashboard size={14} /> Overview</div>
                  <div className="flex items-center gap-3 px-3 py-2 text-xs font-medium"><User size={14} /> Profile</div>
                  <div className="flex items-center gap-3 px-3 py-2 text-xs font-medium"><Briefcase size={14} /> Opportunities</div>
                  <div className="flex items-center gap-3 px-3 py-2 text-xs font-medium"><FileText size={14} /> Applications</div>
                  <div className="flex items-center gap-3 px-3 py-2 text-xs font-medium relative"><MessageSquare size={14} /> Messages <span className="absolute right-3 bg-teal-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">3</span></div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 flex flex-col gap-5 overflow-hidden">
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm" style={{backgroundImage: 'url("https://i.pravatar.cc/150?img=47")', backgroundSize: 'cover'}} />
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Welcome back,</div>
                        <div className="text-sm font-bold text-[#041a3a]">Dr. Sarah Jenkins</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-full border border-slate-100 shadow-sm text-slate-400"><Bell size={14} /></div>
                    </div>
                  </div>

                  {/* Dashboard Widgets */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                      <div className="text-xs font-bold text-[#041a3a] mb-3">Recommended Opportunities</div>
                      <div className="space-y-2">
                        {/* Mock Opportunity 1 */}
                        <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg border border-slate-50 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Building size={14} /></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-[#041a3a] truncate">Consultant Anesthesiologist</div>
                            <div className="text-[10px] text-slate-500">Al Noor Medical City • Abu Dhabi</div>
                          </div>
                          <div className="text-[9px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-full border border-teal-100">95% Match</div>
                        </div>
                        {/* Mock Opportunity 2 */}
                        <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg border border-slate-50 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0"><Building size={14} /></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-[#041a3a] truncate">Pediatric Specialist</div>
                            <div className="text-[10px] text-slate-500">Gulf Children's • Dubai</div>
                          </div>
                          <div className="text-[9px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-full border border-teal-100">88% Match</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex-1 flex flex-col items-center justify-center text-center">
                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Profile Strength</div>
                        <div className="relative w-16 h-16 flex items-center justify-center mb-1">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="4"></circle>
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-teal-500" strokeWidth="4" strokeDasharray="90 100" strokeLinecap="round"></circle>
                          </svg>
                          <span className="absolute text-sm font-bold text-[#041a3a]">90%</span>
                        </div>
                        <div className="text-[9px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-full">Excellent</div>
                      </div>
                      <div className="bg-gradient-to-br from-[#041a3a] to-blue-900 rounded-xl shadow-sm p-4 text-white">
                         <div className="text-[10px] font-medium text-white/70 uppercase">Interviews</div>
                         <div className="text-xl font-bold mb-1">2</div>
                         <div className="text-[9px] text-white/50">Scheduled this week</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Laptop Base (Creates 3D effect) */}
            <div className="hidden sm:block absolute -bottom-4 left-1/2 -translate-x-1/2 w-[105%] h-5 bg-slate-300 rounded-b-2xl border-t border-slate-200 z-0 transform-gpu rotate-y-[-5deg] rotate-x-[5deg]" />

            {/* Mobile Phone Overlay - Absolute positioning */}
            <div className="absolute -bottom-12 -right-8 w-[240px] h-[480px] bg-white rounded-[2.5rem] border-[8px] border-slate-800 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] z-20 overflow-hidden hidden md:flex flex-col transform-gpu rotate-y-[-10deg] rotate-x-[5deg] hover:translate-y-[-5px] transition-transform duration-500">
              {/* Dynamic Island */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-800 rounded-b-xl z-30" />
              
              <div className="flex-1 bg-[#f8fafc] w-full pt-10 px-4 pb-4 overflow-hidden flex flex-col gap-4">
                 <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[9px] text-slate-500">Good morning,</div>
                      <div className="text-sm font-bold text-[#041a3a]">Dr. Sarah</div>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm"><Bell size={12} className="text-slate-500"/></div>
                 </div>
                 
                 <div className="bg-teal-600 rounded-xl p-4 text-white shadow-lg shadow-teal-600/30">
                    <div className="text-[10px] font-medium text-white/80 mb-1">Application Status</div>
                    <div className="text-xs font-bold mb-3">Interview Stage</div>
                    <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-white h-full w-2/3 rounded-full" />
                    </div>
                 </div>

                 <div>
                    <div className="text-[10px] font-bold text-[#041a3a] mb-2 uppercase tracking-wide">Top Matches</div>
                    <div className="space-y-2">
                       <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                         <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Building size={12}/></div>
                         <div>
                           <div className="text-[10px] font-bold text-[#041a3a]">Cardiology Consultant</div>
                           <div className="text-[9px] text-slate-500">Sharjah, UAE</div>
                         </div>
                       </div>
                       <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                         <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center"><Building size={12}/></div>
                         <div>
                           <div className="text-[10px] font-bold text-[#041a3a]">ICU Specialist</div>
                           <div className="text-[9px] text-slate-500">Dubai, UAE</div>
                         </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
