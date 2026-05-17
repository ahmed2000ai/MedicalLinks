"use client"

import React from "react"
import { useFormContext, useFieldArray } from "react-hook-form"
import { ProfileBuilderInput } from "../../schemas"
import { FormSection, FormField, RepeatableEntry } from "@/components/ui/form-section"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

export function LicensureExamsTab() {
  const { control, register, formState: { errors } } = useFormContext<ProfileBuilderInput>()

  const { fields: licFields, append: appendLic, remove: removeLic } = useFieldArray({ control, name: "licenses", keyName: "rhfId" })
  const { fields: boardFields, append: appendBoard, remove: removeBoard } = useFieldArray({ control, name: "boardCertifications", keyName: "rhfId" })
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control, name: "certifications", keyName: "rhfId" })

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Licensure & Exams</h2>
        <p className="text-muted-foreground mt-1">Provide your medical licenses and professional certifications (e.g. BLS, ACLS, DHA, SCFHS).</p>
      </div>

      <FormSection title="Medical Licenses" description="Add your active or past medical licenses.">
        <RepeatableEntry
          title="Licenses"
          addLabel="Add License"
          emptyLabel="No licenses added."
          onAdd={() => appendLic({ licenseName: "", issuingAuthority: "", country: "", licenseNumber: "", issueDate: undefined, expiryDate: undefined, status: "Active" })}
          onRemove={removeLic}
          items={licFields.map((field, index) => (
            <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="License Name" htmlFor={`lic-name-${index}`} required error={errors.licenses?.[index]?.licenseName?.message}>
                <Input id={`lic-name-${index}`} placeholder="e.g. DHA Specialist License" {...register(`licenses.${index}.licenseName` as const)} />
              </FormField>

              <FormField label="Issuing Authority" htmlFor={`lic-auth-${index}`} required error={errors.licenses?.[index]?.issuingAuthority?.message}>
                <Input id={`lic-auth-${index}`} placeholder="e.g. Dubai Health Authority" {...register(`licenses.${index}.issuingAuthority` as const)} />
              </FormField>

              <FormField label="Country" htmlFor={`lic-country-${index}`} required error={errors.licenses?.[index]?.country?.message}>
                <Input id={`lic-country-${index}`} placeholder="e.g. UAE" {...register(`licenses.${index}.country` as const)} />
              </FormField>

              <FormField label="License Number" htmlFor={`lic-num-${index}`} error={errors.licenses?.[index]?.licenseNumber?.message}>
                <Input id={`lic-num-${index}`} placeholder="Optional" {...register(`licenses.${index}.licenseNumber` as const)} />
              </FormField>

              <FormField label="Issue Date" htmlFor={`lic-issue-${index}`} error={errors.licenses?.[index]?.issueDate?.message}>
                <Input id={`lic-issue-${index}`} type="date" {...register(`licenses.${index}.issueDate` as const)} />
              </FormField>

              <FormField label="Expiry Date" htmlFor={`lic-exp-${index}`} error={errors.licenses?.[index]?.expiryDate?.message}>
                <Input id={`lic-exp-${index}`} type="date" {...register(`licenses.${index}.expiryDate` as const)} />
              </FormField>
              
              <FormField label="Status" htmlFor={`lic-status-${index}`} error={errors.licenses?.[index]?.status?.message}>
                <Select id={`lic-status-${index}`} {...register(`licenses.${index}.status` as const)}>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="In Progress">In Progress</option>
                </Select>
              </FormField>
            </div>
          ))}
        />
      </FormSection>

      <FormSection title="Board Certifications" description="Add your board certifications (e.g. Arab Board, Saudi Board, CCT, ABIM).">
        <RepeatableEntry
          title="Board Certifications"
          addLabel="Add Board Certification"
          emptyLabel="No board certifications added."
          onAdd={() => appendBoard({ boardName: "", specialty: "", country: "", issueDate: undefined, expiryDate: undefined })}
          onRemove={removeBoard}
          items={boardFields.map((field, index) => (
            <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Board Name" htmlFor={`bc-name-${index}`} required error={errors.boardCertifications?.[index]?.boardName?.message}>
                <Input id={`bc-name-${index}`} placeholder="e.g. Saudi Board, Arab Board, CCT" {...register(`boardCertifications.${index}.boardName` as const)} />
              </FormField>

              <FormField label="Specialty" htmlFor={`bc-spec-${index}`} required error={errors.boardCertifications?.[index]?.specialty?.message}>
                <Input id={`bc-spec-${index}`} placeholder="e.g. Internal Medicine" {...register(`boardCertifications.${index}.specialty` as const)} />
              </FormField>

              <FormField label="Country" htmlFor={`bc-country-${index}`} required error={errors.boardCertifications?.[index]?.country?.message}>
                <Input id={`bc-country-${index}`} placeholder="e.g. Saudi Arabia, UK" {...register(`boardCertifications.${index}.country` as const)} />
              </FormField>

              <div className="hidden md:block"></div>

              <FormField label="Issue Date" htmlFor={`bc-issue-${index}`} error={errors.boardCertifications?.[index]?.issueDate?.message}>
                <Input id={`bc-issue-${index}`} type="date" {...register(`boardCertifications.${index}.issueDate` as const)} />
              </FormField>

              <FormField label="Expiry Date" htmlFor={`bc-exp-${index}`} error={errors.boardCertifications?.[index]?.expiryDate?.message}>
                <Input id={`bc-exp-${index}`} type="date" {...register(`boardCertifications.${index}.expiryDate` as const)} />
              </FormField>
            </div>
          ))}
        />
      </FormSection>

      <FormSection title="Professional Certifications & Exams" description="Add certifications like BLS, ACLS, ATLS, or passing exams like Prometric.">
        <RepeatableEntry
          title="Certifications"
          addLabel="Add Certification"
          emptyLabel="No certifications added."
          onAdd={() => appendCert({ certificationName: "", issuingBody: "", issueDate: undefined, expiryDate: undefined })}
          onRemove={removeCert}
          items={certFields.map((field, index) => (
            <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Certification/Exam Name" htmlFor={`cert-name-${index}`} required error={errors.certifications?.[index]?.certificationName?.message}>
                <Input id={`cert-name-${index}`} placeholder="e.g. ACLS, Prometric" {...register(`certifications.${index}.certificationName` as const)} />
              </FormField>

              <FormField label="Issuing Body" htmlFor={`cert-auth-${index}`} required error={errors.certifications?.[index]?.issuingBody?.message}>
                <Input id={`cert-auth-${index}`} placeholder="e.g. American Heart Association" {...register(`certifications.${index}.issuingBody` as const)} />
              </FormField>

              <FormField label="Issue Date" htmlFor={`cert-issue-${index}`} error={errors.certifications?.[index]?.issueDate?.message}>
                <Input id={`cert-issue-${index}`} type="date" {...register(`certifications.${index}.issueDate` as const)} />
              </FormField>

              <FormField label="Expiry Date" htmlFor={`cert-exp-${index}`} error={errors.certifications?.[index]?.expiryDate?.message}>
                <Input id={`cert-exp-${index}`} type="date" {...register(`certifications.${index}.expiryDate` as const)} />
              </FormField>
            </div>
          ))}
        />
      </FormSection>
    </div>
  )
}
