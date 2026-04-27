import { getLiveOpportunities, getSavedOpportunities } from "@/features/applications/services"
import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { LiveOpportunityList } from "@/features/applications/components/LiveOpportunityList"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

export const metadata = { title: "Opportunities — MedicalLinks" }

export default async function OpportunitiesPage() {
  const session = await auth()
  const prisma = new PrismaClient()
  let savedIds: string[] = []

  if (session?.user?.id) {
    const profile = await prisma.applicantProfile.findUnique({ where: { userId: session.user.id } })
    if (profile) {
      const saved = await getSavedOpportunities(profile.id)
      savedIds = saved.map(s => s.opportunityId)
    }
  }

  const opportunities = await getLiveOpportunities()

  return (
    <PageContainer>
      <PageHeader 
        title="Opportunities" 
        description="Explore open roles matching your profile across our partner hospitals in the GCC." 
        breadcrumbs={[{ label: "Portal", href: "/dashboard" }, { label: "Opportunities" }]}
      />
      <LiveOpportunityList opportunities={opportunities} savedOpportunityIds={savedIds} />
    </PageContainer>
  )
}
