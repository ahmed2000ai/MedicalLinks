import { ShieldAlert } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center p-8 bg-white rounded-lg shadow-sm border border-red-100">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 mb-4">
          <ShieldAlert className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Access Denied</h1>
        <p className="text-sm text-slate-500 mb-6">
          You do not have the required permissions to access this page. Your current role does not grant access to this secure area.
        </p>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="outline">Go to Home</Button>
          </Link>
          <Link href="/login">
            <Button>Sign In Again</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
