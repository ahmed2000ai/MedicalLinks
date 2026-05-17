"use client"

import React from "react"
import { useFormContext, useFieldArray } from "react-hook-form"
import { ProfileBuilderInput } from "../../schemas"
import { FormSection, FormField, RepeatableEntry } from "@/components/ui/form-section"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function EducationTrainingTab() {
  const { control, register, formState: { errors } } = useFormContext<ProfileBuilderInput>()

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "educations", keyName: "rhfId" })
  const { fields: trainFields, append: appendTrain, remove: removeTrain } = useFieldArray({ control, name: "trainings", keyName: "rhfId" })

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Education & Training</h2>
        <p className="text-muted-foreground mt-1">List your primary medical degrees, residencies, and fellowships.</p>
      </div>

      <FormSection title="Medical Degrees / University Education" description="Add your medical degrees (e.g. MBBS, MD, DO)">
        <RepeatableEntry
          title="Degrees"
          addLabel="Add Degree"
          emptyLabel="No degrees added. Please add your primary medical qualification."
          onAdd={() => appendEdu({ degree: "", institution: "", country: "", graduationDate: undefined, specialty: "", notes: "" })}
          onRemove={removeEdu}
          items={eduFields.map((field, index) => (
            <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Degree/Qualification" htmlFor={`edu-deg-${index}`} required error={errors.educations?.[index]?.degree?.message}>
                <Input id={`edu-deg-${index}`} placeholder="e.g. MBBS, MD" {...register(`educations.${index}.degree` as const)} />
              </FormField>
              
              <FormField label="Institution/University" htmlFor={`edu-inst-${index}`} required error={errors.educations?.[index]?.institution?.message}>
                <Input id={`edu-inst-${index}`} placeholder="e.g. King Saud University" {...register(`educations.${index}.institution` as const)} />
              </FormField>
              
              <FormField label="Country" htmlFor={`edu-country-${index}`} required error={errors.educations?.[index]?.country?.message}>
                <Input id={`edu-country-${index}`} placeholder="e.g. Saudi Arabia" {...register(`educations.${index}.country` as const)} />
              </FormField>

              <FormField label="Graduation Date" htmlFor={`edu-grad-${index}`} error={errors.educations?.[index]?.graduationDate?.message}>
                <Input id={`edu-grad-${index}`} type="date" {...register(`educations.${index}.graduationDate` as const)} />
              </FormField>
            </div>
          ))}
        />
      </FormSection>

      <FormSection title="Residency & Fellowship Training" description="Add your postgraduate specialty training programs.">
        <RepeatableEntry
          title="Training Programs"
          addLabel="Add Training"
          emptyLabel="No training programs added."
          onAdd={() => appendTrain({ programName: "", institution: "", country: "", startDate: undefined, endDate: undefined, type: "Residency", specialty: "", award: "", notes: "" })}
          onRemove={removeTrain}
          items={trainFields.map((field, index) => (
            <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Program Type" htmlFor={`tr-type-${index}`} error={errors.trainings?.[index]?.type?.message}>
                <Select id={`tr-type-${index}`} {...register(`trainings.${index}.type` as const)}>
                  <option value="Residency">Residency</option>
                  <option value="Fellowship">Fellowship</option>
                  <option value="Other">Other</option>
                </Select>
              </FormField>

              <FormField label="Specialty" htmlFor={`tr-spec-${index}`} error={errors.trainings?.[index]?.specialty?.message}>
                <Input id={`tr-spec-${index}`} placeholder="e.g. Internal Medicine" {...register(`trainings.${index}.specialty` as const)} />
              </FormField>

              <FormField label="Institution/Hospital" htmlFor={`tr-inst-${index}`} required error={errors.trainings?.[index]?.institution?.message}>
                <Input id={`tr-inst-${index}`} placeholder="e.g. King Faisal Specialist Hospital" {...register(`trainings.${index}.institution` as const)} />
              </FormField>

              <FormField label="Country" htmlFor={`tr-country-${index}`} required error={errors.trainings?.[index]?.country?.message}>
                <Input id={`tr-country-${index}`} placeholder="e.g. Saudi Arabia" {...register(`trainings.${index}.country` as const)} />
              </FormField>

              <FormField label="Start Date" htmlFor={`tr-start-${index}`} error={errors.trainings?.[index]?.startDate?.message}>
                <Input id={`tr-start-${index}`} type="date" {...register(`trainings.${index}.startDate` as const)} />
              </FormField>

              <FormField label="End Date" htmlFor={`tr-end-${index}`} error={errors.trainings?.[index]?.endDate?.message}>
                <Input id={`tr-end-${index}`} type="date" {...register(`trainings.${index}.endDate` as const)} />
              </FormField>
              
              <div className="md:col-span-2">
                <FormField label="Program Name / Details" htmlFor={`tr-name-${index}`} required error={errors.trainings?.[index]?.programName?.message}>
                  <Input id={`tr-name-${index}`} placeholder="e.g. Saudi Board of Internal Medicine Residency" {...register(`trainings.${index}.programName` as const)} />
                </FormField>
              </div>
            </div>
          ))}
        />
      </FormSection>
    </div>
  )
}
