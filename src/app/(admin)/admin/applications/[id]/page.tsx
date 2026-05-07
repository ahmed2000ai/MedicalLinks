import { getAdminApplicationDetail } from "@/features/applications/services"
import { getMatchForApplication } from "@/features/matching/services"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { AdminApplicationDetail } from "@/features/applications/components/AdminApplicationDetail"
import { auth } from "@/auth"

export default async function AdminApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const application = await getAdminApplicationDetail(id)
  if (!application) notFound()

  const session = await auth()
  const currentUserId = session?.user?.id || ""

  const match = await getMatchForApplication(application.applicantProfileId, application.opportunityId)

  return (
    <PageContainer>
      <PageHeader 
        title="Application Review" 
        description="Manage candidate status, scheduling, and internal notes."
        breadcrumbs={[
          { label: "Admin", href: "/admin" }, 
          { label: "Applications", href: "/admin/applications" },
          { label: "Detail" }
        ]}
      />
      <AdminApplicationDetail 
        application={application} 
        match={match || undefined} 
        currentUserId={currentUserId} 
      />
    </PageContainer>
  )
}
