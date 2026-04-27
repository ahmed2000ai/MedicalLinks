import { getRecruiterApplicationDetail } from "@/features/applications/services"
import { getMatchForApplication } from "@/features/matching/services"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { RecruiterApplicationDetail } from "@/features/applications/components/RecruiterApplicationDetail"
import { auth } from "@/auth"

export default async function RecruiterApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const application = await getRecruiterApplicationDetail(id)
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
          { label: "Recruiter", href: "/recruiter" }, 
          { label: "Applications", href: "/recruiter/applications" },
          { label: "Detail" }
        ]}
      />
      <RecruiterApplicationDetail 
        application={application} 
        match={match || undefined} 
        currentUserId={currentUserId} 
      />
    </PageContainer>
  )
}
