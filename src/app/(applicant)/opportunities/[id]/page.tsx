import { getLiveOpportunityDetail, checkHasApplied, getSavedOpportunities } from "@/features/applications/services"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { LiveOpportunityDetail } from "@/features/applications/components/LiveOpportunityDetail"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { getApplicantProfileForMatch } from "@/features/matching/services"
import { calculateMatchScore } from "@/features/matching/engine"

export default async function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const opportunity = await getLiveOpportunityDetail(id)
  
  if (!opportunity) notFound()

  const session = await auth()
  const prisma = new PrismaClient()
  
  let hasApplied = false
  let isSaved = false
  let match = undefined

  if (session?.user?.id) {
    const basicProfile = await prisma.applicantProfile.findUnique({ where: { userId: session.user.id }, select: { id: true } })
    if (basicProfile) {
      hasApplied = await checkHasApplied(basicProfile.id, opportunity.id)
      const saved = await getSavedOpportunities(basicProfile.id)
      isSaved = saved.some(s => s.opportunityId === opportunity.id)

      const fullProfile = await getApplicantProfileForMatch(basicProfile.id)
      if (fullProfile) {
        match = calculateMatchScore(fullProfile, opportunity)
      }
    }
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Opportunity Details" 
        description="Review the role and apply."
        breadcrumbs={[
          { label: "Portal", href: "/dashboard" }, 
          { label: "Opportunities", href: "/opportunities" },
          { label: "Detail" }
        ]}
      />
      <LiveOpportunityDetail opportunity={opportunity} hasApplied={hasApplied} initialIsSaved={isSaved} match={match} />
    </PageContainer>
  )
}
