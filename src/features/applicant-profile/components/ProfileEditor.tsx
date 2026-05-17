"use client"

import React, { useState, useEffect, useRef } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProfileBuilderSchema, ProfileBuilderInput } from "../schemas"
import { PersonalDetailsTab } from "./tabs/PersonalDetailsTab"
import { ProfessionalSummaryTab } from "./tabs/ProfessionalSummaryTab"
import { EducationTrainingTab } from "./tabs/EducationTrainingTab"
import { LicensureExamsTab } from "./tabs/LicensureExamsTab"
import { WorkExperienceTab } from "./tabs/WorkExperienceTab"
import { ProfessionalActivitiesTab } from "./tabs/ProfessionalActivitiesTab"
import { PreferencesDocumentsTab } from "./tabs/PreferencesDocumentsTab"
import { ProfileSectionTabNav } from "./ProfileSectionTabNav"
import { GlobalCvImportAction } from "./GlobalCvImportAction"
import { Button } from "@/components/ui/button"
import { FeedbackAlert } from "@/components/ui/feedback"
import { Loader2, Save } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  updatePersonalDetails,
  updateProfessionalSummary,
  replaceEducationEntries,
  replaceTrainingEntries,
  replaceLicenses,
  replaceBoardCertifications,
  replaceCertifications,
  replaceWorkExperience,
  replaceProfessionalActivities,
  updatePreferences
} from "../actions"
import { CvExtractionResult } from "../cv-extraction"

const TABS = [
  { id: "personal", title: "Personal Details" },
  { id: "summary", title: "Professional Summary" },
  { id: "education", title: "Education & Training" },
  { id: "licensure", title: "Licensure & Exams" },
  { id: "work", title: "Work Experience" },
  { id: "activities", title: "Professional Activities" },
  { id: "preferences", title: "Preferences" },
]

export function ProfileEditor({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState("personal")
  const [error, setError] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  // Transform initialData to ProfileBuilderInput
  const profile = initialData?.profile || {}
  const user = initialData?.user || {}
  const prefs = profile.preferences || {}

  const defaultValues: Partial<ProfileBuilderInput> = {
    personal: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split("T")[0] as any : undefined,
      gender: profile.gender || "",
      nationality: profile.nationality || "",
      countryOfResidence: profile.countryOfResidence || "",
      city: profile.currentCity || "",
      phone: user.phone || "",
      maritalStatus: profile.maritalStatus || "",
    },
    summary: {
      headline: profile.headline || "",
      specialty: profile.specialty || "",
      subspecialty: profile.subspecialty || "",
      totalYearsExperience: profile.totalYearsExperience ?? undefined,
      postSpecialtyExperience: profile.postSpecialtyExp ?? undefined,
      professionalSummary: profile.professionalSummary || "",
      currentEmployer: profile.currentEmployer || "",
      currentRole: profile.currentJobTitle || "",
      noticePeriod: profile.noticePeriodDays?.toString() || "",
      earliestStartDate: profile.earliestStartDate ? new Date(profile.earliestStartDate) as any : undefined,
    },
    educations: profile.educations?.map((e: any) => ({
      ...e,
      graduationDate: e.graduationDate ? new Date(e.graduationDate).toISOString().split("T")[0] : undefined
    })) || [],
    trainings: [
      ...(profile.residencyTrainings?.map((t: any) => ({
        ...t,
        type: "Residency",
        startDate: t.startDate ? new Date(t.startDate).toISOString().split("T")[0] : undefined,
        endDate: t.endDate ? new Date(t.endDate).toISOString().split("T")[0] : undefined
      })) || []),
      ...(profile.fellowshipTrainings?.map((t: any) => ({
        ...t,
        type: "Fellowship",
        startDate: t.startDate ? new Date(t.startDate).toISOString().split("T")[0] : undefined,
        endDate: t.endDate ? new Date(t.endDate).toISOString().split("T")[0] : undefined
      })) || [])
    ],
    licenses: profile.medicalLicenses?.map((l: any) => ({
      ...l,
      issueDate: l.issueDate ? new Date(l.issueDate).toISOString().split("T")[0] : undefined,
      expiryDate: l.expiryDate ? new Date(l.expiryDate).toISOString().split("T")[0] : undefined,
    })) || [],
    boardCertifications: profile.boardCertifications?.map((b: any) => ({
      ...b,
      issueDate: b.issueDate ? new Date(b.issueDate).toISOString().split("T")[0] : undefined,
      expiryDate: b.expiryDate ? new Date(b.expiryDate).toISOString().split("T")[0] : undefined,
    })) || [],
    certifications: profile.certifications?.map((c: any) => ({
      ...c,
      issueDate: c.issueDate ? new Date(c.issueDate).toISOString().split("T")[0] : undefined,
      expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().split("T")[0] : undefined,
    })) || [],
    work: profile.workExperiences?.map((w: any) => ({
      ...w,
      startDate: w.startDate ? new Date(w.startDate).toISOString().split("T")[0] : undefined,
      endDate: w.endDate ? new Date(w.endDate).toISOString().split("T")[0] : undefined,
    })) || [],
    clinicalProcedures: profile.clinicalProcedures || [],
    trainingCourses: profile.trainingCourses?.map((c: any) => ({
      ...c,
      startDate: c.startDate ? new Date(c.startDate).toISOString().split("T")[0] : undefined,
      endDate: c.endDate ? new Date(c.endDate).toISOString().split("T")[0] : undefined
    })) || [],
    publications: profile.publications || [],
    presentations: profile.presentations || [],
    teachingRoles: profile.teachingRoles?.map((t: any) => ({
      ...t,
      startDate: t.startDate ? new Date(t.startDate).toISOString().split("T")[0] : undefined,
      endDate: t.endDate ? new Date(t.endDate).toISOString().split("T")[0] : undefined
    })) || [],
    qiProjects: profile.qiProjects || [],
    leadershipRoles: profile.leadershipRoles?.map((l: any) => ({
      ...l,
      startDate: l.startDate ? new Date(l.startDate).toISOString().split("T")[0] : undefined,
      endDate: l.endDate ? new Date(l.endDate).toISOString().split("T")[0] : undefined
    })) || [],
    awards: profile.awards || [],
    memberships: profile.memberships?.map((m: any) => ({
      ...m,
      startDate: m.startDate ? new Date(m.startDate).toISOString().split("T")[0] : undefined,
      endDate: m.endDate ? new Date(m.endDate).toISOString().split("T")[0] : undefined
    })) || [],
    referees: profile.referees || [],
    languages: profile.languages || [],
    preferences: {
      preferredCountries: prefs.preferredCountries || [],
      preferredCities: prefs.preferredCities || [],
      relocationWilling: prefs.relocationWilling ?? true,
      visaSponsorshipReq: prefs.visaSponsorshipReq ?? true,
      expectedSalaryMin: prefs.expectedSalaryMin ?? undefined,
    }
  }

  const methods = useForm<ProfileBuilderInput>({
    resolver: zodResolver(ProfileBuilderSchema) as any,
    defaultValues: defaultValues as any,
    mode: "all", // validate on change AND blur AND submit — catches untouched required fields
    reValidateMode: "onChange",
  })

  const { handleSubmit, formState: { errors, isSubmitting }, setFocus, getValues, reset } = methods

  // Scroll content pane to top on every tab switch
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
    // Also reset page-level scroll in case the sidebar itself caused page scroll
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [activeTab])

  // Handle auto-focus and tab switching on error
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorPath = Object.keys(errors)[0] as keyof typeof errors
      
      let targetTab = "personal"
      if (firstErrorPath === "personal") targetTab = "personal"
      else if (firstErrorPath === "summary") targetTab = "summary"
      else if (["educations", "trainings"].includes(firstErrorPath)) targetTab = "education"
      else if (["licenses", "boardCertifications", "certifications"].includes(firstErrorPath)) targetTab = "licensure"
      else if (firstErrorPath === "work") targetTab = "work"
      else if (firstErrorPath === "preferences") targetTab = "preferences"
      else targetTab = "activities" // Default for all optional arrays

      setActiveTab(targetTab)

      // Use a short timeout to let the DOM render the new tab before focusing
      setTimeout(() => {
        // We try to focus the first error element natively using document.querySelector
        // react-hook-form's setFocus works for flat fields but struggles with dynamic arrays without exact indexes
        const errorElement = document.querySelector('[aria-invalid="true"], .border-destructive')
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          ;(errorElement as HTMLElement).focus?.()
        }
      }, 100)
    }
  }, [errors])

  const onSubmit = async (values: ProfileBuilderInput) => {
    setError(null)
    try {
      // Execute saves sequentially to avoid starving the database connection pool
      await updatePersonalDetails(values.personal)
      await updateProfessionalSummary(values.summary)
      await replaceEducationEntries(values.educations)
      await replaceTrainingEntries(values.trainings)
      await replaceLicenses(values.licenses)
      await replaceBoardCertifications(values.boardCertifications)
      await replaceCertifications(values.certifications)
      await replaceWorkExperience(values.work)
      await replaceProfessionalActivities(values)
      await updatePreferences(values.preferences)
      
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Failed to save profile. Please check your inputs and try again.")
      // scroll to top to see error
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const onError = () => {
    setError("Please complete all required fields and correct any highlighted errors.")
  }

  const handleApplyCvExtraction = (cvData: CvExtractionResult) => {
    const current = getValues()
    const next = JSON.parse(JSON.stringify(current))

    const mergeObjects = (target: any, source: any) => {
      if (!source) return
      for (const key in source) {
        const sourceVal = source[key]
        if (sourceVal === undefined || sourceVal === null) continue
        
        if (Array.isArray(sourceVal)) {
          // If the AI extracted array items, let them overwrite the current array.
          // This ensures incomplete records don't block fresh extractions.
          if (sourceVal.length > 0) {
            target[key] = sourceVal
          }
        } else if (typeof sourceVal === "object") {
          if (!target[key]) target[key] = {}
          mergeObjects(target[key], sourceVal)
        } else {
          // Primitive: explicitly overwrite with the extracted value
          // (undefined/null source values are already skipped above)
          target[key] = sourceVal
        }
      }
    }

    mergeObjects(next, cvData)

    // Apply merged state back to react-hook-form without losing dirty state on other fields
    reset(next, { keepDirty: true })
  }

  // Derive error states for tabs
  const tabConfigs = TABS.map(tab => {
    let hasErrors = false
    if (tab.id === "personal" && errors.personal) hasErrors = true
    if (tab.id === "summary" && errors.summary) hasErrors = true
    if (tab.id === "education" && (errors.educations || errors.trainings)) hasErrors = true
    if (tab.id === "licensure" && (errors.licenses || errors.boardCertifications || errors.certifications)) hasErrors = true
    if (tab.id === "work" && errors.work) hasErrors = true
    if (tab.id === "preferences" && errors.preferences) hasErrors = true
    if (tab.id === "activities" && (errors.clinicalProcedures || errors.publications || errors.qiProjects || errors.trainingCourses || errors.presentations || errors.teachingRoles || errors.leadershipRoles || errors.awards || errors.memberships || errors.referees)) hasErrors = true
    return { ...tab, hasErrors }
  })

  const activeIndex = tabConfigs.findIndex((t) => t.id === activeTab)
  const canGoPrev = activeIndex > 0
  const canGoNext = activeIndex < tabConfigs.length - 1

  return (
    <div className="space-y-4">
      <GlobalCvImportAction onApplyExtraction={handleApplyCvExtraction} />

      {error && <FeedbackAlert type="error" message={error} />}

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} id="profile-form">
            <div className="flex min-h-[600px]">

              {/* ── Sidebar nav ── */}
              <aside className="w-56 shrink-0 border-r border-border bg-slate-50/70 flex flex-col">
                <div className="px-4 pt-5 pb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Profile Sections
                  </p>
                </div>
                <div className="flex-1">
                  <ProfileSectionTabNav
                    tabs={tabConfigs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                </div>
                <div className="p-4 border-t border-border">
                  <p className="text-[11px] text-slate-400 text-center">
                    {activeIndex + 1} of {tabConfigs.length} sections
                  </p>
                  {/* Mini progress bar */}
                  <div className="mt-2 h-1 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${((activeIndex + 1) / tabConfigs.length) * 100}%` }}
                    />
                  </div>
                </div>
              </aside>

              {/* ── Main content ── */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Tab content */}
                <div ref={contentRef} className="flex-1 overflow-auto">
                  {activeTab === "personal" && <PersonalDetailsTab />}
                  {activeTab === "summary" && <ProfessionalSummaryTab />}
                  {activeTab === "education" && <EducationTrainingTab />}
                  {activeTab === "licensure" && <LicensureExamsTab />}
                  {activeTab === "work" && <WorkExperienceTab />}
                  {activeTab === "activities" && <ProfessionalActivitiesTab />}
                  {activeTab === "preferences" && <PreferencesDocumentsTab />}
                </div>

                {/* Footer bar */}
                <div className="px-6 py-4 border-t border-border bg-slate-50/50 flex items-center gap-3">
                  {/* Prev / Next */}
                  <button
                    type="button"
                    disabled={!canGoPrev}
                    onClick={() => setActiveTab(tabConfigs[activeIndex - 1].id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={!canGoNext}
                    onClick={() => setActiveTab(tabConfigs[activeIndex + 1].id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>

                  <div className="flex-1" />

                  {Object.keys(errors).length > 0 && (
                    <p className="text-xs text-destructive font-medium hidden md:block">
                      Fix errors in highlighted sections first.
                    </p>
                  )}

                  <Button type="submit" disabled={isSubmitting} className="gap-2 min-w-[180px]">
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    ) : (
                      <><Save className="w-4 h-4" /> Save Profile</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
