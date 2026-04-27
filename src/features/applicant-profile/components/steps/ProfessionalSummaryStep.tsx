"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProfessionalSummarySchema, ProfessionalSummaryInput } from "../../schemas"
import { updateProfessionalSummary } from "../../actions"
import { FormSection, FormField } from "@/components/ui/form-section"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { WizardFooter } from "../WizardFooter"
import { FeedbackAlert } from "@/components/ui/feedback"

export function ProfessionalSummaryStep({ data, onNext, onBack }: { data: any; onNext: () => void; onBack: () => void }) {
  const [error, setError] = useState<string | null>(null)
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfessionalSummaryInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(ProfessionalSummarySchema) as any,
    defaultValues: {
      headline: data?.profile?.headline || "",
      specialty: data?.profile?.specialty || "",
      subspecialty: data?.profile?.subspecialty || "",
      totalYearsExperience: data?.profile?.totalYearsExperience ?? undefined,
      postSpecialtyExperience: data?.profile?.postSpecialtyExp ?? undefined,
      professionalSummary: data?.profile?.professionalSummary || "",
      currentEmployer: data?.profile?.currentEmployer || "",
      currentRole: data?.profile?.currentJobTitle || "",
      noticePeriod: data?.profile?.noticePeriodDays?.toString() || "",
      earliestStartDate: data?.profile?.earliestStartDate ? new Date(data.profile.earliestStartDate) : undefined,
    }
  })

  const onSubmit = async (values: ProfessionalSummaryInput) => {
    setError(null)
    try {
      await updateProfessionalSummary(values)
      onNext()
    } catch (err: any) {
      setError(err.message || "Failed to save professional summary.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-6 md:p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Professional Summary</h2>
          <p className="text-muted-foreground mt-1">Highlight your expertise, current role, and overall experience.</p>
        </div>

        {error && <FeedbackAlert type="error" message={error} />}

        <FormSection title="Professional Profile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Primary Specialty" htmlFor="specialty" error={errors.specialty?.message}>
              <Input id="specialty" placeholder="e.g. Cardiology" {...register("specialty")} />
            </FormField>
            
            <FormField label="Subspecialty" htmlFor="subspecialty" error={errors.subspecialty?.message} hint="Optional">
              <Input id="subspecialty" placeholder="e.g. Interventional Cardiology" {...register("subspecialty")} />
            </FormField>
            
            <FormField label="Total Years of Experience" htmlFor="totalYearsExperience" error={errors.totalYearsExperience?.message}>
              <Input id="totalYearsExperience" type="number" min="0" placeholder="e.g. 10" {...register("totalYearsExperience", { valueAsNumber: true })} />
            </FormField>

            <FormField label="Post-Specialty Experience (Years)" htmlFor="postSpecialtyExperience" error={errors.postSpecialtyExperience?.message} hint="Years after obtaining specialist/consultant board">
              <Input id="postSpecialtyExperience" type="number" min="0" placeholder="e.g. 4" {...register("postSpecialtyExperience", { valueAsNumber: true })} />
            </FormField>
          </div>

          <FormField label="Professional Summary" htmlFor="professionalSummary" error={errors.professionalSummary?.message} hint="Write a brief summary of your clinical experience and achievements.">
            <Textarea id="professionalSummary" rows={4} placeholder="Experienced Consultant Cardiologist with 10+ years of..." {...register("professionalSummary")} />
          </FormField>
        </FormSection>

        <FormSection title="Current Status">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Current Employer" htmlFor="currentEmployer" error={errors.currentEmployer?.message}>
              <Input id="currentEmployer" placeholder="e.g. London General Hospital" {...register("currentEmployer")} />
            </FormField>
            
            <FormField label="Current Job Title" htmlFor="currentRole" error={errors.currentRole?.message}>
              <Input id="currentRole" placeholder="e.g. Consultant Cardiologist" {...register("currentRole")} />
            </FormField>
            
            <FormField label="Notice Period (Days)" htmlFor="noticePeriod" error={errors.noticePeriod?.message}>
              <Input id="noticePeriod" type="number" min="0" placeholder="e.g. 90" {...register("noticePeriod")} />
            </FormField>
          </div>
        </FormSection>
      </div>

      <WizardFooter onBack={onBack} isSubmitting={isSubmitting} onSaveDraft={() => handleSubmit(onSubmit)()} />
    </form>
  )
}
