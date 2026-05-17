"use client"

import React from "react"
import { useFormContext, useFieldArray } from "react-hook-form"
import { ProfileBuilderInput } from "../../schemas"
import { FormSection, FormField, RepeatableEntry } from "@/components/ui/form-section"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function WorkExperienceTab() {
  const { control, register, watch, formState: { errors } } = useFormContext<ProfileBuilderInput>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "work",
    keyName: "rhfId"
  })

  // Watch all work experiences to handle "isCurrent" logic
  const workValues = watch("work") || []

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Work Experience</h2>
        <p className="text-muted-foreground mt-1">Add your clinical and professional roles in reverse chronological order.</p>
      </div>

      <FormSection title="Professional Experience" description="Include all relevant hospital, clinic, or academic roles.">
        <RepeatableEntry
          title="Roles"
          addLabel="Add Role"
          emptyLabel="No work experience added."
          onAdd={() => append({ employer: "", title: "", department: "", specialty: "", country: "", city: "", startDate: undefined, endDate: undefined, isCurrent: false, summary: "", achievements: "", metrics: "", clinicalVolume: "" })}
          onRemove={remove}
          items={fields.map((field, index) => {
            const isCurrent = workValues[index]?.isCurrent
            
            return (
              <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Job Title" htmlFor={`we-title-${index}`} required error={errors.work?.[index]?.title?.message}>
                  <Input id={`we-title-${index}`} placeholder="e.g. Consultant General Surgeon" {...register(`work.${index}.title` as const)} />
                </FormField>
                
                <FormField label="Employer / Hospital" htmlFor={`we-emp-${index}`} required error={errors.work?.[index]?.employer?.message}>
                  <Input id={`we-emp-${index}`} placeholder="e.g. Cleveland Clinic Abu Dhabi" {...register(`work.${index}.employer` as const)} />
                </FormField>
                
                <FormField label="Department" htmlFor={`we-dept-${index}`} error={errors.work?.[index]?.department?.message}>
                  <Input id={`we-dept-${index}`} placeholder="e.g. Department of Surgery" {...register(`work.${index}.department` as const)} />
                </FormField>
                
                <FormField label="Specialty" htmlFor={`we-spec-${index}`} error={errors.work?.[index]?.specialty?.message}>
                  <Input id={`we-spec-${index}`} placeholder="e.g. General Surgery" {...register(`work.${index}.specialty` as const)} />
                </FormField>

                <FormField label="Country" htmlFor={`we-country-${index}`} error={errors.work?.[index]?.country?.message}>
                  <Input id={`we-country-${index}`} placeholder="e.g. UAE" {...register(`work.${index}.country` as const)} />
                </FormField>

                <FormField label="City" htmlFor={`we-city-${index}`} error={errors.work?.[index]?.city?.message}>
                  <Input id={`we-city-${index}`} placeholder="e.g. Abu Dhabi" {...register(`work.${index}.city` as const)} />
                </FormField>

                <div className="md:col-span-2 pt-2 border-t border-border mt-2">
                  <div className="flex items-center gap-2 mb-4">
                    <input 
                      type="checkbox" 
                      id={`we-current-${index}`} 
                      className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                      {...register(`work.${index}.isCurrent` as const)} 
                    />
                    <label htmlFor={`we-current-${index}`} className="text-sm font-medium cursor-pointer">
                      I currently work here
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Start Date" htmlFor={`we-start-${index}`} error={errors.work?.[index]?.startDate?.message}>
                      <Input id={`we-start-${index}`} type="date" {...register(`work.${index}.startDate` as const)} />
                    </FormField>
                    
                    {!isCurrent && (
                      <FormField label="End Date" htmlFor={`we-end-${index}`} error={errors.work?.[index]?.endDate?.message}>
                        <Input id={`we-end-${index}`} type="date" {...register(`work.${index}.endDate` as const)} />
                      </FormField>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 mt-2">
                  <FormField label="Summary & Responsibilities" htmlFor={`we-sum-${index}`} error={errors.work?.[index]?.summary?.message}>
                    <Textarea id={`we-sum-${index}`} rows={3} placeholder="Describe your key clinical responsibilities..." {...register(`work.${index}.summary` as const)} />
                  </FormField>
                </div>
              </div>
            )
          })}
        />
      </FormSection>
    </div>
  )
}
