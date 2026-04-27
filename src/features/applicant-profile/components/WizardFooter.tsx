"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Save } from "lucide-react"

interface WizardFooterProps {
  onBack?: () => void
  isSubmitting?: boolean
  onSaveDraft?: () => void
}

export function WizardFooter({ onBack, isSubmitting, onSaveDraft }: WizardFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-border p-6 bg-muted/20">
      <div>
        {onBack ? (
          <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
            <ArrowLeft size={16} className="mr-2" /> Back
          </Button>
        ) : (
          <div /> // placeholder for flex space-between
        )}
      </div>
      <div className="flex gap-3">
        {onSaveDraft && (
          <Button type="button" variant="ghost" onClick={onSaveDraft} disabled={isSubmitting}>
            <Save size={16} className="mr-2" /> Save as Draft
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save & Continue"}
          {!isSubmitting && <ArrowRight size={16} className="ml-2" />}
        </Button>
      </div>
    </div>
  )
}
