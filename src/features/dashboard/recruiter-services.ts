import { PrismaClient, ApplicationStatus } from "@prisma/client"
import { calculateCredentialReadiness } from "@/features/documents/types"

const prisma = new PrismaClient()

export async function getRecruiterMetrics() {
  const activeOpportunities = await prisma.opportunity.count({
    where: { status: "ACTIVE" },
  })

  const totalApplications = await prisma.application.count({
    where: { status: { notIn: ["DRAFT", "ARCHIVED", "WITHDRAWN"] } },
  })

  const upcomingInterviews = await prisma.interview.count({
    where: { scheduledAt: { gte: new Date() } },
  })

  const pendingDocuments = await prisma.application.count({
    where: { status: "NEEDS_DOCUMENTS" },
  })

  return {
    activeOpportunities,
    totalApplications,
    upcomingInterviews,
    pendingDocuments,
  }
}

export async function getApplicationPipelineSummary() {
  const apps = await prisma.application.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  })

  const counts: Record<string, number> = {}
  for (const a of apps) {
    counts[a.status] = a._count.status
  }

  const pipeline = [
    { label: "New/Screening", value: (counts["NEW"] || 0) + (counts["SCREENING"] || 0), color: "bg-blue-500" },
    { label: "Qualified", value: counts["QUALIFIED"] || 0, color: "bg-indigo-500" },
    { label: "Submitted", value: counts["SHORTLIST_SENT"] || 0, color: "bg-amber-500" },
    { label: "Interviewing", value: counts["INTERVIEWING"] || 0, color: "bg-purple-500" },
    { label: "Offer", value: counts["OFFER_STAGE"] || 0, color: "bg-pink-500" },
    { label: "Hired", value: counts["HIRED"] || 0, color: "bg-green-500" },
  ]

  return pipeline
}

export async function getUpcomingInterviews() {
  return await prisma.interview.findMany({
    where: { scheduledAt: { gte: new Date() } },
    orderBy: { scheduledAt: "asc" },
    take: 5,
    include: {
      application: {
        include: {
          applicantProfile: {
            include: { user: { select: { firstName: true, lastName: true } } },
          },
          opportunity: {
            include: { hospital: { select: { name: true } } },
          },
        },
      },
    },
  })
}

export async function getPriorityApplicants() {
  // Find profiles that are highly ready or have active status
  return await prisma.applicantProfile.findMany({
    where: { readinessLabel: "READY_NOW" },
    take: 5,
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      medicalLicenses: true,
      workExperiences: { orderBy: { startDate: "desc" }, take: 1 },
      applications: { select: { status: true } },
    },
    orderBy: {
      updatedAt: "desc",
    },
  })
}

export async function getActiveOpportunitiesSummary() {
  return await prisma.opportunity.findMany({
    where: { status: "ACTIVE" },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      hospital: { select: { name: true } },
      _count: {
        select: { applications: true },
      },
    },
  })
}

export async function getRecentActivity() {
  // Merge recent app status changes and new notifications?
  // Let's just pull application status history for MVP
  return await prisma.applicationStatusHistory.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      application: {
        include: {
          applicantProfile: {
            include: { user: { select: { firstName: true, lastName: true } } },
          },
          opportunity: {
            select: { title: true },
          },
        },
      },
    },
  })
}
