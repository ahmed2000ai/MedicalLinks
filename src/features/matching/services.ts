import { PrismaClient } from "@prisma/client"
import { calculateMatchScore } from "./engine"
import { MatchResult } from "./types"

const prisma = new PrismaClient()

// Common includes needed for full matching logic
const applicantInclude = {
  residencyTrainings: true,
  boardCertifications: true,
  fellowshipTrainings: true,
  medicalLicenses: true,
  preferences: true,
}

export async function getApplicantProfileForMatch(applicantProfileId: string) {
  return prisma.applicantProfile.findUnique({
    where: { id: applicantProfileId },
    include: applicantInclude,
  })
}

export async function getOpportunityForMatch(opportunityId: string) {
  return prisma.opportunity.findUnique({
    where: { id: opportunityId },
  })
}

/**
 * Returns top active opportunities for an applicant ranked by match score.
 */
export async function getRecommendedOpportunitiesForApplicant(applicantProfileId: string, limit = 5) {
  const applicant = await getApplicantProfileForMatch(applicantProfileId)
  if (!applicant) return []

  const activeOpps = await prisma.opportunity.findMany({
    where: { status: "ACTIVE" },
    include: {
      hospital: { select: { name: true, city: true, country: true } },
    },
  })

  const scoredOpps = activeOpps.map(opp => {
    const match = calculateMatchScore(applicant, opp)
    return { ...opp, match }
  })

  // Sort by score desc
  scoredOpps.sort((a, b) => b.match.score - a.match.score)
  
  return scoredOpps.slice(0, limit)
}

/**
 * Calculates match score for a specific application in the admin view.
 */
export async function getMatchForApplication(applicantProfileId: string, opportunityId: string): Promise<MatchResult | null> {
  const [applicant, opportunity] = await Promise.all([
    getApplicantProfileForMatch(applicantProfileId),
    getOpportunityForMatch(opportunityId)
  ])

  if (!applicant || !opportunity) return null

  return calculateMatchScore(applicant, opportunity)
}

/**
 * Ranks all applications for a specific opportunity.
 */
export async function rankApplicationsForOpportunity(opportunityId: string) {
  const opportunity = await getOpportunityForMatch(opportunityId)
  if (!opportunity) return []

  const applications = await prisma.application.findMany({
    where: { opportunityId },
    include: {
      applicantProfile: {
        include: applicantInclude,
      },
    },
  })

  const scoredApps = applications.map(app => {
    const match = calculateMatchScore(app.applicantProfile, opportunity)
    return { ...app, match }
  })

  scoredApps.sort((a, b) => b.match.score - a.match.score)
  
  return scoredApps
}
