"use client"

import React, { useState } from "react"
import { ProgressStepper, Step } from "@/components/ui/progress-stepper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PersonalDetailsStep } from "./steps/PersonalDetailsStep"
import { ProfessionalSummaryStep } from "./steps/ProfessionalSummaryStep"
import { EducationTrainingStep } from "./steps/EducationTrainingStep"
import { LicensureExamsStep } from "./steps/LicensureExamsStep"
import { WorkExperienceStep } from "./steps/WorkExperienceStep"
import { PreferencesDocumentsStep } from "./steps/PreferencesDocumentsStep"
import { useRouter } from "next/navigation"

const WIZARD_STEPS: Step[] = [
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
        return <PersonalDetailsStep data={initialData} onNext={handleNext} />
      case 1:
        return <ProfessionalSummaryStep data={initialData} onNext={handleNext} onBack={handleBack} />
      case 2:
        return <EducationTrainingStep data={initialData} onNext={handleNext} onBack={handleBack} />
      case 3:
        return <LicensureExamsStep data={initialData} onNext={handleNext} onBack={handleBack} />
      case 4:
        return <WorkExperienceStep data={initialData} onNext={handleNext} onBack={handleBack} />
      case 5:
        return <PreferencesDocumentsStep data={initialData} onNext={handleNext} onBack={handleBack} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
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
