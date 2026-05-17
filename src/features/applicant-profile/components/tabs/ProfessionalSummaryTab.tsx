"use client"

import React from "react"
import { useFormContext } from "react-hook-form"
import { ProfileBuilderInput } from "../../schemas"
import { FormSection, FormField } from "@/components/ui/form-section"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ProfessionalSummaryTab() {
  const { register, formState: { errors } } = useFormContext<ProfileBuilderInput>()

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Professional Summary</h2>
        <p className="text-muted-foreground mt-1">Highlight your expertise, current role, and overall experience.</p>
      </div>

      <FormSection title="Professional Profile">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Primary Specialty" htmlFor="specialty" error={errors.summary?.specialty?.message}>
            <Input id="specialty" placeholder="e.g. Cardiology" {...register("summary.specialty")} />
          </FormField>
          
          <FormField label="Subspecialty" htmlFor="subspecialty" error={errors.summary?.subspecialty?.message} hint="Optional">
            <Input id="subspecialty" placeholder="e.g. Interventional Cardiology" {...register("summary.subspecialty")} />
          </FormField>
          
          <FormField label="Total Years of Experience" htmlFor="totalYearsExperience" error={errors.summary?.totalYearsExperience?.message}>
            <Input id="totalYearsExperience" type="number" min="0" placeholder="e.g. 10" {...register("summary.totalYearsExperience", { valueAsNumber: true })} />
          </FormField>

          <FormField label="Post-Specialty Experience (Years)" htmlFor="postSpecialtyExperience" error={errors.summary?.postSpecialtyExperience?.message} hint="Years after obtaining specialist/consultant board">
            <Input id="postSpecialtyExperience" type="number" min="0" placeholder="e.g. 4" {...register("summary.postSpecialtyExperience", { valueAsNumber: true })} />
          </FormField>
        </div>

        <FormField label="Professional Summary" htmlFor="professionalSummary" error={errors.summary?.professionalSummary?.message} hint="Write a brief summary of your clinical experience and achievements.">
          <Textarea id="professionalSummary" rows={4} placeholder="Experienced Consultant Cardiologist with 10+ years of..." {...register("summary.professionalSummary")} />
        </FormField>
      </FormSection>

      <FormSection title="Current Status">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Current Employer" htmlFor="currentEmployer" error={errors.summary?.currentEmployer?.message}>
            <Input id="currentEmployer" placeholder="e.g. London General Hospital" {...register("summary.currentEmployer")} />
          </FormField>
          
          <FormField label="Current Job Title" htmlFor="currentRole" error={errors.summary?.currentRole?.message}>
            <Input id="currentRole" placeholder="e.g. Consultant Cardiologist" {...register("summary.currentRole")} />
          </FormField>
          
          <FormField label="Notice Period (Days)" htmlFor="noticePeriod" error={errors.summary?.noticePeriod?.message}>
            <Input id="noticePeriod" type="number" min="0" placeholder="e.g. 90" {...register("summary.noticePeriod")} />
          </FormField>
        </div>
      </FormSection>
    </div>
  )
}
