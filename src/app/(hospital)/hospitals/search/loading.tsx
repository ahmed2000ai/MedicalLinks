import { PageHeader } from "@/components/ui/page-header"
import { Filter, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LoadingCandidateSearch() {
  return (
    <div className="max-w-7xl mx-auto pb-12 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="h-8 w-48 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 w-96 bg-slate-100 rounded"></div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" disabled>
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Scaffold Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-6 hidden lg:block">
          <div className="bg-slate-50 border rounded-xl p-4 h-[500px]"></div>
        </div>

        {/* Main Feed Area Loading Cards */}
        <div className="flex-1 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border rounded-xl p-6 flex flex-col md:flex-row gap-6">
              <div className="hidden md:flex flex-col items-center gap-3 shrink-0">
                <div className="h-20 w-20 rounded-full bg-slate-100"></div>
                <div className="h-4 w-20 bg-slate-100 rounded"></div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-6 w-1/3 bg-slate-200 rounded"></div>
                    <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
                    <div className="flex gap-4 mt-2">
                      <div className="h-4 w-16 bg-slate-100 rounded"></div>
                      <div className="h-4 w-24 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-24 bg-slate-100 rounded"></div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <div className="h-6 w-24 bg-slate-100 rounded-full"></div>
                  <div className="h-6 w-32 bg-slate-100 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
