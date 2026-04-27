import * as React from "react"
import { cn } from "@/lib/utils"
import { ShieldCheck, AlertTriangle, Clock, XCircle } from "lucide-react"

// -------------------------------------------------------------------------
// ApplicationStageBadge — maps ApplicationStatus enum values to styled labels
// -------------------------------------------------------------------------

type ApplicationStatus =
  | "DRAFT" | "NEW" | "SCREENING" | "QUALIFIED" | "NURTURE"
  | "NEEDS_DOCUMENTS" | "SHORTLIST_SENT" | "INTERVIEWING"
  | "OFFER_STAGE" | "ONBOARDING" | "HIRED"
  | "REJECTED" | "WITHDRAWN" | "ON_HOLD" | "ARCHIVED"

const APPLICATION_STATUS_CONFIG: Record<ApplicationStatus, {
  label: string
  className: string
}> = {
  DRAFT:           { label: "Draft",             className: "bg-slate-100 text-slate-600 border-slate-200" },
  NEW:             { label: "New",               className: "bg-blue-50 text-blue-700 border-blue-200" },
  SCREENING:       { label: "Screening",         className: "bg-blue-50 text-blue-700 border-blue-200" },
  QUALIFIED:       { label: "Qualified",         className: "bg-teal-50 text-teal-700 border-teal-200" },
  NURTURE:         { label: "Nurture",           className: "bg-purple-50 text-purple-700 border-purple-200" },
  NEEDS_DOCUMENTS: { label: "Docs Required",     className: "bg-orange-50 text-orange-700 border-orange-200" },
  SHORTLIST_SENT:  { label: "Shortlisted",       className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  INTERVIEWING:    { label: "Interviewing",      className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  OFFER_STAGE:     { label: "Offer Stage",       className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  ONBOARDING:      { label: "Onboarding",        className: "bg-emerald-50 text-emerald-800 border-emerald-300" },
  HIRED:           { label: "Hired",             className: "bg-green-100 text-green-800 border-green-300" },
  REJECTED:        { label: "Rejected",          className: "bg-red-50 text-red-700 border-red-200" },
  WITHDRAWN:       { label: "Withdrawn",         className: "bg-slate-100 text-slate-500 border-slate-200" },
  ON_HOLD:         { label: "On Hold",           className: "bg-yellow-50 text-yellow-600 border-yellow-200" },
  ARCHIVED:        { label: "Archived",          className: "bg-slate-100 text-slate-400 border-slate-200" },
}

interface ApplicationStageBadgeProps {
  status: ApplicationStatus
  className?: string
}

export function ApplicationStageBadge({ status, className }: ApplicationStageBadgeProps) {
  const config = APPLICATION_STATUS_CONFIG[status] ?? { label: status, className: "bg-slate-100 text-slate-600 border-slate-200" }
  return (
    <span className={cn(
      "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold",
      config.className,
      className
    )}>
      {config.label}
    </span>
  )
}

// -------------------------------------------------------------------------
// CredentialBadge — for license authorities like SCFHS, DHA, DOH, GMC
// -------------------------------------------------------------------------

interface CredentialBadgeProps {
  authority: string
  status?: "ACTIVE" | "EXPIRED" | "PENDING" | "NOT_HELD"
  className?: string
}

const CREDENTIAL_STATUS_CONFIG = {
  ACTIVE:   { icon: ShieldCheck, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  EXPIRED:  { icon: XCircle,     className: "bg-red-50 text-red-700 border-red-200" },
  PENDING:  { icon: Clock,       className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  NOT_HELD: { icon: AlertTriangle, className: "bg-slate-50 text-slate-500 border-slate-200" },
}

export function CredentialBadge({ authority, status = "ACTIVE", className }: CredentialBadgeProps) {
  const config = CREDENTIAL_STATUS_CONFIG[status]
  const Icon = config.icon
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold",
      config.className,
      className
    )}>
      <Icon size={12} />
      {authority}
    </span>
  )
}

// -------------------------------------------------------------------------
// ReadinessBadge — maps ReadinessLabel to styled labels
// -------------------------------------------------------------------------

type ReadinessLabel = "READY_NOW" | "NEAR_READY" | "FUTURE_PIPELINE" | "NOT_A_FIT"

const READINESS_CONFIG: Record<ReadinessLabel, { label: string; className: string }> = {
  READY_NOW:       { label: "Ready to Deploy",  className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  NEAR_READY:      { label: "Near Ready",        className: "bg-blue-50 text-blue-700 border-blue-200" },
  FUTURE_PIPELINE: { label: "Future Pipeline",   className: "bg-slate-100 text-slate-600 border-slate-200" },
  NOT_A_FIT:       { label: "Not a Fit",         className: "bg-red-50 text-red-600 border-red-200" },
}

interface ReadinessBadgeProps {
  readiness: ReadinessLabel
  className?: string
}

export function ReadinessBadge({ readiness, className }: ReadinessBadgeProps) {
  const config = READINESS_CONFIG[readiness]
  return (
    <span className={cn(
      "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold",
      config.className,
      className
    )}>
      {config.label}
    </span>
  )
}

// -------------------------------------------------------------------------
// OpportunityStatusBadge
// -------------------------------------------------------------------------

type OpportunityStatus = "INTAKE" | "ACTIVE" | "PAUSED" | "CLOSED" | "FILLED"

const OPPORTUNITY_STATUS_CONFIG: Record<OpportunityStatus, { label: string; className: string }> = {
  INTAKE:  { label: "Intake",  className: "bg-slate-100 text-slate-600 border-slate-200" },
  ACTIVE:  { label: "Active",  className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  PAUSED:  { label: "Paused",  className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  CLOSED:  { label: "Closed",  className: "bg-slate-100 text-slate-500 border-slate-200" },
  FILLED:  { label: "Filled",  className: "bg-blue-50 text-blue-700 border-blue-200" },
}

interface OpportunityStatusBadgeProps {
  status: OpportunityStatus
  className?: string
}

export function OpportunityStatusBadge({ status, className }: OpportunityStatusBadgeProps) {
  const config = OPPORTUNITY_STATUS_CONFIG[status]
  return (
    <span className={cn(
      "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold",
      config.className,
      className
    )}>
      {config.label}
    </span>
  )
}
