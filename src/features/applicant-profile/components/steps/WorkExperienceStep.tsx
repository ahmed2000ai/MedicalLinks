"use client"

import React, { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { WorkExperienceEntrySchema } from "../../schemas"
import { replaceWorkExperience } from "../../actions"
import { FormSection, FormField, RepeatableEntry } from "@/components/ui/form-section"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { WizardFooter } from "../WizardFooter"
import { FeedbackAlert } from "@/components/ui/feedback"

const CombinedSchema = z.object({
  work: z.array(WorkExperienceEntrySchema),
})
type CombinedInput = z.infer<typeof CombinedSchema>

export function WorkExperienceStep({ data, onNext, onBack }: { data: any; onNext: () => void; onBack: () => void }) {
  const [error, setError] = useState<string | null>(null)
  
  const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CombinedInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CombinedSchema) as any,
    defaultValues: {
      work: data?.profile?.workExperiences?.map((w: any) => ({
        ...w,
        startDate: w.startDate ? new Date(w.startDate).toISOString().split("T")[0] : undefined,
        endDate: w.endDate ? new Date(w.endDate).toISOString().split("T")[0] : undefined,
      })) || [],
    }
  })

  const { fields, append, remove } = useFieldArray({ control, name: "work", keyName: "rhfId" })
  const workValues = watch("work")

  const onSubmit = async (values: CombinedInput) => {
    setError(null)
    try {
      await replaceWorkExperience(values.work)
      onNext()
    } catch (err: any) {
      setError(err.message || "Failed to save work experience.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-6 md:p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Work Experience</h2>
          <p className="text-muted-foreground mt-1">Add your clinical work history starting from the most recent.</p>
        </div>

        {error && <FeedbackAlert type="error" message={error} />}

        <FormSection title="Clinical Experience">
          <RepeatableEntry
            title="Employment History"
            addLabel="Add Experience"
            emptyLabel="No work experience added."
            onAdd={() => append({ employer: "", title: "", department: "", country: "", city: "", isCurrent: false, startDate: undefined, endDate: undefined, summary: "" })}
            onRemove={remove}
            items={fields.map((field, index) => {
              const isCurrent = workValues?.[index]?.isCurrent
              return (
                <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Employer / Hospital" htmlFor={`work-${index}-emp`} required error={errors.work?.[index]?.employer?.message}>
                    <Input id={`work-${index}-emp`} placeholder="e.g. King Faisal Specialist Hospital" {...register(`work.${index}.employer` as const)} />
                  </FormField>
                  <FormField label="Job Title" htmlFor={`work-${index}-title`} required error={errors.work?.[index]?.title?.message}>
                    <Input id={`work-${index}-title`} placeholder="e.g. Consultant Cardiologist" {...register(`work.${index}.title` as const)} />
                  </FormField>
                  <FormField label="Department / Specialty" htmlFor={`work-${index}-dept`} error={errors.work?.[index]?.department?.message}>
                    <Input id={`work-${index}-dept`} placeholder="e.g. Cardiology" {...register(`work.${index}.department` as const)} />
                  </FormField>
                  <FormField label="Country" htmlFor={`work-${index}-country`} error={errors.work?.[index]?.country?.message}>
                    <Input id={`work-${index}-country`} placeholder="Country" {...register(`work.${index}.country` as const)} />
                  </FormField>
                  
                  <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Start Date" htmlFor={`work-${index}-start`} error={errors.work?.[index]?.startDate?.message}>
                      <Input id={`work-${index}-start`} type="date" {...register(`work.${index}.startDate` as const)} />
                    </FormField>
                    
                    <FormField label="End Date" htmlFor={`work-${index}-end`} error={errors.work?.[index]?.endDate?.message}>
                      <Input id={`work-${index}-end`} type="date" disabled={isCurrent} {...register(`work.${index}.endDate` as const)} />
                    </FormField>
                    
                    <div className="flex items-center h-full pt-6">
                      <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                        <input type="checkbox" className="rounded border-input text-primary focus:ring-primary" {...register(`work.${index}.isCurrent` as const)} />
                        I currently work here
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 mt-2">
                    <FormField label="Summary / Key Responsibilities" htmlFor={`work-${index}-sum`} error={errors.work?.[index]?.summary?.message}>
                      <Textarea id={`work-${index}-sum`} rows={3} placeholder="Briefly describe your responsibilities and achievements..." {...register(`work.${index}.summary` as const)} />
                    </FormField>
                  </div>
                </div>
              )
            })}
          />
        </FormSection>
      </div>

      <WizardFooter onBack={onBack} isSubmitting={isSubmitting} onSaveDraft={() => handleSubmit(onSubmit)()} />
    </form>
  )
}
