"use client"

import React from "react"
import { useFormContext, useController } from "react-hook-form"
import { ProfileBuilderInput } from "../../schemas"
import { FormSection, FormField } from "@/components/ui/form-section"
import { Input } from "@/components/ui/input"
import { MultiSelect, SelectOption } from "@/components/ui/multi-select"
import Link from "next/link"
import { FileCheck, ArrowRight } from "lucide-react"

// ── GCC country → city master data ──────────────────────────────────────────

const GCC_DATA: Record<string, string[]> = {
  "Saudi Arabia": ["Riyadh", "Jeddah", "Dammam", "Al Khobar", "Mecca", "Medina", "Neom", "Tabuk", "Khobar"],
  "UAE":          ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman", "Ras Al Khaimah", "Fujairah"],
  "Qatar":        ["Doha", "Al Rayyan", "Al Wakrah", "Al Khor", "Lusail"],
  "Kuwait":       ["Kuwait City", "Al Ahmadi", "Hawalli", "Salmiya", "Farwaniya"],
  "Bahrain":      ["Manama", "Muharraq", "Riffa", "Isa Town", "Hamad Town"],
  "Oman":         ["Muscat", "Salalah", "Sohar", "Nizwa", "Sur"],
}

const COUNTRY_OPTIONS: SelectOption[] = Object.keys(GCC_DATA).map((c) => ({ label: c, value: c }))

export function PreferencesDocumentsTab() {
  const { register, control, formState: { errors } } = useFormContext<ProfileBuilderInput>()

  // ── Countries field ──────────────────────────────────────────────────────
  const { field: countriesField } = useController({
    control,
    name: "preferences.preferredCountries",
  })

  const selectedCountries = Array.isArray(countriesField.value)
    ? (countriesField.value as string[])
    : typeof countriesField.value === "string" && countriesField.value
      ? (countriesField.value as string).split(",").map((s) => s.trim()).filter(Boolean)
      : []

  // ── Cities field — options filtered to selected countries ────────────────
  const { field: citiesField } = useController({
    control,
    name: "preferences.preferredCities",
  })

  const selectedCities = Array.isArray(citiesField.value)
    ? (citiesField.value as string[])
    : typeof citiesField.value === "string" && citiesField.value
      ? (citiesField.value as string).split(",").map((s) => s.trim()).filter(Boolean)
      : []

  const cityOptions: SelectOption[] = selectedCountries
    .flatMap((country) => GCC_DATA[country] ?? [])
    .map((city) => ({ label: city, value: city }))

  // When countries change, drop any cities that no longer belong
  const handleCountriesChange = (newCountries: string[]) => {
    countriesField.onChange(newCountries)
    const validCities = new Set(
      newCountries.flatMap((c) => GCC_DATA[c] ?? [])
    )
    const filteredCities = selectedCities.filter((city) => validCities.has(city))
    if (filteredCities.length !== selectedCities.length) {
      citiesField.onChange(filteredCities)
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Preferences &amp; Documents</h2>
        <p className="text-muted-foreground mt-1">
          Specify your GCC location preferences and check required documents.
        </p>
      </div>

      <FormSection
        title="Job Preferences"
        description="Let hospitals know where you want to work and your requirements."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ── Country multi-select ── */}
          <FormField
            label="Preferred GCC Countries"
            htmlFor="preferredCountries"
            error={(errors.preferences?.preferredCountries as any)?.message}
          >
            <MultiSelect
              id="preferredCountries"
              options={COUNTRY_OPTIONS}
              value={selectedCountries}
              onChange={handleCountriesChange}
              placeholder="Select countries…"
              error={(errors.preferences?.preferredCountries as any)?.message}
            />
          </FormField>

          {/* ── City multi-select — disabled until a country is chosen ── */}
          <FormField
            label="Preferred Cities"
            htmlFor="preferredCities"
            error={(errors.preferences?.preferredCities as any)?.message}
            hint={selectedCountries.length === 0 ? "Select a country first" : undefined}
          >
            <MultiSelect
              id="preferredCities"
              options={cityOptions}
              value={selectedCities}
              onChange={citiesField.onChange}
              placeholder={
                selectedCountries.length === 0 ? "Select countries first…" : "Select cities…"
              }
              disabled={selectedCountries.length === 0}
              error={(errors.preferences?.preferredCities as any)?.message}
            />
          </FormField>

          {/* ── Checkboxes ── */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                {...register("preferences.relocationWilling")}
              />
              I am willing to relocate to the GCC
            </label>

            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                {...register("preferences.visaSponsorshipReq")}
              />
              I require visa sponsorship
            </label>
          </div>

          {/* ── Salary ── */}
          <FormField
            label="Expected Salary Minimum (USD/month)"
            htmlFor="expectedSalaryMin"
            error={errors.preferences?.expectedSalaryMin?.message}
          >
            <Input
              id="expectedSalaryMin"
              type="number"
              min="0"
              placeholder="e.g. 15000"
              {...register("preferences.expectedSalaryMin", { valueAsNumber: true })}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Credential Documents"
        description="Upload and manage your professional documents to complete your GCC recruitment readiness."
      >
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-start gap-4">
          <div className="p-2.5 bg-primary/10 text-primary rounded-lg shrink-0">
            <FileCheck size={22} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-foreground mb-1">Document Management is Ready</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Upload your CV, Medical License, DataFlow Report, Degree, Good Standing Certificate, and more.
              Your credential readiness score updates automatically.
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
  )
}
