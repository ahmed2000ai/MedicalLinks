"use client"

import React, { useState, useRef } from "react"
import { extractDoctorProfileFromCv, CvExtractionResult } from "../cv-extraction"
import { Button } from "@/components/ui/button"
import { FeedbackAlert } from "@/components/ui/feedback"
import { UploadCloud, FileText, CheckCircle2, Loader2, Plus, X } from "lucide-react"

export function GlobalCvImportAction({ onApplyExtraction }: { onApplyExtraction: (data: CvExtractionResult) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [extractionResult, setExtractionResult] = useState<CvExtractionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (selected.type !== "application/pdf") {
        setError("Please upload a valid PDF file.")
        setFile(null)
        return
      }
      if (selected.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit.")
        setFile(null)
        return
      }
      setError(null)
      setFile(selected)
      setExtractionResult(null)
    }
  }

  const handleExtract = async () => {
    if (!file) return
    setIsUploading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append("cv", file)
      
      const result = await extractDoctorProfileFromCv(formData)
      setExtractionResult(result)
    } catch (err: any) {
      setError(err.message || "An error occurred during extraction. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleApply = () => {
    if (extractionResult) {
      onApplyExtraction(extractionResult)
      setIsOpen(false)
      setExtractionResult(null)
      setFile(null)
    }
  }

  if (!isOpen) {
    return (
      <div className="mb-6 flex justify-end">
        <Button variant="outline" onClick={() => setIsOpen(true)} className="gap-2 bg-slate-50 hover:bg-slate-100 border-teal-200 text-teal-800">
          <UploadCloud className="w-4 h-4" /> Import CV to Auto-Fill Profile
        </Button>
      </div>
    )
  }

  return (
    <div className="mb-8 border border-border bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border bg-slate-50/50">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-teal-600" /> Upload CV
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">We will securely extract your professional details to speed up your registration.</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        {error && <div className="mb-4"><FeedbackAlert type="error" message={error} /></div>}

        {!extractionResult && (
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <input 
              type="file" 
              accept="application/pdf"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            {!file ? (
              <>
                <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
                <Button type="button" onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                  Browse PDF File
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                <div className="flex items-center gap-2 p-3 bg-white border border-border rounded-lg w-full">
                  <FileText className="w-5 h-5 text-teal-600 shrink-0" />
                  <span className="text-sm font-medium truncate flex-1 text-left">{file.name}</span>
                  <button 
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    Remove
                  </button>
                </div>
                <Button 
                  type="button" 
                  onClick={handleExtract} 
                  disabled={isUploading}
                  className="w-full gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Extracting Profile...
                    </>
                  ) : (
                    "Extract Profile Information"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {extractionResult && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-teal-50/50 border border-teal-100 text-teal-900 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              <div className="text-sm">
                <strong>Extraction Complete.</strong> Review the summary below. Applying this will populate empty fields across your profile.
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border rounded-lg p-4 bg-white text-sm space-y-1.5">
                <span className="font-semibold text-slate-800 block mb-2">Extracted Details</span>
                <div><span className="text-muted-foreground">Name:</span> {extractionResult.personal?.firstName} {extractionResult.personal?.lastName}</div>
                <div><span className="text-muted-foreground">Specialty:</span> {extractionResult.summary?.specialty}</div>
                <div><span className="text-muted-foreground">Experience:</span> {extractionResult.summary?.totalYearsExperience} years</div>
              </div>
              <div className="border border-border rounded-lg p-4 bg-white text-sm space-y-1.5">
                <span className="font-semibold text-slate-800 block mb-2">Found Records</span>
                <div><span className="text-muted-foreground">Education:</span> {extractionResult.educations?.length || 0} degrees</div>
                <div><span className="text-muted-foreground">Work History:</span> {extractionResult.work?.length || 0} roles</div>
                <div><span className="text-muted-foreground">Licenses/Boards:</span> {(extractionResult.licenses?.length || 0) + (extractionResult.boardCertifications?.length || 0)} records</div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
              <Button type="button" variant="ghost" onClick={() => setExtractionResult(null)}>
                Start Over
              </Button>
              <Button type="button" onClick={handleApply} className="gap-2">
                Apply to Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
