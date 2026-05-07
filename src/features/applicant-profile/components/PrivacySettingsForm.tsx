"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateApplicantPrivacySettings } from "@/features/applicant-profile/privacy-actions"
import type { PrivacySettingsInput } from "@/features/applicant-profile/privacy-types"
import { Button } from "@/components/ui/button"
import { FeedbackAlert } from "@/components/ui/feedback"
import { Shield, Eye, EyeOff, UserSquare2 } from "lucide-react"

export function PrivacySettingsForm({ initialData }: { initialData: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Local state to power preview cards
  const [visibility, setVisibility] = useState(initialData.visibility)
  const [openToOpps, setOpenToOpps] = useState(initialData.openToOpportunities)
  const [hideContact, setHideContact] = useState(initialData.hideContactDetails)
  const [hideEmployer, setHideEmployer] = useState(initialData.hideCurrentEmployer)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const payload: PrivacySettingsInput = {
        visibility,
        openToOpportunities: openToOpps,
        hideContactDetails: hideContact,
        hideCurrentEmployer: hideEmployer,
      }
      await updateApplicantPrivacySettings(payload)
      setSuccess(true)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to save privacy settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && <FeedbackAlert type="error" message={error} />}
      {success && <FeedbackAlert type="success" message="Privacy settings updated successfully." />}

      {/* Visibility Settings */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg text-slate-800">Profile Visibility</h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Control how you appear in the MedicalLinks candidate pool. Only verified, active hospitals have access to the pool.
          </p>

          <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${visibility === "VISIBLE" ? "bg-primary/5 border-primary/20" : "hover:bg-slate-50"}`}>
            <input 
              type="radio" 
              name="visibility" 
              value="VISIBLE" 
              checked={visibility === "VISIBLE"}
              onChange={() => setVisibility("VISIBLE")}
              className="mt-1"
            />
            <div>
              <div className="font-medium flex items-center gap-2">
                Visible to Hospitals <Eye className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-sm text-slate-500 mt-1">Your profile will be discoverable in searches. Hospitals can view your qualifications and experience.</div>
            </div>
          </label>

          <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${visibility === "ANONYMOUS" ? "bg-primary/5 border-primary/20" : "hover:bg-slate-50"}`}>
            <input 
              type="radio" 
              name="visibility" 
              value="ANONYMOUS" 
              checked={visibility === "ANONYMOUS"}
              onChange={() => setVisibility("ANONYMOUS")}
              className="mt-1"
            />
            <div>
              <div className="font-medium flex items-center gap-2">
                Anonymous Mode <UserSquare2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-sm text-slate-500 mt-1">Hospitals can see your specialty and experience, but your name, photo, and identity are hidden.</div>
            </div>
          </label>

          <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${visibility === "HIDDEN" ? "bg-slate-100 border-slate-300" : "hover:bg-slate-50"}`}>
            <input 
              type="radio" 
              name="visibility" 
              value="HIDDEN" 
              checked={visibility === "HIDDEN"}
              onChange={() => setVisibility("HIDDEN")}
              className="mt-1"
            />
            <div>
              <div className="font-medium flex items-center gap-2">
                Hidden <EyeOff className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-sm text-slate-500 mt-1">Your profile is completely removed from the hospital discovery pool. You will not receive any outreach.</div>
            </div>
          </label>
        </div>
      </div>

      {/* Open to Opportunities */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50">
          <h2 className="font-semibold text-lg text-slate-800">Job Search Status</h2>
        </div>
        <div className="p-6 space-y-4">
          <label className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${openToOpps === "ACTIVE" ? "border-primary text-primary bg-primary/5" : "hover:bg-slate-50"}`}>
            <input 
              type="radio" 
              name="openToOpportunities" 
              value="ACTIVE" 
              checked={openToOpps === "ACTIVE"}
              onChange={() => setOpenToOpps("ACTIVE")}
            />
            <span className="font-medium">Actively looking for opportunities</span>
          </label>

          <label className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${openToOpps === "SELECTIVE" ? "border-primary text-primary bg-primary/5" : "hover:bg-slate-50"}`}>
            <input 
              type="radio" 
              name="openToOpportunities" 
              value="SELECTIVE" 
              checked={openToOpps === "SELECTIVE"}
              onChange={() => setOpenToOpps("SELECTIVE")}
            />
            <span className="font-medium">Open to selective or exceptional offers</span>
          </label>

          <label className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${openToOpps === "PAUSED" ? "border-primary text-primary bg-primary/5" : "hover:bg-slate-50"}`}>
            <input 
              type="radio" 
              name="openToOpportunities" 
              value="PAUSED" 
              checked={openToOpps === "PAUSED"}
              onChange={() => setOpenToOpps("PAUSED")}
            />
            <span className="font-medium">Not looking (Paused)</span>
          </label>
        </div>
      </div>

      {/* Specific Privacy Rules */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50">
          <h2 className="font-semibold text-lg text-slate-800">Data Masking Rules</h2>
        </div>
        <div className="p-6 space-y-6">
          <label className="flex items-start gap-4">
            <input 
              type="checkbox" 
              checked={hideContact}
              onChange={(e) => setHideContact(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div>
              <div className="font-medium">Hide Email & Phone Number</div>
              <div className="text-sm text-slate-500 mt-1">
                Keep direct contact details private. Hospitals must use the platform's internal messaging to contact you initially.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-4">
            <input 
              type="checkbox" 
              checked={hideEmployer}
              onChange={(e) => setHideEmployer(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div>
              <div className="font-medium">Hide Current Employer</div>
              <div className="text-sm text-slate-500 mt-1">
                Mask the name of your current hospital or clinic in search results to protect your privacy during the job hunt.
              </div>
            </div>
          </label>
        </div>
      </div>

      <div className="flex justify-end border-t pt-6">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Saving Settings..." : "Save Privacy Settings"}
        </Button>
      </div>
    </form>
  )
}
