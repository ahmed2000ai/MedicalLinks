"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
        isActive
          ? "bg-sidebar-accent text-white font-medium"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
