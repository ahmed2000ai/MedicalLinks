import { getRecruiterApplications } from "@/features/applications/services"
import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { RecruiterApplicationList } from "@/features/applications/components/RecruiterApplicationList"

export const metadata = { title: "Applications — MedicalLinks Recruiter" }

export default async function RecruiterApplicationsPage() {
  const applications = await getRecruiterApplications()

  return (
    <PageContainer>
      <PageHeader 
        title="Applications" 
        description="Manage the applicant pipeline across all hospital roles." 
        breadcrumbs={[{ label: "Recruiter", href: "/recruiter" }, { label: "Applications" }]}
      />
      <RecruiterApplicationList applications={applications} />
    </PageContainer>
  )
}
