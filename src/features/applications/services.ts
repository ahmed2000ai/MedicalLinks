import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// ─── Applicant Side ──────────────────────────────────────────────────────────

export async function getLiveOpportunities() {
  return prisma.opportunity.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    include: {
      hospital: { select: { name: true, city: true, country: true, type: true } },
      department: { select: { name: true } },
    },
  })
}

export async function getLiveOpportunityDetail(id: string) {
  return prisma.opportunity.findFirst({
    where: { id, status: "ACTIVE" },
    include: {
      hospital: { select: { id: true, name: true, city: true, country: true, type: true, description: true } },
      department: { select: { name: true } },
      requirements: { orderBy: [{ isMandatory: "desc" }, { createdAt: "asc" }] },
      benefits: { orderBy: { createdAt: "asc" } },
    },
  })
}

export async function getApplicantApplications(applicantProfileId: string) {
  return prisma.application.findMany({
    where: { applicantProfileId },
    orderBy: { updatedAt: "desc" },
    include: {
      opportunity: {
        select: { id: true, title: true, specialty: true, hospital: { select: { name: true, country: true } } },
      },
      interviews: { orderBy: { scheduledAt: "asc" } },
    },
  })
}

export async function getApplicantApplicationDetail(applicationId: string, applicantProfileId: string) {
  return prisma.application.findFirst({
    where: { id: applicationId, applicantProfileId },
    include: {
      opportunity: {
        include: {
          hospital: { select: { name: true, country: true, city: true } },
          department: { select: { name: true } },
        },
      },
      statusHistory: { orderBy: { createdAt: "desc" } },
      interviews: { orderBy: { scheduledAt: "asc" } },
    },
  })
}

export async function getSavedOpportunities(applicantProfileId: string) {
  return prisma.savedOpportunity.findMany({
    where: { applicantProfileId },
    orderBy: { savedAt: "desc" },
    include: {
      opportunity: {
        include: { hospital: { select: { name: true, country: true } } },
      },
    },
  })
}

export async function checkHasApplied(applicantProfileId: string, opportunityId: string) {
  const existing = await prisma.application.findUnique({
    where: { applicantProfileId_opportunityId: { applicantProfileId, opportunityId } },
  })
  return !!existing
}

// ─── Admin Side ──────────────────────────────────────────────────────────────

export async function getAdminApplications() {
  return prisma.application.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      applicantProfile: {
        select: { id: true, user: { select: { firstName: true, lastName: true, email: true } }, currentJobTitle: true, countryOfResidence: true },
      },
      opportunity: {
        select: { id: true, title: true, hospital: { select: { name: true } } },
      },
      interviews: { orderBy: { scheduledAt: "asc" } },
    },
  })
}

export async function getAdminApplicationDetail(applicationId: string) {
  return prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      applicantProfile: {
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      },
      opportunity: {
        include: { hospital: { select: { name: true } } },
      },
      statusHistory: { orderBy: { createdAt: "desc" } },
      interviews: { orderBy: { scheduledAt: "asc" } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  })
}
