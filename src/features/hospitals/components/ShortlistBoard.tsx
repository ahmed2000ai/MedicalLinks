"use client"

import { useMemo } from "react"
import { ShortlistStage } from "@prisma/client"
import { ShortlistCandidateCard } from "./ShortlistCandidateCard"
import { Users, Inbox } from "lucide-react"

// Order of pipeline stages to display
const STAGE_ORDER: ShortlistStage[] = [
  "SAVED",
  "REVIEWING",
  "INTERVIEW_INVITED",
  "INTERVIEW_COMPLETED",
  "OFFER_CONSIDERATION",
  "HIRED",
  "REJECTED"
]

const STAGE_LABELS: Record<ShortlistStage, string> = {
  SAVED: "Saved",
  REVIEWING: "Reviewing",
  INTERVIEW_INVITED: "Interview Invited",
  INTERVIEW_COMPLETED: "Interview Completed",
  OFFER_CONSIDERATION: "Offer Consideration",
  HIRED: "Hired",
  REJECTED: "Rejected"
}

type ShortlistBoardProps = {
  candidates: any[]
}

export function ShortlistBoard({ candidates }: ShortlistBoardProps) {
  // Group candidates by stage
  const grouped = useMemo(() => {
    const map = new Map<ShortlistStage, any[]>()
    STAGE_ORDER.forEach(stage => map.set(stage, []))
    
    candidates.forEach(candidate => {
      const stage = candidate.stage as ShortlistStage
      if (map.has(stage)) {
        map.get(stage)!.push(candidate)
      }
    })
    
    return map
  }, [candidates])

  if (candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-xl border border-slate-200 border-dashed">
        <div className="h-16 w-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
          <Inbox className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Your Shortlist is Empty</h3>
        <p className="text-slate-500 max-w-sm mb-6">
          Save candidates from the search pool or their profiles to start building your hiring pipeline.
        </p>
      </div>
    )
  }

  // We use a vertical layout where each stage is a section containing cards.
  // This works better than horizontal columns for dense medical data.
  return (
    <div className="space-y-10">
      {STAGE_ORDER.map(stage => {
        const stageCandidates = grouped.get(stage) || []
        
        // Hide empty stages to keep the UI clean, except for SAVED
        if (stageCandidates.length === 0 && stage !== "SAVED") return null

        return (
          <div key={stage} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                {STAGE_LABELS[stage]}
              </h2>
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                {stageCandidates.length}
              </span>
            </div>
            
            {stageCandidates.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-slate-200 border-dashed text-slate-500 text-sm">
                No candidates in this stage.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {stageCandidates.map(candidate => (
                  <ShortlistCandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
