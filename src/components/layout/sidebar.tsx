import Link from "next/link"
import { LayoutDashboard, User, Users, Briefcase, MessagesSquare, Settings, Hospital, ShieldCheck, FileText, FolderOpen, CalendarDays, DollarSign } from "lucide-react"
import { auth } from "@/auth"
import { NavItem } from "@/components/layout/nav-item"
import { getUnreadCount } from "@/features/messaging/actions"

export async function Sidebar() {
  const session = await auth()
  if (!session) return null

  const role = session?.user?.role
  const isApplicant = role === "APPLICANT"
  const isAdmin = role === "ADMIN"
  const isHospital = role === "HOSPITAL_CONTACT"

  const unreadCount = session.user.id ? await getUnreadCount(session.user.id) : 0

  return (
    <aside className="w-64 bg-sidebar-bg text-sidebar-foreground sticky top-0 h-screen flex flex-col shrink-0 overflow-hidden">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-accent shrink-0">
        <Link href="/" className="text-xl font-bold text-white flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="text-primary text-2xl font-black">+</span>
          Medical<span className="text-primary">Links</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
        {isApplicant && (
          <>
            <p className="text-[11px] font-semibold text-sidebar-foreground/40 uppercase tracking-widest px-3 pt-1 pb-2">
              Doctor Portal
            </p>
            <NavItem href="/dashboard"     icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <NavItem href="/profile"       icon={<User            size={18} />} label="My Profile" />
            <NavItem href="/documents"     icon={<FolderOpen      size={18} />} label="Documents" />
            <NavItem href="/applications"  icon={<FileText        size={18} />} label="My Applications" />
            <NavItem href="/opportunities" icon={<Briefcase       size={18} />} label="Opportunities" />
            <NavItem href="/interviews"    icon={<CalendarDays    size={18} />} label="Interviews" />
            <NavItem href="/messages"      icon={<MessagesSquare  size={18} />} label="Messages" badge={unreadCount} />
            <NavItem href="/settings"      icon={<Settings        size={18} />} label="Settings" />
          </>
        )}


        {isHospital && (
          <>
            <p className="text-[11px] font-semibold text-sidebar-foreground/40 uppercase tracking-widest px-3 pt-1 pb-2">
              Hospital Partner
            </p>
            <NavItem href="/hospitals" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <NavItem href="/hospitals/search" icon={<Users size={18} />} label="Candidate Pool" />
            <NavItem href="/hospitals/shortlist" icon={<Briefcase size={18} />} label="Shortlist" />
            <NavItem href="/hospitals/interviews" icon={<CalendarDays size={18} />} label="Interviews" />
            <NavItem href="/hospitals/placements" icon={<DollarSign size={18} />} label="Placements" />
            <NavItem href="/messages" icon={<MessagesSquare size={18} />} label="Messages" badge={unreadCount} />
            <NavItem href="/hospitals/settings"  icon={<Settings  size={18} />} label="Settings" />
          </>
        )}

        {isAdmin && (
          <>
            <p className="text-[11px] font-semibold text-sidebar-foreground/40 uppercase tracking-widest px-3 pt-4 pb-2">
              System
            </p>
            {isAdmin && (
              <>
                <NavItem href="/admin"            icon={<ShieldCheck     size={18} />} label="Admin Console" />
                <NavItem href="/admin/hospitals"  icon={<Hospital        size={18} />} label="Hospitals" />
                <NavItem href="/admin/placements" icon={<DollarSign      size={18} />} label="Placements" />
                <NavItem href="/admin/commercial" icon={<FileText        size={18} />} label="Commercial / Invoices" />
              </>
            )}
            <NavItem href="/settings" icon={<Settings size={18} />} label="Settings" />
          </>
        )}
      </nav>

      {/* Footer — GCC tagline (matches UI1 sidebar bottom) */}
      <div className="shrink-0 m-4 rounded-xl bg-sidebar-accent/70 p-4 border border-white/5">
        {/* Skyline SVG illustration */}
        <svg viewBox="0 0 220 48" className="w-full h-8 mb-2 opacity-30" fill="currentColor">
          <rect x="0"   y="30" width="8"  height="18" rx="1"/>
          <rect x="10"  y="22" width="10" height="26" rx="1"/>
          <rect x="22"  y="18" width="6"  height="30" rx="1"/>
          <rect x="30"  y="26" width="8"  height="22" rx="1"/>
          <rect x="40"  y="10" width="12" height="38" rx="1"/>
          <rect x="44"  y="4"  width="4"  height="6"  rx="0.5"/>
          <rect x="55"  y="20" width="8"  height="28" rx="1"/>
          <rect x="65"  y="28" width="10" height="20" rx="1"/>
          <rect x="78"  y="14" width="14" height="34" rx="1"/>
          <rect x="82"  y="8"  width="6"  height="6"  rx="0.5"/>
          <rect x="95"  y="22" width="8"  height="26" rx="1"/>
          <rect x="106" y="16" width="12" height="32" rx="1"/>
          <rect x="110" y="10" width="4"  height="6"  rx="0.5"/>
          <rect x="121" y="25" width="8"  height="23" rx="1"/>
          <rect x="132" y="12" width="14" height="36" rx="1"/>
          <rect x="136" y="6"  width="6"  height="6"  rx="0.5"/>
          <rect x="149" y="20" width="8"  height="28" rx="1"/>
          <rect x="160" y="28" width="10" height="20" rx="1"/>
          <rect x="173" y="14" width="12" height="34" rx="1"/>
          <rect x="188" y="24" width="8"  height="24" rx="1"/>
          <rect x="199" y="18" width="10" height="30" rx="1"/>
          <rect x="212" y="26" width="8"  height="22" rx="1"/>
        </svg>
        <p className="text-xs text-sidebar-foreground/60 leading-snug font-medium">
          Connecting Doctors<br />
          to Opportunities<br />
          Across the <span className="text-primary">GCC</span>
        </p>
      </div>
    </aside>
  )
}
