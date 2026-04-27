"use client"

import React, { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { EducationEntrySchema, TrainingEntrySchema } from "../../schemas"
import { replaceEducationEntries, replaceTrainingEntries } from "../../actions"
import { FormSection, FormField, RepeatableEntry } from "@/components/ui/form-section"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { WizardFooter } from "../WizardFooter"
import { FeedbackAlert } from "@/components/ui/feedback"

const CombinedSchema = z.object({
  educations: z.array(EducationEntrySchema),
  trainings: z.array(TrainingEntrySchema),
})
type CombinedInput = z.infer<typeof CombinedSchema>

export function EducationTrainingStep({ data, onNext, onBack }: { data: any; onNext: () => void; onBack: () => void }) {
  const [error, setError] = useState<string | null>(null)
  
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<CombinedInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CombinedSchema) as any,
    defaultValues: {
      educations: data?.profile?.educations?.map((e: any) => ({
        ...e,
        graduationDate: e.graduationDate ? new Date(e.graduationDate).toISOString().split("T")[0] : undefined
      })) || [],
      trainings: [
        ...(data?.profile?.residencyTrainings?.map((t: any) => ({
          ...t,
          type: "Residency",
          startDate: t.startDate ? new Date(t.startDate).toISOString().split("T")[0] : undefined,
          endDate: t.endDate ? new Date(t.endDate).toISOString().split("T")[0] : undefined
        })) || []),
        ...(data?.profile?.fellowshipTrainings?.map((t: any) => ({
          ...t,
          type: "Fellowship",
          startDate: t.startDate ? new Date(t.startDate).toISOString().split("T")[0] : undefined,
          endDate: t.endDate ? new Date(t.endDate).toISOString().split("T")[0] : undefined
        })) || [])
      ],
    }
  })

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "educations", keyName: "rhfId" })
  const { fields: trainFields, append: appendTrain, remove: removeTrain } = useFieldArray({ control, name: "trainings", keyName: "rhfId" })

  const onSubmit = async (values: CombinedInput) => {
    setError(null)
    try {
      await replaceEducationEntries(values.educations)
      await replaceTrainingEntries(values.trainings)
      onNext()
    } catch (err: any) {
      setError(err.message || "Failed to save education and training.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-6 md:p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Education & Training</h2>
          <p className="text-muted-foreground mt-1">List your primary medical degrees, residencies, and fellowships.</p>
        </div>

        {error && <FeedbackAlert type="error" message={error} />}

        <FormSection title="Medical Degrees / University Education" description="Add your medical degrees (e.g. MBBS, MD, DO)">
          <RepeatableEntry
            title="Degrees"
            addLabel="Add Degree"
            emptyLabel="No degrees added. Please add your primary medical qualification."
            onAdd={() => appendEdu({ degree: "", institution: "", country: "", graduationDate: undefined, specialty: "", notes: "" })}
            onRemove={removeEdu}
            items={eduFields.map((field, index) => (
              <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Degree" htmlFor={`edu-${index}-degree`} required error={errors.educations?.[index]?.degree?.message}>
                  <Input id={`edu-${index}-degree`} placeholder="e.g. MBBS" {...register(`educations.${index}.degree` as const)} />
                </FormField>
                <FormField label="Institution" htmlFor={`edu-${index}-inst`} required error={errors.educations?.[index]?.institution?.message}>
                  <Input id={`edu-${index}-inst`} placeholder="University name" {...register(`educations.${index}.institution` as const)} />
                </FormField>
                <FormField label="Country" htmlFor={`edu-${index}-country`} required error={errors.educations?.[index]?.country?.message}>
                  <Input id={`edu-${index}-country`} placeholder="Country of study" {...register(`educations.${index}.country` as const)} />
                </FormField>
                <FormField label="Graduation Date" htmlFor={`edu-${index}-grad`} error={errors.educations?.[index]?.graduationDate?.message}>
                  <Input id={`edu-${index}-grad`} type="date" {...register(`educations.${index}.graduationDate` as const)} />
                </FormField>
              </div>
            ))}
          />
        </FormSection>

        <FormSection title="Residencies & Fellowships" description="Add your structured post-graduate clinical training.">
          <RepeatableEntry
            title="Training Programs"
            addLabel="Add Training"
            emptyLabel="No training programs added."
            onAdd={() => appendTrain({ programName: "", institution: "", specialty: "", country: "", type: "Residency" })}
            onRemove={removeTrain}
            items={trainFields.map((field, index) => (
              <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Type" htmlFor={`train-${index}-type`}>
                  <Select id={`train-${index}-type`} {...register(`trainings.${index}.type` as const)}>
                    <option value="Residency">Residency</option>
                    <option value="Fellowship">Fellowship</option>
                  </Select>
                </FormField>
                <FormField label="Specialty / Subspecialty" htmlFor={`train-${index}-spec`} error={errors.trainings?.[index]?.specialty?.message}>
                  <Input id={`train-${index}-spec`} placeholder="e.g. Internal Medicine" {...register(`trainings.${index}.specialty` as const)} />
                </FormField>
                <FormField label="Program Name / Board" htmlFor={`train-${index}-prog`} required error={errors.trainings?.[index]?.programName?.message}>
                  <Input id={`train-${index}-prog`} placeholder="e.g. Arab Board" {...register(`trainings.${index}.programName` as const)} />
                </FormField>
                <FormField label="Institution / Hospital" htmlFor={`train-${index}-inst`} required error={errors.trainings?.[index]?.institution?.message}>
                  <Input id={`train-${index}-inst`} placeholder="Training center" {...register(`trainings.${index}.institution` as const)} />
                </FormField>
                <FormField label="Country" htmlFor={`train-${index}-country`} required error={errors.trainings?.[index]?.country?.message}>
                  <Input id={`train-${index}-country`} placeholder="Country of training" {...register(`trainings.${index}.country` as const)} />
                </FormField>
                <div className="grid grid-cols-2 gap-2">
                  <FormField label="Start Date" htmlFor={`train-${index}-start`} error={errors.trainings?.[index]?.startDate?.message}>
                    <Input id={`train-${index}-start`} type="date" {...register(`trainings.${index}.startDate` as const)} />
                  </FormField>
                  <FormField label="End Date" htmlFor={`train-${index}-end`} error={errors.trainings?.[index]?.endDate?.message}>
                    <Input id={`train-${index}-end`} type="date" {...register(`trainings.${index}.endDate` as const)} />
                  </FormField>
                </div>
              </div>
            ))}
          />
        </FormSection>
      </div>

      <WizardFooter onBack={onBack} isSubmitting={isSubmitting} onSaveDraft={() => handleSubmit(onSubmit)()} />
    </form>
  )
}
