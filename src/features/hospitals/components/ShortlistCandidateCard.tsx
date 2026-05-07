"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { ShortlistStage } from "@prisma/client"
import { MapPin, Briefcase, Clock, ShieldCheck, Award, MessageSquare, StickyNote, MoreVertical, Trash2, ChevronDown, UserCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { moveCandidateStage, updateCandidateNotes, removeCandidateFromShortlist } from "../shortlist-actions"
import { MessageDoctorButton } from "./MessageDoctorButton"
import { InviteToInterviewButton } from "@/features/interviews/components/InviteToInterviewButton"
import { MarkAsHiredButton } from "@/features/placements/components/MarkAsHiredButton"

// Map stages to human-readable labels
const STAGE_LABELS: Record<ShortlistStage, string> = {
  SAVED: "Saved",
  REVIEWING: "Reviewing",
  INTERVIEW_INVITED: "Interview Invited",
  INTERVIEW_COMPLETED: "Interview Completed",
  OFFER_CONSIDERATION: "Offer Consideration",
  HIRED: "Hired",
  REJECTED: "Rejected"
}

type ShortlistCandidateCardProps = {
  candidate: any // The safeProfile with SavedCandidate fields at the root
}

export function ShortlistCandidateCard({ candidate }: ShortlistCandidateCardProps) {
  const [isPending, startTransition] = useTransition()
  const [notesOpen, setNotesOpen] = useState(false)
  const [currentNotes, setCurrentNotes] = useState(candidate.notes || "")

  const profile = candidate.applicantProfile
  const prefs = profile.preferences

  const isAnonymous = prefs?.visibility === "ANONYMOUS"
  const displayName = isAnonymous
    ? "Confidential Candidate"
    : `${profile.user?.firstName || ""} ${profile.user?.lastName || ""}`.trim() || "Medical Professional"

  const initials = isAnonymous
    ? "CC"
    : displayName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()

  const currentExp = profile.workExperiences?.find((w: any) => w.isCurrent)
  const currentTitle = profile.currentJobTitle || currentExp?.title || "Medical Professional"
  const currentEmployer = profile.currentEmployer || currentExp?.hospitalName

  const readinessMap: Record<string, { label: string; color: string }> = {
    READY_NOW: { label: "Ready Now", color: "bg-green-100 text-green-800" },
    NEAR_READY: { label: "Near Ready", color: "bg-blue-100 text-blue-800" },
    FUTURE_PIPELINE: { label: "Future Pipeline", color: "bg-slate-100 text-slate-700" },
    NOT_A_FIT: { label: "Not a Fit", color: "bg-red-100 text-red-700" },
  }
  const readinessInfo = profile.readinessLabel ? readinessMap[profile.readinessLabel as string] : null

  const handleStageChange = (newStage: ShortlistStage) => {
    if (newStage === candidate.stage) return
    startTransition(async () => {
      await moveCandidateStage(profile.id, newStage)
    })
  }

  const handleSaveNotes = () => {
    startTransition(async () => {
      await updateCandidateNotes(profile.id, currentNotes)
      setNotesOpen(false)
    })
  }

  const handleRemove = () => {
    if (!confirm("Are you sure you want to remove this candidate from your shortlist?")) return
    startTransition(async () => {
      await removeCandidateFromShortlist(profile.id)
    })
  }

  return (
    <>
      <Card className={`relative overflow-hidden transition-all duration-200 border-slate-200 hover:border-blue-200 hover:shadow-md ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-5">
          {/* Avatar Area */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-600 font-bold text-xl flex items-center justify-center shrink-0">
              {isAnonymous ? <UserCircle className="h-8 w-8 text-slate-400" /> : initials}
            </div>
            
            {/* Stage Dropdown (Native) */}
            <select
              value={candidate.stage}
              onChange={(e) => handleStageChange(e.target.value as ShortlistStage)}
              className="text-xs py-1 px-2 border border-slate-200 rounded-md bg-slate-50 text-slate-700 w-full sm:w-auto font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            >
              {Object.entries(STAGE_LABELS).map(([stage, label]) => (
                <option key={stage} value={stage}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Core Info */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-slate-900 truncate">
                    <Link href={`/hospitals/candidates/${profile.id}`} className="hover:text-blue-600 hover:underline">
                      {displayName}
                    </Link>
                  </h3>
                  {readinessInfo && (
                    <Badge variant="secondary" className={`${readinessInfo.color} font-medium border-none shadow-none`}>
                      {readinessInfo.label}
                    </Badge>
                  )}
                </div>

                <p className="text-sm font-medium text-primary line-clamp-1">{currentTitle}</p>
                {currentEmployer && (
                  <p className="text-sm text-slate-600 mt-0.5 line-clamp-1 flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 shrink-0" />
                    {currentEmployer}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                  {profile.countryOfResidence && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {profile.currentCity ? `${profile.currentCity}, ${profile.countryOfResidence}` : profile.countryOfResidence}
                    </span>
                  )}
                  {profile.totalYearsExperience != null && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {profile.totalYearsExperience} yrs exp.
                    </span>
                  )}
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="flex gap-1 -mr-2">
                <Button variant="ghost" size="icon" onClick={() => setNotesOpen(true)} className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                  <StickyNote className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleRemove()} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-auto pt-4 flex flex-wrap items-center gap-2">
              <Button asChild variant="default" size="sm" className="h-8 text-xs gap-1.5">
                <Link href={`/hospitals/candidates/${profile.id}`}>
                  View Profile
                </Link>
              </Button>
              <MessageDoctorButton applicantProfileId={profile.id} variant="outline" size="sm" className="h-8 text-xs gap-1.5 text-slate-600" />
              <InviteToInterviewButton
                applicantProfileId={profile.id}
                candidateName={displayName}
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 text-slate-600"
              />
              {["INTERVIEW_COMPLETED", "OFFER_CONSIDERATION"].includes(candidate.stage) && (
                <MarkAsHiredButton
                  applicantProfileId={profile.id}
                  candidateName={displayName}
                  hospitalId={candidate.hospitalId}
                  suggestedSource="SHORTLIST_BASED"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5 text-green-700 border-green-300 hover:bg-green-50"
                />
              )}
              
              {/* Notes Preview if exists */}
              {candidate.notes && (
                <div 
                  className="ml-auto flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-md cursor-pointer hover:bg-amber-100 transition-colors"
                  onClick={() => setNotesOpen(true)}
                  title={candidate.notes}
                >
                  <StickyNote className="h-3.5 w-3.5" />
                  <span className="max-w-[150px] truncate font-medium">Notes attached</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Dialog */}
      <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Internal Notes</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-500 mb-3">
              Add private notes for {displayName}. These notes are only visible to your hospital team.
            </p>
            <Textarea
              value={currentNotes}
              onChange={(e) => setCurrentNotes(e.target.value)}
              placeholder="e.g. Follow up next week about DHA license status..."
              className="min-h-[120px] resize-none"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotes} disabled={isPending}>
              {isPending ? "Saving..." : "Save Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
