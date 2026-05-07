"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { SlidersHorizontal, X } from "lucide-react"

const GCC_COUNTRIES = [
  "Saudi Arabia",
  "United Arab Emirates",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
]

const EXPERIENCE_OPTIONS = [
  { label: "Any Experience", value: "" },
  { label: "2+ years", value: "2" },
  { label: "5+ years", value: "5" },
  { label: "10+ years", value: "10" },
  { label: "15+ years", value: "15" },
  { label: "20+ years", value: "20" },
]

const READINESS_OPTIONS = [
  { label: "Any Readiness", value: "" },
  { label: "Ready Now", value: "READY_NOW" },
  { label: "Near Ready", value: "NEAR_READY" },
  { label: "Future Pipeline", value: "FUTURE_PIPELINE" },
]

const AVAILABILITY_OPTIONS = [
  { label: "Any Availability", value: "" },
  { label: "Actively Looking", value: "ACTIVE" },
  { label: "Selectively Open", value: "SELECTIVE" },
]

export function CandidateFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [country, setCountry] = useState(searchParams.get("country") || "")
  const [minExperience, setMinExperience] = useState(searchParams.get("minExp") || "")
  const [readiness, setReadiness] = useState(searchParams.get("readiness") || "")
  const [availability, setAvailability] = useState(searchParams.get("availability") || "")
  const [relocation, setRelocation] = useState(searchParams.get("relocation") === "true")

  const hasActiveFilters = country || minExperience || readiness || availability || relocation

  const handleApply = () => {
    const params = new URLSearchParams(searchParams)

    if (country) params.set("country", country); else params.delete("country")
    if (minExperience) params.set("minExp", minExperience); else params.delete("minExp")
    if (readiness) params.set("readiness", readiness); else params.delete("readiness")
    if (availability) params.set("availability", availability); else params.delete("availability")
    if (relocation) params.set("relocation", "true"); else params.delete("relocation")

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClear = () => {
    setCountry("")
    setMinExperience("")
    setReadiness("")
    setAvailability("")
    setRelocation(false)

    const params = new URLSearchParams(searchParams)
    params.delete("country")
    params.delete("minExp")
    params.delete("readiness")
    params.delete("availability")
    params.delete("relocation")

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="bg-white border rounded-xl p-5 space-y-5 sticky top-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <h3 className="font-semibold text-slate-900 text-sm">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>

      {/* Current Location */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
          Current Country
        </Label>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="All countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All countries</SelectItem>
            {GCC_COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
            <SelectItem value="Egypt">Egypt</SelectItem>
            <SelectItem value="Jordan">Jordan</SelectItem>
            <SelectItem value="Lebanon">Lebanon</SelectItem>
            <SelectItem value="Sudan">Sudan</SelectItem>
            <SelectItem value="Pakistan">Pakistan</SelectItem>
            <SelectItem value="India">India</SelectItem>
            <SelectItem value="Philippines">Philippines</SelectItem>
            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
            <SelectItem value="United States">United States</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Years of Experience */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
          Years of Experience
        </Label>
        <Select value={minExperience} onValueChange={setMinExperience}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Any experience" />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Readiness */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
          Credential Readiness
        </Label>
        <Select value={readiness} onValueChange={setReadiness}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Any readiness" />
          </SelectTrigger>
          <SelectContent>
            {READINESS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Availability */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
          Availability
        </Label>
        <Select value={availability} onValueChange={setAvailability}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Any availability" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABILITY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Relocation Toggle */}
      <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
        <Checkbox
          id="relocation"
          checked={relocation}
          onCheckedChange={(val) => setRelocation(val === true)}
        />
        <Label htmlFor="relocation" className="text-sm text-slate-700 cursor-pointer leading-snug">
          Willing to relocate to GCC
        </Label>
      </div>

      <Button onClick={handleApply} className="w-full">
        Apply Filters
      </Button>
    </div>
  )
}
