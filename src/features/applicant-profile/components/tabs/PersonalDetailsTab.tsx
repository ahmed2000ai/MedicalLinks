"use client"

import React from "react"
import { useFormContext } from "react-hook-form"
import { ProfileBuilderInput } from "../../schemas"
import { FormSection, FormField } from "@/components/ui/form-section"
import { Input } from "@/components/ui/input"

export function PersonalDetailsTab() {
  const { register, watch, formState: { errors } } = useFormContext<ProfileBuilderInput>()

  const dobStr = watch("personal.dateOfBirth")
    ? new Date(watch("personal.dateOfBirth") as Date).toISOString().split("T")[0]
    : ""

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Personal Details</h2>
        <p className="text-muted-foreground mt-1">Provide your basic contact and identity information.</p>
      </div>

      <FormSection title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="First Name" htmlFor="firstName" required error={errors.personal?.firstName?.message}>
            <Input id="firstName" {...register("personal.firstName")} />
          </FormField>
          
          <FormField label="Last Name" htmlFor="lastName" required error={errors.personal?.lastName?.message}>
            <Input id="lastName" {...register("personal.lastName")} />
          </FormField>
          
          <FormField label="Date of Birth" htmlFor="dateOfBirth" required error={errors.personal?.dateOfBirth?.message}>
            <Input id="dateOfBirth" type="date" value={dobStr} {...register("personal.dateOfBirth")} />
          </FormField>
          
          <FormField label="Gender" htmlFor="gender" required error={errors.personal?.gender?.message}>
            <select 
              id="gender" 
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.personal?.gender 
                  ? "border-destructive focus:ring-destructive text-destructive" 
                  : "border-input focus:ring-ring"
              }`}
              aria-invalid={!!errors.personal?.gender}
              {...register("personal.gender")}
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
          <FormField label="Nationality" htmlFor="nationality" required error={errors.personal?.nationality?.message}>
            <Input id="nationality" placeholder="e.g. British, Indian, Egyptian" {...register("personal.nationality")} />
          </FormField>
          
          <FormField label="Country of Residence" htmlFor="countryOfResidence" required error={errors.personal?.countryOfResidence?.message}>
            <Input id="countryOfResidence" placeholder="e.g. United Arab Emirates" {...register("personal.countryOfResidence")} />
          </FormField>
          
          <FormField label="Current City" htmlFor="city" required error={errors.personal?.city?.message}>
            <Input id="city" placeholder="e.g. Dubai" {...register("personal.city")} />
          </FormField>
          
          <FormField label="Phone Number" htmlFor="phone" required error={errors.personal?.phone?.message}>
            <Input id="phone" type="tel" placeholder="+971 50 123 4567" {...register("personal.phone")} />
          </FormField>
        </div>
      </FormSection>
    </div>
  )
}
