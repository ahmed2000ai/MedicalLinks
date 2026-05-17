import React from "react"
import Link from "next/link"
import { MapPin, Briefcase, Clock, Award, ShieldCheck, UserCircle, BookOpen, Activity, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SaveCandidateButton } from "./SaveCandidateButton"
import { MessageDoctorButton } from "./MessageDoctorButton"

interface CandidateCardProps {
  candidate: any
  initialSaved?: boolean
}

export function CandidateCard({ candidate, initialSaved = false }: CandidateCardProps) {
  const isAnonymous = candidate.preferences?.visibility === "ANONYMOUS"
  const displayName = isAnonymous 
    ? "Confidential Candidate" 
    : `${candidate.user?.firstName || ""} ${candidate.user?.lastName || ""}`.trim()

  const currentRole = candidate.workExperiences?.find((w: any) => w.isCurrent)
  const currentTitle = candidate.currentJobTitle || currentRole?.title || "Medical Professional"
  const currentEmployer = candidate.currentEmployer || currentRole?.hospitalName || "Confidential Employer"
  
  // Deriving specialty (assuming it's stored in headline or from training)
  const specialty = candidate.professionalSummary || "General Medicine" // Fallback placeholder if not strictly typed yet

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6">
      
      {/* Avatar Placeholder */}
      <div className="hidden md:flex flex-col items-center gap-3 shrink-0">
        <div className="h-20 w-20 rounded-full bg-slate-100 border flex items-center justify-center text-slate-400">
          <UserCircle className="h-12 w-12" />
        </div>
        {candidate.readinessLabel && (
          <Badge variant="outline" className="text-xs font-normal">
            {candidate.readinessLabel.replace("_", " ")}
          </Badge>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-slate-900">{displayName}</h2>
              {candidate.preferences?.openToOpportunities === "ACTIVE" && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 ml-2 shadow-none border-none">
                  Open to Roles
                </Badge>
              )}
            </div>
            <p className="text-primary font-medium text-sm md:text-base">{currentTitle}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-slate-600">
              {candidate.totalYearsExperience !== null && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {candidate.totalYearsExperience} Yrs Exp
                </span>
              )}
              {candidate.countryOfResidence && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {candidate.currentCity ? `${candidate.currentCity}, ` : ""}{candidate.countryOfResidence}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-slate-400" />
                {currentEmployer}
              </span>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <MessageDoctorButton applicantProfileId={candidate.id} />
            <SaveCandidateButton
              applicantProfileId={candidate.id}
              initialSaved={initialSaved}
            />
            <Button size="sm" asChild>
              <Link href={`/hospitals/candidates/${candidate.id}`}>
                View Profile
              </Link>
            </Button>
          </div>
        </div>

        {/* Badges / Highlights */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {candidate.preferences?.relocationWilling && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal shadow-none">
              Willing to Relocate
            </Badge>
          )}
          {candidate.medicalLicenses?.map((lic: any) => (
            <Badge key={lic.id} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 font-normal flex gap-1 items-center shadow-none">
              <ShieldCheck className="h-3 w-3" /> {lic.issuingAuthority} License
            </Badge>
          ))}
          {candidate.boardCertifications?.map((board: any) => (
            <Badge key={board.id} variant="secondary" className="bg-slate-100 text-slate-600 font-normal flex gap-1 items-center shadow-none">
              <Award className="h-3 w-3" /> {board.boardName}
            </Badge>
          ))}
          {candidate.languages && candidate.languages.length > 0 && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal flex gap-1 items-center shadow-none">
              <Globe className="h-3 w-3" /> {candidate.languages.map((l: any) => l.language).join(", ")}
            </Badge>
          )}
          {candidate.publications && candidate.publications.length > 0 && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal flex gap-1 items-center shadow-none">
              <BookOpen className="h-3 w-3" /> {candidate.publications.length} Publication{candidate.publications.length > 1 ? "s" : ""}
            </Badge>
          )}
          {candidate.clinicalProcedures && candidate.clinicalProcedures.length > 0 && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal flex gap-1 items-center shadow-none">
              <Activity className="h-3 w-3" /> {candidate.clinicalProcedures.length} Procedure{candidate.clinicalProcedures.length > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        {/* Short Summary */}
        {candidate.professionalSummary && (
           <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
             {candidate.professionalSummary}
           </p>
        )}

      </div>
    </div>
  )
}
