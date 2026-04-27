/**
 * Dashboard data helpers for the Applicant Dashboard.
 *
 * These functions query the database via Prisma and return
 * clean, typed data for the dashboard page.
 *
 * Placeholder / mock values are clearly annotated with
 * TODO comments so they are easy to replace in later chunks.
 */

import { PrismaClient, ApplicationStatus } from "@prisma/client"
import { calculateProfileCompletion } from "@/features/applicant-profile/services"
import { calculateCredentialReadiness } from "@/features/documents/types"

const prisma = new PrismaClient()

// ---------------------------------------------------------------------------
// Profile summary
// ---------------------------------------------------------------------------

export interface ApplicantProfileSummary {
  firstName: string
  lastName: string
  email: string
  specialty: string | null        // from workExperiences or a specialty field
  currentCity: string | null
  countryOfResidence: string | null
  totalYearsExperience: number | null
  readinessLabel: string | null
  completionPct: number           // calculated
}

export async function getApplicantProfileSummary(userId: string): Promise<ApplicantProfileSummary | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      applicantProfile: {
        include: {
          workExperiences: { orderBy: { startDate: "desc" }, take: 1 },
          medicalLicenses: true,
          educations: true,
          languages: true,
          documents: true,
          preferences: true,
        },
      },
    },
  })

  if (!user?.applicantProfile) return null
  const p = user.applicantProfile

  const score = calculateProfileCompletion(p)

  const latestJob = p.workExperiences[0]

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    specialty: latestJob?.title ?? null,
    currentCity: p.currentCity,
    countryOfResidence: p.countryOfResidence,
    totalYearsExperience: p.totalYearsExperience,
    readinessLabel: p.readinessLabel,
    completionPct: score,
  }
}

// ---------------------------------------------------------------------------
// Application counts by status group
// ---------------------------------------------------------------------------

export interface ApplicationStatusGroup {
  applied: number        // NEW + SCREENING + QUALIFIED + NURTURE + NEEDS_DOCUMENTS + SHORTLIST_SENT
  interviewing: number   // INTERVIEWING
  offerStage: number     // OFFER_STAGE + ONBOARDING
  hired: number          // HIRED
  total: number
}

export async function getApplicationStatusGroups(userId: string): Promise<ApplicationStatusGroup> {
  const profile = await prisma.applicantProfile.findUnique({
    where: { userId },
    include: {
      applications: { select: { status: true } },
    },
  })

  if (!profile) return { applied: 0, interviewing: 0, offerStage: 0, hired: 0, total: 0 }

  const apps = profile.applications

  const applied = apps.filter(a =>
    (["NEW", "SCREENING", "QUALIFIED", "NURTURE", "NEEDS_DOCUMENTS", "SHORTLIST_SENT"] as ApplicationStatus[]).includes(a.status)
  ).length

  const interviewing = apps.filter(a => a.status === "INTERVIEWING").length
  const offerStage   = apps.filter(a => (["OFFER_STAGE", "ONBOARDING"] as ApplicationStatus[]).includes(a.status)).length
  const hired        = apps.filter(a => a.status === "HIRED").length

  return { applied, interviewing, offerStage, hired, total: apps.length }
}

// ---------------------------------------------------------------------------
// Upcoming interviews
// ---------------------------------------------------------------------------

export interface UpcomingInterview {
  id: string
  hospitalName: string
  roleTitle: string
  scheduledAt: Date
  timezone: string
  type: string
  daysUntil: number
}

export async function getUpcomingInterviews(userId: string): Promise<UpcomingInterview[]> {
  const profile = await prisma.applicantProfile.findUnique({
    where: { userId },
    select: {
      applications: {
        include: {
          opportunity: {
            include: { hospital: { select: { name: true } } },
          },
          interviews: {
            where: { scheduledAt: { gte: new Date() } },
            orderBy: { scheduledAt: "asc" },
            take: 5,
          },
        },
      },
    },
  })

  if (!profile) return []

  const now = new Date()
  const results: UpcomingInterview[] = []

  for (const app of profile.applications) {
    for (const interview of app.interviews) {
      const ms = interview.scheduledAt.getTime() - now.getTime()
      const daysUntil = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
      results.push({
        id: interview.id,
        hospitalName: app.opportunity.hospital.name,
        roleTitle: app.opportunity.title,
        scheduledAt: interview.scheduledAt,
        timezone: interview.timezone,
        type: interview.type,
        daysUntil,
      })
    }
  }

  return results.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime()).slice(0, 3)
}

// ---------------------------------------------------------------------------
// License status summary (for quick-start readiness indicators)
// ---------------------------------------------------------------------------

export interface LicenseReadinessSummary {
  hasActiveLicense: boolean
  activeAuthorities: string[]
  pendingAuthorities: string[]
}

export async function getLicenseReadiness(userId: string): Promise<LicenseReadinessSummary> {
  const profile = await prisma.applicantProfile.findUnique({
    where: { userId },
    include: { medicalLicenses: true },
  })

  if (!profile) return { hasActiveLicense: false, activeAuthorities: [], pendingAuthorities: [] }

  const active  = profile.medicalLicenses.filter(l => l.status?.toLowerCase() === "active")
  const pending = profile.medicalLicenses.filter(l => l.status?.toLowerCase() !== "active")

  return {
    hasActiveLicense: active.length > 0,
    activeAuthorities:  active.map(l => l.issuingAuthority),
    pendingAuthorities: pending.map(l => l.issuingAuthority),
  }
}

// ---------------------------------------------------------------------------
// Top opportunity matches (via matching engine)
// ---------------------------------------------------------------------------

import { getRecommendedOpportunitiesForApplicant } from "@/features/matching/services"

export interface OpportunityMatch {
  id: string
  title: string
  hospitalName: string
  country: string
  city: string | null
  specialty: string
  employmentType: string
  salaryRangeMin: number | null
  salaryRangeMax: number | null
  currency: string
  matchScore: number   // TODO: replace with real scoring in matching engine chunk
}

export async function getTopOpportunityMatches(userId: string, limit = 3): Promise<OpportunityMatch[]> {
  const profile = await prisma.applicantProfile.findUnique({ where: { userId }, select: { id: true } })
  if (!profile) return []

  const scoredOpps = await getRecommendedOpportunitiesForApplicant(profile.id, limit)

  return scoredOpps.map((opp) => ({
    id: opp.id,
    title: opp.title,
    hospitalName: opp.hospital.name,
    country: opp.country,
    city: opp.city,
    specialty: opp.specialty,
    employmentType: opp.employmentType,
    salaryRangeMin: opp.salaryRangeMin,
    salaryRangeMax: opp.salaryRangeMax,
    currency: opp.currency,
    matchScore: opp.match.score,
  }))
}

// ---------------------------------------------------------------------------
// Credential / Document readiness (from uploaded documents)
// ---------------------------------------------------------------------------

export interface DocumentReadinessSummary {
  uploadedCount: number
  hasDataFlow: boolean
  hasCV: boolean
  credentialScore: number // 0-100
}

export async function getDocumentReadiness(userId: string): Promise<DocumentReadinessSummary> {
  const profile = await prisma.applicantProfile.findUnique({
    where: { userId },
    include: { documents: { select: { type: true, expiryDate: true, fileUrl: true, title: true, issueDate: true, issuingAuthority: true } } },
  })

  if (!profile) return { uploadedCount: 0, hasDataFlow: false, hasCV: false, credentialScore: 0 }

  const docs = profile.documents
  const readiness = calculateCredentialReadiness(docs.map(d => ({
    type: d.type,
    fileUrl: d.fileUrl,
    title: d.title ?? null,
    expiryDate: d.expiryDate ?? null,
    issueDate: d.issueDate ?? null,
    issuingAuthority: d.issuingAuthority ?? null,
  })))

  return {
    uploadedCount:   docs.length,
    hasDataFlow:     docs.some(d => d.type === "DATAFLOW_REPORT"),
    hasCV:           docs.some(d => d.type === "CV"),
    credentialScore: readiness.score,
  }
}

