import Link from "next/link"
import { ShieldAlert, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CandidateNotFound() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="h-10 w-10 text-slate-400" />
      </div>
      
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        Profile Unavailable
      </h1>
      
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        This candidate profile is currently not discoverable. The candidate may have paused their job search, updated their privacy settings, or the profile may no longer exist.
      </p>
      
      <Button asChild variant="default" className="gap-2">
        <Link href="/hospitals/search">
          <ArrowLeft className="h-4 w-4" />
          Back to Candidate Pool
        </Link>
      </Button>
    </div>
  )
}
