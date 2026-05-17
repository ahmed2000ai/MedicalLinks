import * as React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col-reverse md:flex-row min-h-screen bg-background w-full items-start md:items-stretch">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-[calc(100vh-64px)] md:min-h-screen overflow-hidden w-full relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/20 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}
