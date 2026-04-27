import { getApplicantApplicationDetail } from "@/features/applications/services"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { ApplicantApplicationDetail } from "@/features/applications/components/ApplicantApplicationDetail"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const prisma = new PrismaClient()
  
  if (!session?.user?.id) notFound()
    
  const profile = await prisma.applicantProfile.findUnique({ where: { userId: session.user.id } })
  if (!profile) notFound()

  const application = await getApplicantApplicationDetail(id, profile.id)
  if (!application) notFound()

  return (
    <PageContainer>
      <PageHeader 
        title="Application Status" 
        description="Review updates and interview schedules."
        breadcrumbs={[
          { label: "Portal", href: "/dashboard" }, 
          { label: "Applications", href: "/applications" },
          { label: "Detail" }
        ]}
      />
      <ApplicantApplicationDetail application={application} />
    </PageContainer>
  )
}
