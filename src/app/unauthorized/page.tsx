"use client"

import { LockKeyhole } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center p-8 bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 mb-4">
          <LockKeyhole className="h-10 w-10 text-slate-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Authentication Required</h1>
        <p className="text-sm text-slate-500 mb-6">
          You must be logged in to access this secure area. Please sign in with your credentials to continue.
        </p>
        <div className="flex gap-3">
          <Link href="/login">
            <Button className="w-full">Sign In</Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sign Out
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-4">
          If the Sign In button loops back here, click <strong>Sign Out</strong> first to clear your session.
        </p>
      </div>
    </div>
  )
}
