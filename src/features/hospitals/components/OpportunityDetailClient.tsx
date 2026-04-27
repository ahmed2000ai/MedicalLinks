"use client"

import { ContentSection } from "@/components/ui/layout-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OPPORTUNITY_STATUS_LABELS, OPPORTUNITY_STATUS_COLORS, EMPLOYMENT_TYPE_LABELS, URGENCY_LABELS } from "../types"
import { setOpportunityStatus, addRequirement, removeRequirement, addBenefit, removeBenefit } from "../actions"
import { useTransition } from "react"
import { Building, MapPin, DollarSign, Calendar, FileCheck, CheckCircle2, Trash2 } from "lucide-react"

export function OpportunityDetailClient({ opportunity }: { opportunity: any }) {
  const [isPending, startTransition] = useTransition()
  const statusStyle = OPPORTUNITY_STATUS_COLORS[opportunity.status as keyof typeof OPPORTUNITY_STATUS_COLORS] || { text: "text-gray-700", bg: "bg-gray-100" }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Description</CardTitle>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text}`}>
              {OPPORTUNITY_STATUS_LABELS[opportunity.status as keyof typeof OPPORTUNITY_STATUS_LABELS]}
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground whitespace-pre-wrap">{opportunity.description}</p>
            {opportunity.internalNotes && (
              <div className="mt-4 pt-3 border-t border-border bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Internal Notes (Recruiter Only)</p>
                <p className="text-sm text-amber-900/80 whitespace-pre-wrap">{opportunity.internalNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Key Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Building size={16} className="text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{opportunity.hospital.name}</p>
                {opportunity.department && <p className="text-xs text-muted-foreground">{opportunity.department.name}</p>}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm">{opportunity.city ? `${opportunity.city}, ` : ""}{opportunity.country}</p>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign size={16} className="text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm">
                  {opportunity.salaryRangeMin ? `${opportunity.salaryRangeMin.toLocaleString()} - ${opportunity.salaryRangeMax?.toLocaleString()} ${opportunity.currency}` : "Unspecified"}
                </p>
                <p className="text-xs text-muted-foreground">{EMPLOYMENT_TYPE_LABELS[opportunity.employmentType as keyof typeof EMPLOYMENT_TYPE_LABELS]}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm">{opportunity.targetStartDate ? new Date(opportunity.targetStartDate).toLocaleDateString() : "ASAP"}</p>
                <p className="text-xs text-muted-foreground">Target Start · {URGENCY_LABELS[opportunity.urgency]}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requirements & Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContentSection title="Requirements" description="Mandatory and preferred qualifications.">
          <div className="space-y-3">
            {/* Hardcoded requirement fields from schema */}
            <div className="grid grid-cols-2 gap-2 text-sm mb-4 bg-muted/30 p-3 rounded-lg border border-border">
              <div className="flex flex-col gap-1"><span className="text-xs text-muted-foreground">Min Experience</span><span className="font-medium">{opportunity.minYearsExperience || 0} years</span></div>
              <div className="flex flex-col gap-1"><span className="text-xs text-muted-foreground">Post-Specialty</span><span className="font-medium">{opportunity.minYearsPostSpecialty || 0} years</span></div>
              <div className="flex flex-col gap-1"><span className="text-xs text-muted-foreground">Board Cert</span><span className="font-medium">{opportunity.boardCertRequired ? "Required" : "Optional"}</span></div>
              <div className="flex flex-col gap-1"><span className="text-xs text-muted-foreground">Licensing</span><span className="font-medium truncate">{opportunity.licensingRequirement || "Standard"}</span></div>
            </div>

            {/* Custom requirements */}
            {opportunity.requirements.length > 0 && (
              <ul className="space-y-2">
                {opportunity.requirements.map((req: any) => (
                  <li key={req.id} className="flex justify-between items-start gap-2 p-2 border border-border rounded-lg bg-card">
                    <div className="flex items-start gap-2">
                      <FileCheck size={16} className={req.isMandatory ? "text-primary shrink-0 mt-0.5" : "text-muted-foreground shrink-0 mt-0.5"} />
                      <span className="text-sm">{req.description} {req.isMandatory ? <span className="text-[10px] bg-red-100 text-red-700 px-1 rounded uppercase">Must have</span> : <span className="text-[10px] bg-gray-100 text-gray-700 px-1 rounded uppercase">Nice to have</span>}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700" onClick={() => startTransition(() => removeRequirement(req.id, opportunity.id))} disabled={isPending}>
                      <Trash2 size={12} />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            
            <form action={(data) => startTransition(() => addRequirement(opportunity.id, data.get("description") as string, data.get("isMandatory") === "true"))} className="flex gap-2">
              <input name="description" placeholder="New requirement..." required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
              <select name="isMandatory" className="h-9 rounded-md border border-input bg-transparent px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <option value="true">Mandatory</option>
                <option value="false">Preferred</option>
              </select>
              <Button size="sm" type="submit" disabled={isPending}>Add</Button>
            </form>
          </div>
        </ContentSection>

        <ContentSection title="Package & Benefits" description="Compensation and support details.">
          <div className="space-y-3">
             {/* Hardcoded benefits from schema */}
             <div className="grid grid-cols-2 gap-2 text-sm mb-4 bg-muted/30 p-3 rounded-lg border border-border">
              <div className="flex flex-col gap-1"><span className="text-xs text-muted-foreground">Housing</span><span className="font-medium">{opportunity.housingAllowance ? "Included" : "Not specified"}</span></div>
              <div className="flex flex-col gap-1"><span className="text-xs text-muted-foreground">Flights</span><span className="font-medium">{opportunity.annualFlights ? `${opportunity.annualFlights}/yr` : "Not specified"}</span></div>
              <div className="flex flex-col gap-1"><span className="text-xs text-muted-foreground">Visa Support</span><span className="font-medium">{opportunity.visaSponsorship ? "Provided" : "Not provided"}</span></div>
              <div className="flex flex-col gap-1"><span className="text-xs text-muted-foreground">Annual Leave</span><span className="font-medium">{opportunity.leaveAllowanceDays ? `${opportunity.leaveAllowanceDays} days` : "Standard"}</span></div>
            </div>

            {/* Custom benefits */}
            {opportunity.benefits.length > 0 && (
              <ul className="space-y-2">
                {opportunity.benefits.map((ben: any) => (
                  <li key={ben.id} className="flex justify-between items-start gap-2 p-2 border border-border rounded-lg bg-card">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm">{ben.description}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700" onClick={() => startTransition(() => removeBenefit(ben.id, opportunity.id))} disabled={isPending}>
                      <Trash2 size={12} />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            
            <form action={(data) => startTransition(() => addBenefit(opportunity.id, data.get("description") as string))} className="flex gap-2">
              <input name="description" placeholder="New benefit (e.g. Education allowance)..." required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
              <Button size="sm" type="submit" disabled={isPending}>Add</Button>
            </form>
          </div>
        </ContentSection>
      </div>
      
      {/* Danger Zone / State Management */}
      <Card className="border-border">
        <CardHeader className="pb-4 border-b border-border">
          <CardTitle className="text-base">Role Lifecycle</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex items-center gap-3">
          {opportunity.status !== "ACTIVE" && (
            <Button onClick={() => startTransition(() => setOpportunityStatus(opportunity.id, "ACTIVE"))} disabled={isPending}>Publish Role</Button>
          )}
          {opportunity.status === "ACTIVE" && (
            <Button variant="outline" onClick={() => startTransition(() => setOpportunityStatus(opportunity.id, "PAUSED"))} disabled={isPending}>Pause Role</Button>
          )}
          {opportunity.status !== "CLOSED" && opportunity.status !== "FILLED" && (
            <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={() => startTransition(() => setOpportunityStatus(opportunity.id, "CLOSED"))} disabled={isPending}>Close Vacancy</Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
