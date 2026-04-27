"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { FormSection } from "@/components/ui/form-section"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { HOSPITAL_TYPES, GCC_COUNTRIES } from "../types"
import { createHospital, updateHospital } from "../actions"

export function HospitalForm({ hospital }: { hospital?: any }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      if (hospital?.id) {
        await updateHospital(hospital.id, formData)
        router.push(`/recruiter/hospitals/${hospital.id}`)
      } else {
        const newId = await createHospital(formData)
        router.push(`/recruiter/hospitals/${newId}`)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-12">
      <FormSection 
        title="Organization Details" 
        description="Public-facing details for the hospital organization or group."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Hospital Name *</Label>
              <Input id="name" name="name" defaultValue={hospital?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Hospital Type</Label>
              <select 
                id="type" 
                name="type" 
                defaultValue={hospital?.type || ""}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select type...</option>
                {HOSPITAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              defaultValue={hospital?.description || ""} 
              rows={4} 
              placeholder="Overview of the hospital, specialties, and facilities..." 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" type="url" defaultValue={hospital?.website || ""} placeholder="https://" />
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection 
        title="Primary Location" 
        description="Headquarters or primary location (additional locations can be added after saving)."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <select 
              id="country" 
              name="country" 
              defaultValue={hospital?.country || ""}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">Select country...</option>
              {GCC_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" defaultValue={hospital?.city || ""} />
          </div>
        </div>
      </FormSection>

      <FormSection 
        title="Internal Management" 
        description="Recruiter-only fields. Not visible to candidates."
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isActive" 
              name="isActive" 
              value="true" 
              defaultChecked={hospital ? hospital.isActive : true} 
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isActive">Active (Visible in system)</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="internalNotes">Internal Notes</Label>
            <Textarea 
              id="internalNotes" 
              name="internalNotes" 
              defaultValue={hospital?.internalNotes || ""} 
              rows={3} 
              placeholder="Account manager, hiring preferences, contract terms..." 
            />
          </div>
        </div>
      </FormSection>

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button variant="outline" type="button" onClick={() => router.back()} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : hospital ? "Save Changes" : "Create Hospital"}
        </Button>
      </div>
    </form>
  )
}
