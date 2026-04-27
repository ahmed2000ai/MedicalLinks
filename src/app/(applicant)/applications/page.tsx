import { getApplicantApplications } from "@/features/applications/services"
import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { ApplicantApplicationList } from "@/features/applications/components/ApplicantApplicationList"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

export const metadata = { title: "My Applications — MedicalLinks" }

export default async function ApplicationsPage() {
  const session = await auth()
  const prisma = new PrismaClient()
  let applications: any[] = []

  if (session?.user?.id) {
    const profile = await prisma.applicantProfile.findUnique({ where: { userId: session.user.id } })
    if (profile) {
      applications = await getApplicantApplications(profile.id)
    }
  }

  return (
    <PageContainer>
      <PageHeader 
        title="My Applications" 
        description="Track the status of your opportunity submissions." 
        breadcrumbs={[{ label: "Portal", href: "/dashboard" }, { label: "Applications" }]}
      />
      <ApplicantApplicationList applications={applications} />
    </PageContainer>
  )
}
