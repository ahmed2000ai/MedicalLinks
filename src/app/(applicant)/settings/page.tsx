import { PageHeader } from "@/components/ui/page-header"
import { PrivacySettingsForm } from "@/features/applicant-profile/components/PrivacySettingsForm"
import { getApplicantPrivacySettings } from "@/features/applicant-profile/privacy-actions"

export default async function SettingsPage() {
  const initialData = await getApplicantPrivacySettings()

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <PageHeader 
        title="Privacy & Discoverability" 
        description="Control how your profile appears to hospital partners and manage your contact details." 
      />
      
      <div className="mt-8">
        <PrivacySettingsForm initialData={initialData} />
      </div>
    </div>
  )
}
