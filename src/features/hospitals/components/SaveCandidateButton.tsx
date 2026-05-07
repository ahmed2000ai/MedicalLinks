"use client"

import { useState, useTransition } from "react"
import { Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleSaveCandidate } from "@/features/hospitals/save-actions"
import { cn } from "@/lib/utils"

interface SaveCandidateButtonProps {
  applicantProfileId: string
  initialSaved: boolean
}

export function SaveCandidateButton({
  applicantProfileId,
  initialSaved
}: SaveCandidateButtonProps) {
  const [saved, setSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleSaveCandidate(applicantProfileId)
      setSaved(result.saved)
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "gap-2 transition-colors",
        saved
          ? "border-blue-300 bg-blue-50 text-blue-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          : "hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
      )}
      title={saved ? "Remove from saved" : "Save candidate"}
    >
      <Bookmark
        className={cn("h-4 w-4 transition-all", saved && "fill-current")}
      />
      {saved ? "Saved" : "Save"}
    </Button>
  )
}
