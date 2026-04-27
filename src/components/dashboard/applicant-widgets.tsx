import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2, Clock, ChevronRight, MapPin,
  Compass, Database, ShieldCheck, Globe,
  Calendar, Monitor, Users, Building
} from "lucide-react"
import Link from "next/link"

// ---------------------------------------------------------------------------
// Quick Start Card
// ---------------------------------------------------------------------------

interface ReadinessItem {
  label: string
  value: string
  status: "ok" | "warn" | "pending" | "missing"
}

interface QuickStartCardProps {
  completionPct: number
  readinessItems: ReadinessItem[]
}

const STATUS_ICONS = {
  ok:      { icon: CheckCircle2, className: "text-emerald-500" },
  warn:    { icon: Clock,        className: "text-yellow-500"  },
  pending: { icon: Clock,        className: "text-blue-400"    },
  missing: { icon: Clock,        className: "text-slate-400"   },
}

export function QuickStartCard({ completionPct, readinessItems }: QuickStartCardProps) {
  return (
    <Card className="overflow-hidden border border-slate-200">
      <CardContent className="p-6">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick Start</p>

        <div className="flex flex-col md:flex-row gap-4">
          {/* CTAs */}
          <div className="flex flex-col gap-3 flex-1">
            <Link href="/profile">
              <div className="flex items-center gap-4 rounded-xl bg-primary px-5 py-4 cursor-pointer hover:bg-primary/90 transition-colors group">
                {/* Circular progress */}
                <div className="relative h-12 w-12 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
                    <circle cx="18" cy="18" r="15.9"
                      fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9"
                      fill="none" stroke="white" strokeWidth="3"
                      strokeDasharray={`${completionPct} ${100 - completionPct}`}
                      strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
                    {completionPct}%
                  </span>
                </div>
                <span className="text-white font-semibold text-base flex-1">
                  Complete Your Profile ({completionPct}%)
                </span>
                <ChevronRight size={18} className="text-white/70 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            </Link>

            <Link href="/opportunities">
              <div className="flex items-center gap-4 rounded-xl bg-teal-600 px-5 py-4 cursor-pointer hover:bg-teal-700 transition-colors group">
                <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Compass size={20} className="text-white" />
                </div>
                <span className="text-white font-semibold text-base flex-1">
                  Explore Recommendations
                </span>
                <ChevronRight size={18} className="text-white/70 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            </Link>
          </div>

          {/* Readiness indicators */}
          <div className="flex flex-col justify-center gap-2 min-w-[220px]">
            {readinessItems.map((item) => {
              const cfg = STATUS_ICONS[item.status]
              const Icon = cfg.icon
              return (
                <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                      {item.label === "DataFlow"         && <Database   size={14} className="text-slate-500" />}
                      {item.label === "License Readiness" && <ShieldCheck size={14} className="text-slate-500" />}
                      {item.label === "Relocation"        && <Globe       size={14} className="text-slate-500" />}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon size={14} className={cfg.className} />
                    <span className={cn("text-xs font-semibold", {
                      "text-emerald-600": item.status === "ok",
                      "text-yellow-600":  item.status === "warn",
                      "text-blue-500":    item.status === "pending",
                      "text-slate-400":   item.status === "missing",
                    })}>
                      {item.value}
                    </span>
                    <ChevronRight size={12} className="text-slate-300" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Top Match Card
// ---------------------------------------------------------------------------

interface TopMatchCardProps {
  title: string
  hospitalName: string
  country: string
  city: string | null
  specialty: string
  matchScore: number
  licensefit?: string
  className?: string
}

// Deterministic hospital icon colors based on hospital name
function hospitalColorClass(name: string): string {
  const colors = [
    "bg-emerald-700", "bg-blue-700", "bg-teal-700",
    "bg-indigo-700",  "bg-purple-700", "bg-slate-700",
  ]
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff
  return colors[hash % colors.length]
}

function hospitalInitials(name: string): string {
  return name.split(/\s+/).filter(Boolean).map(w => w[0]).join("").substring(0, 2).toUpperCase()
}

export function TopMatchCard({
  title, hospitalName, country, city, specialty,
  matchScore, licensefit = "License fit: Strong", className,
}: TopMatchCardProps) {
  return (
    <Card className={cn("flex flex-col hover:border-primary/40 hover:shadow-md transition-all overflow-hidden group", className)}>
      <CardContent className="p-5 flex flex-col flex-1 gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm", hospitalColorClass(hospitalName))}>
            {hospitalInitials(hospitalName)}
          </div>
          <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            Match {matchScore}%
          </span>
        </div>

        {/* Role info */}
        <div className="space-y-0.5">
          <p className="font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">{hospitalName}</p>
          <p className="text-primary font-semibold text-sm">{title}</p>
          <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
            <MapPin size={12} />
            <span>{city ? `${city}, ${country}` : country}</span>
          </div>
        </div>

        {/* License fit */}
        <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium bg-emerald-50 rounded-lg px-3 py-2 mt-auto">
          <CheckCircle2 size={14} className="shrink-0" />
          {licensefit}
        </div>
      </CardContent>

      {/* CTA */}
      <div className="px-5 pb-5 pt-0">
        <Link href="/opportunities">
          <Button variant="outline" className="w-full gap-2 group-hover:border-primary/50 group-hover:text-primary transition-colors">
            View Details <ChevronRight size={14} />
          </Button>
        </Link>
      </div>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Application Status Panel
// ---------------------------------------------------------------------------

interface ApplicationStatusPanelProps {
  applied: number
  interviewing: number
  offerStage: number
  total: number
}

export function ApplicationStatusPanel({ applied, interviewing, offerStage, total }: ApplicationStatusPanelProps) {
  const bars = [
    { label: "Applied",      count: applied,      color: "bg-blue-500",    pct: total ? Math.round(applied      / total * 100) : 0 },
    { label: "Interviewing", count: interviewing,  color: "bg-teal-500",    pct: total ? Math.round(interviewing  / total * 100) : 0 },
    { label: "Offer Stage",  count: offerStage,    color: "bg-purple-500",  pct: total ? Math.round(offerStage   / total * 100) : 0 },
  ]

  return (
    <div className="space-y-4">
      {bars.map(bar => (
        <div key={bar.label}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className={cn("h-2.5 w-2.5 rounded-full", bar.color)} />
              <span className="text-sm font-medium text-foreground">{bar.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">{bar.count}</span>
              <span className="text-xs text-muted-foreground w-8 text-right">{bar.pct}%</span>
            </div>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", bar.color)}
              style={{ width: `${bar.pct}%` }}
            />
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
        <span className="text-sm text-muted-foreground">Total Applications</span>
        <span className="text-lg font-bold text-foreground">{total}</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Upcoming Interview Item
// ---------------------------------------------------------------------------

interface InterviewItemProps {
  hospitalName: string
  roleTitle: string
  scheduledAt: Date
  timezone: string
  type: string
  daysUntil: number
}

export function InterviewItem({ hospitalName, roleTitle, scheduledAt, timezone, type, daysUntil }: InterviewItemProps) {
  const timeStr = scheduledAt.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: true, timeZone: timezone,
  })
  const dateStr = scheduledAt.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  })

  const urgency = daysUntil === 0 ? "Today"
    : daysUntil === 1 ? "Tomorrow"
    : `In ${daysUntil} days`

  const urgencyClass = daysUntil <= 3
    ? "bg-orange-50 text-orange-700 border-orange-200"
    : "bg-blue-50 text-blue-700 border-blue-200"

  const TypeIcon = type === "VIRTUAL" ? Monitor : Users

  return (
    <div className="flex gap-3 items-start py-3 border-b border-border last:border-0">
      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", hospitalColorClass(hospitalName))}>
        <Building size={16} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-foreground truncate">{hospitalName}</p>
          <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0", urgencyClass)}>
            {urgency}
          </span>
        </div>
        <p className="text-xs text-primary font-medium mt-0.5">{roleTitle}</p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar size={11} /> {dateStr}</span>
          <span className="flex items-center gap-1"><Clock size={11} /> {timeStr} {timezone}</span>
        </div>
      </div>
    </div>
  )
}
