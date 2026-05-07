"use client"

import React, { useState } from "react"
import { ProgressStepper, Step } from "@/components/ui/progress-stepper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CvImportStep } from "./steps/CvImportStep"
import { PersonalDetailsStep } from "./steps/PersonalDetailsStep"
import { ProfessionalSummaryStep } from "./steps/ProfessionalSummaryStep"
import { EducationTrainingStep } from "./steps/EducationTrainingStep"
import { LicensureExamsStep } from "./steps/LicensureExamsStep"
import { WorkExperienceStep } from "./steps/WorkExperienceStep"
import { PreferencesDocumentsStep } from "./steps/PreferencesDocumentsStep"
import { useRouter } from "next/navigation"
import { mergeCvDataWithProfile } from "../cv-mapping"
import { FeedbackAlert } from "@/components/ui/feedback"

const WIZARD_STEPS: Step[] = [
  { id: "cv-import", title: "CV Import" },
  { id: "personal", title: "Personal Details" },
  { id: "summary", title: "Professional Summary" },
  { id: "education", title: "Education & Training" },
  { id: "licensure", title: "Licensure & Exams" },
  { id: "work", title: "Work Experience" },
  { id: "preferences", title: "Preferences" },
]

export function ProfileWizard({ initialData }: { initialData: any }) {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  
  const mergedData = mergeCvDataWithProfile(initialData)
  const hasPrefilledData = !!initialData?.profile?.cvExtractionData

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CvImportStep data={mergedData} onNext={handleNext} />
      case 1:
        return <PersonalDetailsStep data={mergedData} onNext={handleNext} />
      case 2:
        return <ProfessionalSummaryStep data={mergedData} onNext={handleNext} onBack={handleBack} />
      case 3:
        return <EducationTrainingStep data={mergedData} onNext={handleNext} onBack={handleBack} />
      case 4:
        return <LicensureExamsStep data={mergedData} onNext={handleNext} onBack={handleBack} />
      case 5:
        return <WorkExperienceStep data={mergedData} onNext={handleNext} onBack={handleBack} />
      case 6:
        return <PreferencesDocumentsStep data={mergedData} onNext={handleNext} onBack={handleBack} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {hasPrefilledData && currentStep > 0 && (
        <FeedbackAlert 
          type="info" 
          title="CV Data Imported" 
          message="We've pre-filled some sections using your imported CV. Please review and confirm the details below." 
        />
      )}
      <Card>
        <CardContent className="pt-6">
          <ProgressStepper steps={WIZARD_STEPS} currentStep={currentStep} />
        </CardContent>
      </Card>
      
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        {renderStep()}
      </div>
    </div>
  )
}
