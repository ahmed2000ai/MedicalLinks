"use client"

import React, { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { LicenseEntrySchema, CertificationEntrySchema } from "../../schemas"
import { replaceLicenses, replaceCertifications } from "../../actions"
import { FormSection, FormField, RepeatableEntry } from "@/components/ui/form-section"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { WizardFooter } from "../WizardFooter"
import { FeedbackAlert } from "@/components/ui/feedback"

const CombinedSchema = z.object({
  licenses: z.array(LicenseEntrySchema),
  certifications: z.array(CertificationEntrySchema),
})
type CombinedInput = z.infer<typeof CombinedSchema>

export function LicensureExamsStep({ data, onNext, onBack }: { data: any; onNext: () => void; onBack: () => void }) {
  const [error, setError] = useState<string | null>(null)
  
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<CombinedInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CombinedSchema) as any,
    defaultValues: {
      licenses: data?.profile?.medicalLicenses?.map((l: any) => ({
        ...l,
        issueDate: l.issueDate ? new Date(l.issueDate).toISOString().split("T")[0] : undefined,
        expiryDate: l.expiryDate ? new Date(l.expiryDate).toISOString().split("T")[0] : undefined,
      })) || [],
      certifications: data?.profile?.certifications?.map((c: any) => ({
        ...c,
        issueDate: c.issueDate ? new Date(c.issueDate).toISOString().split("T")[0] : undefined,
        expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().split("T")[0] : undefined,
      })) || [],
    }
  })

  const { fields: licFields, append: appendLic, remove: removeLic } = useFieldArray({ control, name: "licenses", keyName: "rhfId" })
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control, name: "certifications", keyName: "rhfId" })

  const onSubmit = async (values: CombinedInput) => {
    setError(null)
    try {
      await replaceLicenses(values.licenses)
      await replaceCertifications(values.certifications)
      onNext()
    } catch (err: any) {
      setError(err.message || "Failed to save licensure & exams.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-6 md:p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Licensure & Exams</h2>
          <p className="text-muted-foreground mt-1">Provide your medical licenses and professional certifications (e.g. BLS, ACLS, DHA, SCFHS).</p>
        </div>

        {error && <FeedbackAlert type="error" message={error} />}

        <FormSection title="Medical Licenses" description="Add your valid medical licenses, especially GCC authorities if applicable.">
          <RepeatableEntry
            title="Licenses"
            addLabel="Add License"
            emptyLabel="No licenses added yet."
            onAdd={() => appendLic({ licenseName: "Medical License", issuingAuthority: "", country: "", licenseNumber: "", status: "Active" })}
            onRemove={removeLic}
            items={licFields.map((field, index) => (
              <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Issuing Authority" htmlFor={`lic-${index}-auth`} required error={errors.licenses?.[index]?.issuingAuthority?.message}>
                  <Input id={`lic-${index}-auth`} placeholder="e.g. DHA, SCFHS, GMC" {...register(`licenses.${index}.issuingAuthority` as const)} />
                </FormField>
                <FormField label="Country" htmlFor={`lic-${index}-country`} required error={errors.licenses?.[index]?.country?.message}>
                  <Input id={`lic-${index}-country`} placeholder="Country of issue" {...register(`licenses.${index}.country` as const)} />
                </FormField>
                <FormField label="License / Registration No." htmlFor={`lic-${index}-num`} error={errors.licenses?.[index]?.licenseNumber?.message}>
                  <Input id={`lic-${index}-num`} placeholder="Registration ID" {...register(`licenses.${index}.licenseNumber` as const)} />
                </FormField>
                <FormField label="Status" htmlFor={`lic-${index}-status`}>
                  <Select id={`lic-${index}-status`} {...register(`licenses.${index}.status` as const)}>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="DataFlow Completed">DataFlow Completed</option>
                    <option value="Exam Passed">Exam Passed</option>
                  </Select>
                </FormField>
                <FormField label="Issue Date" htmlFor={`lic-${index}-issue`} error={errors.licenses?.[index]?.issueDate?.message}>
                  <Input id={`lic-${index}-issue`} type="date" {...register(`licenses.${index}.issueDate` as const)} />
                </FormField>
                <FormField label="Expiry Date" htmlFor={`lic-${index}-exp`} error={errors.licenses?.[index]?.expiryDate?.message}>
                  <Input id={`lic-${index}-exp`} type="date" {...register(`licenses.${index}.expiryDate` as const)} />
                </FormField>
                
                {/* Hidden field for licenseName since schema requires it but user doesn't need to specify it's a 'Medical License' every time */}
                <input type="hidden" {...register(`licenses.${index}.licenseName` as const)} value="Medical License" />
              </div>
            ))}
          />
        </FormSection>

        <FormSection title="Professional Certifications" description="Add relevant certs like BLS, ACLS, ATLS, etc.">
          <RepeatableEntry
            title="Certifications"
            addLabel="Add Certification"
            emptyLabel="No certifications added."
            onAdd={() => appendCert({ certificationName: "", issuingBody: "", issueDate: undefined, expiryDate: undefined })}
            onRemove={removeCert}
            items={certFields.map((field, index) => (
              <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Certification Name" htmlFor={`cert-${index}-name`} required error={errors.certifications?.[index]?.certificationName?.message}>
                  <Input id={`cert-${index}-name`} placeholder="e.g. ACLS" {...register(`certifications.${index}.certificationName` as const)} />
                </FormField>
                <FormField label="Issuing Body" htmlFor={`cert-${index}-body`} required error={errors.certifications?.[index]?.issuingBody?.message}>
                  <Input id={`cert-${index}-body`} placeholder="e.g. American Heart Association" {...register(`certifications.${index}.issuingBody` as const)} />
                </FormField>
                <FormField label="Issue Date" htmlFor={`cert-${index}-issue`} error={errors.certifications?.[index]?.issueDate?.message}>
                  <Input id={`cert-${index}-issue`} type="date" {...register(`certifications.${index}.issueDate` as const)} />
                </FormField>
                <FormField label="Expiry Date" htmlFor={`cert-${index}-exp`} error={errors.certifications?.[index]?.expiryDate?.message}>
                  <Input id={`cert-${index}-exp`} type="date" {...register(`certifications.${index}.expiryDate` as const)} />
                </FormField>
              </div>
            ))}
          />
        </FormSection>
      </div>

      <WizardFooter onBack={onBack} isSubmitting={isSubmitting} onSaveDraft={() => handleSubmit(onSubmit)()} />
    </form>
  )
}
