"use client"

import { useState } from "react"
import { updateHospitalAgreement } from "@/features/admin/hospital-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FeedbackAlert } from "@/components/ui/feedback"
import { HospitalStatus } from "@prisma/client"
import { useRouter } from "next/navigation"

export function HospitalAgreementForm({ 
  hospitalId, 
  initialData 
}: { 
  hospitalId: string, 
  initialData: any 
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData(e.currentTarget)
      await updateHospitalAgreement(hospitalId, formData)
      setSuccess(true)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to update hospital agreement")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: Date | null) => {
    if (!dateString) return ""
    return new Date(dateString).toISOString().split('T')[0]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <FeedbackAlert type="error" message={error} />}
      {success && <FeedbackAlert type="success" message="Hospital agreement updated successfully." />}

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Account Status</label>
          <select 
            name="status" 
            defaultValue={initialData.status}
            className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <option value="PENDING">Pending Review</option>
            <option value="ACTIVE">Active (Access Granted)</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="EXPIRED">Expired</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <p className="text-xs text-muted-foreground">
            Only ACTIVE hospitals can access the portal.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Commission Rate (%)</label>
          <Input 
            name="commissionRate" 
            type="number" 
            step="0.01" 
            placeholder="e.g. 15.0"
            defaultValue={initialData.commissionRate || ""}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Agreement Start Date</label>
          <Input 
            name="agreementStartDate" 
            type="date" 
            defaultValue={formatDate(initialData.agreementStartDate)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Agreement End Date</label>
          <Input 
            name="agreementEndDate" 
            type="date" 
            defaultValue={formatDate(initialData.agreementEndDate)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Internal Agreement Notes</label>
        <textarea
          name="agreementNotes"
          className="w-full h-24 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          placeholder="Private notes about commercial terms, special arrangements, etc."
          defaultValue={initialData.agreementNotes || ""}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Agreement & Status"}
        </Button>
      </div>
    </form>
  )
}
