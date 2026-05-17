"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavItem({
  href,
  icon,
  label,
  badge,
}: {
  href: string
  icon: React.ReactNode
  label: string
  badge?: number
}) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={cn(
        "relative flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-md text-[10px] md:text-sm transition-colors shrink-0 min-w-[64px] md:min-w-0",
        isActive
          ? "bg-sidebar-accent text-white font-medium"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white"
      )}
    >
      <div className="shrink-0">{icon}</div>
      <span className="md:flex-1 text-center md:text-left truncate w-full md:w-auto">{label}</span>
      {badge != null && badge > 0 && (
        <span className="absolute top-1 right-1 md:static md:ml-auto inline-flex items-center justify-center h-4 min-w-[16px] md:h-5 md:min-w-[20px] px-1 md:px-1.5 rounded-full bg-primary text-[9px] md:text-[11px] font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  )
}
