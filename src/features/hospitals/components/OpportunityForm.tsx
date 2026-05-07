"use client"

import { useTransition, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FormSection } from "@/components/ui/form-section"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { MEDICAL_SPECIALTIES, SENIORITY_LEVELS, URGENCY_LABELS, EMPLOYMENT_TYPE_LABELS, GCC_COUNTRIES } from "../types"
import { createOpportunity, updateOpportunity } from "../actions"

export function OpportunityForm({ opportunity, hospitals, initialHospitalId }: { opportunity?: any, hospitals: any[], initialHospitalId?: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedHospital, setSelectedHospital] = useState(opportunity?.hospitalId || initialHospitalId || "")

  // Sync country automatically if hospital changes (unless editing an existing opportunity with a distinct location)
  useEffect(() => {
    if (!opportunity && selectedHospital) {
      const h = hospitals.find(h => h.id === selectedHospital)
      if (h?.country) {
        const cInput = document.getElementById("country") as HTMLSelectElement
        if (cInput && !cInput.value) cInput.value = h.country
      }
    }
  }, [selectedHospital, hospitals, opportunity])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      if (opportunity?.id) {
        await updateOpportunity(opportunity.id, formData)
        router.push(`/admin/opportunities/${opportunity.id}`)
      } else {
        const newId = await createOpportunity(formData)
        router.push(`/admin/opportunities/${newId}`)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-12">
      <FormSection title="Core Role Details" description="Primary title, location, and linkage to hospital.">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hospitalId">Hospital *</Label>
              <select 
                id="hospitalId" 
                name="hospitalId" 
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Select hospital...</option>
                {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input id="title" name="title" defaultValue={opportunity?.title} placeholder="e.g. Consultant Cardiologist" required />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty *</Label>
              <select 
                id="specialty" 
                name="specialty" 
                defaultValue={opportunity?.specialty || ""}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Select specialty...</option>
                {MEDICAL_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seniority">Seniority Level</Label>
              <select 
                id="seniority" 
                name="seniority" 
                defaultValue={opportunity?.seniority || ""}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Select seniority...</option>
                {SENIORITY_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <select 
                id="employmentType" 
                name="employmentType" 
                defaultValue={opportunity?.employmentType || "FULL_TIME"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Target Country *</Label>
              <select 
                id="country" 
                name="country" 
                defaultValue={opportunity?.country || ""}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Select country...</option>
                {GCC_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" defaultValue={opportunity?.city || ""} placeholder="City" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Public Description *</Label>
            <Textarea 
              id="description" 
              name="description" 
              defaultValue={opportunity?.description || ""} 
              rows={6} 
              required
              placeholder="Role overview, responsibilities, and facility details..." 
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Requirements & Expectations" description="Hard medical requirements for applicants.">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minYearsExperience">Min Total Exp. (Yrs)</Label>
              <Input id="minYearsExperience" name="minYearsExperience" type="number" min="0" defaultValue={opportunity?.minYearsExperience} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minYearsPostSpecialty">Min Post-Spec Exp.</Label>
              <Input id="minYearsPostSpecialty" name="minYearsPostSpecialty" type="number" min="0" defaultValue={opportunity?.minYearsPostSpecialty} />
            </div>
            <div className="space-y-2 pt-8">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="boardCertRequired" name="boardCertRequired" value="true" defaultChecked={opportunity?.boardCertRequired} className="h-4 w-4" />
                <Label htmlFor="boardCertRequired">Board Cert Required</Label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="licensingRequirement">Target Licensing Authority</Label>
            <Input id="licensingRequirement" name="licensingRequirement" defaultValue={opportunity?.licensingRequirement || ""} placeholder="e.g. DHA, HAAD, SCFHS eligible" />
          </div>
        </div>
      </FormSection>

      <FormSection title="Compensation & Package" description="Salary and benefits framing.">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryRangeMin">Min Salary</Label>
              <Input id="salaryRangeMin" name="salaryRangeMin" type="number" min="0" defaultValue={opportunity?.salaryRangeMin} placeholder="e.g. 40000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryRangeMax">Max Salary</Label>
              <Input id="salaryRangeMax" name="salaryRangeMax" type="number" min="0" defaultValue={opportunity?.salaryRangeMax} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" name="currency" defaultValue={opportunity?.currency || "SAR"} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leaveAllowanceDays">Annual Leave (Days)</Label>
              <Input id="leaveAllowanceDays" name="leaveAllowanceDays" type="number" min="0" defaultValue={opportunity?.leaveAllowanceDays} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="annualFlights">Annual Flights (Tickets)</Label>
              <Input id="annualFlights" name="annualFlights" type="number" min="0" defaultValue={opportunity?.annualFlights} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="housingAllowance" name="housingAllowance" value="true" defaultChecked={opportunity?.housingAllowance} className="h-4 w-4" />
              <Label htmlFor="housingAllowance">Housing Provided</Label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="healthInsurance" name="healthInsurance" value="true" defaultChecked={opportunity ? opportunity.healthInsurance : true} className="h-4 w-4" />
              <Label htmlFor="healthInsurance">Health Insurance</Label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="visaSponsorship" name="visaSponsorship" value="true" defaultChecked={opportunity ? opportunity.visaSponsorship : true} className="h-4 w-4" />
              <Label htmlFor="visaSponsorship">Visa Provided</Label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="relocationSupport" name="relocationSupport" value="true" defaultChecked={opportunity ? opportunity.relocationSupport : true} className="h-4 w-4" />
              <Label htmlFor="relocationSupport">Relocation Covered</Label>
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Internal Operations" description="Recruiter eyes only.">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetStartDate">Target Start Date</Label>
              <Input id="targetStartDate" name="targetStartDate" type="date" defaultValue={opportunity?.targetStartDate ? new Date(opportunity.targetStartDate).toISOString().split('T')[0] : ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="urgency">Hiring Urgency</Label>
              <select 
                id="urgency" 
                name="urgency" 
                defaultValue={opportunity?.urgency || "STANDARD"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {Object.entries(URGENCY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="internalNotes">Internal Context</Label>
            <Textarea 
              id="internalNotes" 
              name="internalNotes" 
              defaultValue={opportunity?.internalNotes || ""} 
              rows={3} 
              placeholder="Why is this role open? Are there specific red flags the hospital hates?..." 
            />
          </div>
        </div>
      </FormSection>

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button variant="outline" type="button" onClick={() => router.back()} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : opportunity ? "Save Changes" : "Create Opportunity"}
        </Button>
      </div>
    </form>
  )
}
