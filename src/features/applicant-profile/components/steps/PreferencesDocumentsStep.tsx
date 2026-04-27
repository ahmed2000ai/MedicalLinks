"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PreferencesSchema, PreferencesInput } from "../../schemas"
import { updatePreferences } from "../../actions"
import { FormSection, FormField } from "@/components/ui/form-section"
import { Input } from "@/components/ui/input"
import { WizardFooter } from "../WizardFooter"
import { FeedbackAlert } from "@/components/ui/feedback"
import { FileUp, FileCheck, ArrowRight } from "lucide-react"
import Link from "next/link"

export function PreferencesDocumentsStep({ data, onNext, onBack }: { data: any; onNext: () => void; onBack: () => void }) {
  const [error, setError] = useState<string | null>(null)
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PreferencesInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(PreferencesSchema) as any,
    defaultValues: {
      preferredCountries: data?.profile?.preferences?.preferredCountries || [],
      preferredCities: data?.profile?.preferences?.preferredCities || [],
      relocationWilling: data?.profile?.preferences?.relocationWilling ?? true,
      visaSponsorshipReq: data?.profile?.preferences?.visaSponsorshipReq ?? true,
      expectedSalaryMin: data?.profile?.preferences?.expectedSalaryMin ?? undefined,
      expectedSalaryMax: data?.profile?.preferences?.expectedSalaryMax ?? undefined,
    }
  })

  const onSubmit = async (values: PreferencesInput) => {
    setError(null)
    try {
      // In a real app we might transform comma-separated strings to arrays if we changed the UI,
      // but assuming the user inputs comma-separated values in text fields for MVP:
      const formattedValues = {
        ...values,
        preferredCountries: typeof values.preferredCountries === "string" ? (values.preferredCountries as string).split(",").map(s => s.trim()) : values.preferredCountries,
        preferredCities: typeof values.preferredCities === "string" ? (values.preferredCities as string).split(",").map(s => s.trim()) : values.preferredCities,
      }
      
      await updatePreferences(formattedValues as PreferencesInput)
      onNext() // this is the last step, so it redirects to dashboard
    } catch (err: any) {
      setError(err.message || "Failed to save preferences.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-6 md:p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Preferences & Documents</h2>
          <p className="text-muted-foreground mt-1">Specify your GCC location preferences and check required documents.</p>
        </div>

        {error && <FeedbackAlert type="error" message={error} />}

        <FormSection title="Job Preferences" description="Let hospitals know where you want to work and your requirements.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Preferred GCC Countries" htmlFor="preferredCountries" error={errors.preferredCountries?.message} hint="Comma separated (e.g. UAE, Saudi Arabia, Qatar)">
              <Input id="preferredCountries" placeholder="UAE, Saudi Arabia" {...register("preferredCountries")} />
            </FormField>
            
            <FormField label="Preferred Cities" htmlFor="preferredCities" error={errors.preferredCities?.message} hint="Optional. Comma separated (e.g. Dubai, Riyadh)">
              <Input id="preferredCities" placeholder="Dubai, Riyadh" {...register("preferredCities")} />
            </FormField>
            
            <div className="space-y-4 col-span-1 md:col-span-2">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" className="rounded border-input text-primary focus:ring-primary h-4 w-4" {...register("relocationWilling")} />
                I am willing to relocate to the GCC
              </label>
              
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" className="rounded border-input text-primary focus:ring-primary h-4 w-4" {...register("visaSponsorshipReq")} />
                I require visa sponsorship
              </label>
            </div>
            
            <FormField label="Expected Salary Minimum (USD/month)" htmlFor="expectedSalaryMin" error={errors.expectedSalaryMin?.message}>
              <Input id="expectedSalaryMin" type="number" min="0" placeholder="e.g. 15000" {...register("expectedSalaryMin", { valueAsNumber: true })} />
            </FormField>
            
            <FormField label="Expected Salary Maximum (USD/month)" htmlFor="expectedSalaryMax" error={errors.expectedSalaryMax?.message} hint="Optional">
              <Input id="expectedSalaryMax" type="number" min="0" placeholder="e.g. 25000" {...register("expectedSalaryMax", { valueAsNumber: true })} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Credential Documents" description="Upload and manage your professional documents to complete your GCC recruitment readiness.">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-start gap-4">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg shrink-0">
              <FileCheck size={22} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-1">Document Management is Ready</h4>
              <p className="text-sm text-muted-foreground mb-3">
                You can now upload your CV, Medical License, DataFlow Report, Degree, Good Standing Certificate, and more. Your credential readiness score updates automatically.
              </p>
              <Link
                href="/documents"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Go to Document Manager <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </FormSection>
      </div>

      <WizardFooter onBack={onBack} isSubmitting={isSubmitting} onSaveDraft={() => handleSubmit(onSubmit)()} />
    </form>
  )
}
