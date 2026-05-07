import { getAdminApplications } from "@/features/applications/services"
import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { AdminApplicationList } from "@/features/applications/components/AdminApplicationList"

export const metadata = { title: "Applications — MedicalLinks Admin" }

export default async function AdminApplicationsPage() {
  const applications = await getAdminApplications()

  return (
    <PageContainer>
      <PageHeader 
        title="Applications" 
        description="Manage the applicant pipeline across all hospital roles." 
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Applications" }]}
      />
      <AdminApplicationList applications={applications} />
    </PageContainer>
  )
}
