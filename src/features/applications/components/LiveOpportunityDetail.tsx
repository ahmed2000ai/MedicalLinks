"use client"

import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { Building, MapPin, DollarSign, Calendar, FileCheck, CheckCircle2, Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContentSection } from "@/components/ui/layout-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EMPLOYMENT_TYPE_LABELS } from "@/features/hospitals/types"
import { applyToOpportunity, toggleSavedOpportunity } from "../actions"
import { MatchIndicator } from "@/features/matching/components/MatchIndicator"
import { MatchResult } from "@/features/matching/types"

export function LiveOpportunityDetail({ opportunity, hasApplied, initialIsSaved, match }: { opportunity: any, hasApplied: boolean, initialIsSaved: boolean, match?: MatchResult }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isApplying, setIsApplying] = useState(false)
  
  // Optimistic UI for saved state
  const [isSaved, setIsSaved] = useState(initialIsSaved)

  const handleApply = () => {
    setIsApplying(true)
    startTransition(async () => {
      try {
        await applyToOpportunity(opportunity.id)
        router.push(`/applications`)
      } catch (err) {
        setIsApplying(false)
        alert(err instanceof Error ? err.message : "Failed to apply")
      }
    })
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    startTransition(async () => {
      await toggleSavedOpportunity(opportunity.id)
    })
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-card p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-2xl font-bold">{opportunity.title}</h1>
          <p className="text-lg text-muted-foreground mt-1">{opportunity.specialty}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" size="icon" onClick={handleSave} disabled={isPending}>
            {isSaved ? <BookmarkCheck size={18} className="text-primary" /> : <Bookmark size={18} />}
          </Button>
          {hasApplied ? (
            <Button variant="secondary" disabled>Already Applied</Button>
          ) : (
            <Button onClick={handleApply} disabled={isApplying || isPending}>
              {isApplying ? "Applying..." : "Apply Now"}
            </Button>
          )}
        </div>
      </div>

      {match && (
        <div className="mb-6">
          <MatchIndicator match={match} showReasons={true} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <ContentSection title="Role Description">
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{opportunity.description}</p>
          </ContentSection>

          <ContentSection title="Requirements" description="Expected qualifications.">
            <ul className="space-y-2">
              <li className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg border border-border text-sm">
                <FileCheck size={16} className="text-primary shrink-0 mt-0.5" />
                <span>Minimum {opportunity.minYearsExperience || 0} years experience ({opportunity.minYearsPostSpecialty || 0} post-specialty).</span>
              </li>
              {opportunity.boardCertRequired && (
                <li className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg border border-border text-sm">
                  <FileCheck size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>Board Certification Required.</span>
                </li>
              )}
              {opportunity.requirements.map((req: any) => (
                <li key={req.id} className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg border border-border text-sm">
                  <FileCheck size={16} className={req.isMandatory ? "text-primary shrink-0 mt-0.5" : "text-muted-foreground shrink-0 mt-0.5"} />
                  <span>{req.description}</span>
                </li>
              ))}
            </ul>
          </ContentSection>
        </div>

        <div className="space-y-6">
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
                    {opportunity.salaryRangeMin ? `${opportunity.salaryRangeMin.toLocaleString()} - ${opportunity.salaryRangeMax?.toLocaleString()} ${opportunity.currency}` : "Competitive"}
                  </p>
                  <p className="text-xs text-muted-foreground">{EMPLOYMENT_TYPE_LABELS[opportunity.employmentType as keyof typeof EMPLOYMENT_TYPE_LABELS]}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Package & Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {opportunity.housingAllowance && (
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 size={14} className="text-green-600" /> Housing Included</li>
                )}
                {opportunity.annualFlights > 0 && (
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 size={14} className="text-green-600" /> {opportunity.annualFlights} Annual Flights</li>
                )}
                {opportunity.healthInsurance && (
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 size={14} className="text-green-600" /> Health Insurance</li>
                )}
                {opportunity.visaSponsorship && (
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 size={14} className="text-green-600" /> Visa Sponsorship</li>
                )}
                {opportunity.benefits.map((ben: any) => (
                  <li key={ben.id} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={14} className="text-green-600 shrink-0" />
                    <span>{ben.description}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
