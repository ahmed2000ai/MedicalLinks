"use client"

import React, { useState, useRef } from "react"
import { extractDoctorProfileFromCv, CvExtractionResult } from "../../cv-extraction"
import { saveCvExtraction } from "../../actions"
import { Button } from "@/components/ui/button"
import { FormSection } from "@/components/ui/form-section"
import { FeedbackAlert } from "@/components/ui/feedback"
import { UploadCloud, FileText, CheckCircle2, ArrowRight, Loader2 } from "lucide-react"

export function CvImportStep({ data, onNext }: { data: any; onNext: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [extractionResult, setExtractionResult] = useState<CvExtractionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // If the user already has cvExtractionData and they haven't explicitly started a new upload, we could show it.
  // For simplicity, we just check if it exists in the initial data.
  const hasExistingExtraction = !!data?.profile?.cvExtractionData

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
      setError(err.message || "An error occurred during extraction. Please try again or skip.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveAndContinue = async () => {
    if (!extractionResult) return
    setIsSaving(true)
    setError(null)
    try {
      await saveCvExtraction(extractionResult)
      onNext()
    } catch (err: any) {
      setError(err.message || "Failed to save extraction data.")
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Fast-Track Your Profile</h2>
        <p className="text-muted-foreground mt-1">
          Upload your CV to securely extract your medical experience, education, and credentials. 
          You can review everything before adding it to your profile.
        </p>
      </div>

      {error && <FeedbackAlert type="error" message={error} />}

      {!extractionResult && (
        <FormSection title="Upload CV (PDF Only)">
          <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <UploadCloud className="w-12 h-12 text-teal-600 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Select a PDF file to upload</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              We will extract your professional details to speed up your registration. Your CV is stored securely.
            </p>
            
            <input 
              type="file" 
              accept="application/pdf"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            {!file ? (
              <Button type="button" onClick={() => fileInputRef.current?.click()} variant="outline">
                Browse Files
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                <div className="flex items-center gap-2 p-3 bg-white border border-border rounded-lg w-full">
                  <FileText className="w-5 h-5 text-teal-600" />
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
          
          <div className="mt-6 flex justify-between items-center pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">Prefer to enter everything manually?</p>
            <Button type="button" variant="ghost" onClick={onNext} className="gap-2 text-muted-foreground hover:text-foreground">
              Skip & Enter Manually <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </FormSection>
      )}

      {extractionResult && (
        <div className="space-y-6">
          <FeedbackAlert 
            type="success" 
            title="Extraction Complete" 
            message="We've successfully extracted the following information from your CV. Don't worry if anything is missing—you can fill it in manually on the next steps." 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-5 bg-white">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-teal-600" /> Personal Details
              </h4>
              <ul className="text-sm space-y-2 text-slate-600">
                <li><span className="font-medium">Name:</span> {extractionResult.personalInfo?.firstName} {extractionResult.personalInfo?.lastName}</li>
                {extractionResult.personalInfo?.dateOfBirth && (
                  <li><span className="font-medium">Date of Birth:</span> {extractionResult.personalInfo.dateOfBirth}</li>
                )}
                {extractionResult.personalInfo?.gender && (
                  <li><span className="font-medium">Gender:</span> {extractionResult.personalInfo.gender}</li>
                )}
                <li><span className="font-medium">Specialty:</span> {extractionResult.specialty} {extractionResult.subspecialty ? `(${extractionResult.subspecialty})` : ""}</li>
                <li><span className="font-medium">Location:</span> {extractionResult.personalInfo?.city}, {extractionResult.personalInfo?.countryOfResidence}</li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-5 bg-white">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-teal-600" /> Professional Experience
              </h4>
              <ul className="text-sm space-y-2 text-slate-600">
                <li><span className="font-medium">Total Experience:</span> {extractionResult.totalYearsExperience} years</li>
                <li><span className="font-medium">Recent Role:</span> {extractionResult.workExperience?.[0]?.title} at {extractionResult.workExperience?.[0]?.employer}</li>
                <li><span className="font-medium">Education:</span> {extractionResult.education?.length || 0} degrees found</li>
                <li><span className="font-medium">Licenses:</span> {extractionResult.licenses?.length || 0} licenses found</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-border mt-8">
            <Button type="button" variant="ghost" onClick={() => setExtractionResult(null)}>
              Start Over
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onNext} className="gap-2">
                Skip Import
              </Button>
              <Button type="button" onClick={handleSaveAndContinue} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save & Continue to Profile"}
                {!isSaving && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
