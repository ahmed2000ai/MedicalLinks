import { PageHeader } from "@/components/ui/page-header"
import { ProfileWizard } from "@/features/applicant-profile/components/ProfileWizard"
import { getApplicantProfile } from "@/features/applicant-profile/services"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const data = await getApplicantProfile(session.user.id)

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader 
        title="Applicant Profile Builder" 
        description="Complete your medical profile to unlock matching opportunities across the GCC." 
      />
      <div className="mt-6">
        <ProfileWizard initialData={data || {}} />
      </div>
    </div>
  )
}
