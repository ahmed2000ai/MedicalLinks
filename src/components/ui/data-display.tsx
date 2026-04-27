import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, MapPin, Briefcase, DollarSign, Calendar, Clock, ArrowRight } from "lucide-react"

// -------------------------------------------------------------------------
// Key-Value Metadata Block
// -------------------------------------------------------------------------

export function KeyValueRow({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border/50 last:border-0 gap-1", className)}>
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      <span className="text-sm text-foreground font-medium sm:text-right">{value || "—"}</span>
    </div>
  )
}

export function MetadataStack({ items, className }: { items: { label: string; value: React.ReactNode }[]; className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      {items.map((item, index) => (
        <KeyValueRow key={index} label={item.label} value={item.value} />
      ))}
    </div>
  )
}

export function DetailSection({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <div className="bg-white rounded-xl border p-5 shadow-sm">
        {children}
      </div>
    </div>
  )
}

// -------------------------------------------------------------------------
// Metric / Stat Card
// -------------------------------------------------------------------------

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  trend?: { value: number; isPositive: boolean }
  icon?: React.ReactNode
  className?: string
}

export function MetricCard({ title, value, description, trend, icon, className }: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trend && (
              <span className={trend.isPositive ? "text-emerald-600" : "text-destructive"}>
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
            )}
            <span>{description}</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// -------------------------------------------------------------------------
// Opportunity Preview Card
// -------------------------------------------------------------------------

export interface OpportunityPreviewProps {
  title: string
  hospitalName: string
  location: string
  specialty: string
  employmentType: string
  salaryRange?: string
  status?: "ACTIVE" | "URGENT" | "CLOSING_SOON"
  postedDate: string
  matchScore?: number
}

export function OpportunityPreviewCard({
  title,
  hospitalName,
  location,
  specialty,
  employmentType,
  salaryRange,
  status,
  postedDate,
  matchScore
}: OpportunityPreviewProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10">
                {specialty}
              </Badge>
              {status === "URGENT" && <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-200">Urgent Fill</Badge>}
              {status === "CLOSING_SOON" && <Badge variant="warning" className="bg-yellow-50 text-yellow-700 border-yellow-200">Closing Soon</Badge>}
            </div>
            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{title}</CardTitle>
            <div className="flex items-center text-muted-foreground text-sm gap-1">
              <Building size={14} />
              <span className="font-medium">{hospitalName}</span>
            </div>
          </div>
          {matchScore && (
            <div className="flex flex-col items-center justify-center bg-emerald-50 rounded-full h-12 w-12 border border-emerald-100 shrink-0">
              <span className="text-sm font-bold text-emerald-600">{matchScore}%</span>
              <span className="text-[10px] uppercase text-emerald-600/80 font-medium leading-none">Match</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-slate-400" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-slate-400" />
            <span className="capitalize">{employmentType.replace('_', ' ').toLowerCase()}</span>
          </div>
          {salaryRange && (
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-slate-400" />
              <span>{salaryRange}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            <span>Posted {postedDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-3">
        <Button className="w-full sm:w-auto" variant="default">
          Apply Now
        </Button>
        <Button className="w-full sm:w-auto" variant="outline">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

// -------------------------------------------------------------------------
// Profile Summary Card (Doctor)
// -------------------------------------------------------------------------

export interface ProfileSummaryProps {
  name: string
  specialty: string
  location: string
  experience: number
  readiness: "READY_NOW" | "NEAR_READY" | "FUTURE_PIPELINE"
  completeness: number
}

export function ProfileSummaryCard({
  name,
  specialty,
  location,
  experience,
  readiness,
  completeness
}: ProfileSummaryProps) {
  const readinessConfig = {
    READY_NOW: { label: "Ready to Deploy", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    NEAR_READY: { label: "Near Ready", color: "bg-blue-50 text-blue-700 border-blue-200" },
    FUTURE_PIPELINE: { label: "Future Pipeline", color: "bg-slate-50 text-slate-700 border-slate-200" }
  }

  const rConfig = readinessConfig[readiness]

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary font-bold text-xl">
            {name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          <div className="flex-1 w-full space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-foreground">{name}</h3>
                <p className="text-primary font-medium text-sm">{specialty}</p>
              </div>
              <Badge variant="outline" className={rConfig.color}>{rConfig.label}</Badge>
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} /> <span>{location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase size={14} /> <span>{experience} Yrs Exp.</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-500">Profile Completeness</span>
                <span className="font-bold text-primary">{completeness}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${completeness}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
