"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PersonalDetailsSchema, PersonalDetailsInput } from "../../schemas"
import { updatePersonalDetails } from "../../actions"
import { FormSection, FormField } from "@/components/ui/form-section"
import { Input } from "@/components/ui/input"
import { WizardFooter } from "../WizardFooter"
import { FeedbackAlert } from "@/components/ui/feedback"

export function PersonalDetailsStep({ data, onNext }: { data: any; onNext: () => void }) {
  const [error, setError] = useState<string | null>(null)
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PersonalDetailsInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(PersonalDetailsSchema) as any,
    defaultValues: {
      firstName: data?.user?.firstName || data?.profile?.cvExtractionData?.personalInfo?.firstName || "",
      lastName: data?.user?.lastName || data?.profile?.cvExtractionData?.personalInfo?.lastName || "",
      dateOfBirth: data?.profile?.dateOfBirth 
        ? new Date(data.profile.dateOfBirth) 
        : data?.profile?.cvExtractionData?.personalInfo?.dateOfBirth
          ? new Date(data.profile.cvExtractionData.personalInfo.dateOfBirth)
          : undefined,
      gender: data?.profile?.gender || data?.profile?.cvExtractionData?.personalInfo?.gender || "",
      nationality: data?.profile?.nationality || data?.profile?.cvExtractionData?.personalInfo?.nationality || "",
      countryOfResidence: data?.profile?.countryOfResidence || data?.profile?.cvExtractionData?.personalInfo?.countryOfResidence || "",
      city: data?.profile?.currentCity || data?.profile?.cvExtractionData?.personalInfo?.city || "",
      phone: data?.user?.phone || data?.profile?.cvExtractionData?.personalInfo?.phone || "",
      maritalStatus: data?.profile?.maritalStatus || "",
    }
  })

  const onSubmit = async (values: PersonalDetailsInput) => {
    setError(null)
    try {
      await updatePersonalDetails(values)
      onNext()
    } catch (err: any) {
      setError(err.message || "Failed to save personal details.")
    }
  }

  // To support Date inputs seamlessly
  const dobStr = data?.profile?.dateOfBirth 
    ? new Date(data.profile.dateOfBirth).toISOString().split("T")[0] 
    : data?.profile?.cvExtractionData?.personalInfo?.dateOfBirth
      ? data.profile.cvExtractionData.personalInfo.dateOfBirth
      : ""

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-6 md:p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Personal Details</h2>
          <p className="text-muted-foreground mt-1">Provide your basic contact and identity information.</p>
        </div>

        {error && <FeedbackAlert type="error" message={error} />}

        <FormSection title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="First Name" htmlFor="firstName" required error={errors.firstName?.message}>
              <Input id="firstName" {...register("firstName")} />
            </FormField>
            
            <FormField label="Last Name" htmlFor="lastName" required error={errors.lastName?.message}>
              <Input id="lastName" {...register("lastName")} />
            </FormField>
            
            <FormField label="Date of Birth" htmlFor="dateOfBirth" error={errors.dateOfBirth?.message}>
              <Input id="dateOfBirth" type="date" defaultValue={dobStr} {...register("dateOfBirth")} />
            </FormField>
            
            <FormField label="Gender" htmlFor="gender" error={errors.gender?.message}>
              <select 
                id="gender" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("gender")}
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Contact & Location">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Nationality" htmlFor="nationality" error={errors.nationality?.message}>
              <Input id="nationality" placeholder="e.g. British, Indian, Egyptian" {...register("nationality")} />
            </FormField>
            
            <FormField label="Country of Residence" htmlFor="countryOfResidence" error={errors.countryOfResidence?.message}>
              <Input id="countryOfResidence" placeholder="e.g. United Arab Emirates" {...register("countryOfResidence")} />
            </FormField>
            
            <FormField label="Current City" htmlFor="city" error={errors.city?.message}>
              <Input id="city" placeholder="e.g. Dubai" {...register("city")} />
            </FormField>
            
            <FormField label="Phone Number" htmlFor="phone" error={errors.phone?.message}>
              <Input id="phone" type="tel" placeholder="+971 50 123 4567" {...register("phone")} />
            </FormField>
          </div>
        </FormSection>
      </div>

      <WizardFooter isSubmitting={isSubmitting} onSaveDraft={() => handleSubmit(onSubmit)()} />
    </form>
  )
}
