"use server"

import { PrismaClient, ApplicationStatus, InterviewType } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { z } from "zod"
import { createNotification } from "../notifications/actions"

const prisma = new PrismaClient()

// ─── Guards ──────────────────────────────────────────────────────────────────

async function requireApplicant() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  const role = (session.user as any).role
  if (role !== "APPLICANT") throw new Error("Forbidden")
  
  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (!profile) throw new Error("Profile not found")
  return { userId: session.user.id, profileId: profile.id }
}

async function requireRecruiter() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  const role = (session.user as any).role
  if (role !== "RECRUITER" && role !== "ADMIN") throw new Error("Forbidden")
  return session.user.id
}

// ─── Applicant Actions ───────────────────────────────────────────────────────

export async function applyToOpportunity(opportunityId: string) {
  const { profileId, userId } = await requireApplicant()

  // Prevent duplicate
  const existing = await prisma.application.findUnique({
    where: { applicantProfileId_opportunityId: { applicantProfileId: profileId, opportunityId } },
  })
  if (existing) throw new Error("Already applied")

  const app = await prisma.application.create({
    data: {
      applicantProfileId: profileId,
      opportunityId,
      status: "NEW",
    },
  })

  // Log history
  await prisma.applicationStatusHistory.create({
    data: {
      applicationId: app.id,
      status: "NEW",
      changedById: userId,
    },
  })

  revalidatePath("/opportunities")
  revalidatePath("/applications")
  return app.id
}

export async function toggleSavedOpportunity(opportunityId: string) {
  const { profileId } = await requireApplicant()

  const existing = await prisma.savedOpportunity.findUnique({
    where: { applicantProfileId_opportunityId: { applicantProfileId: profileId, opportunityId } },
  })

  if (existing) {
    await prisma.savedOpportunity.delete({ where: { id: existing.id } })
  } else {
    await prisma.savedOpportunity.create({
      data: { applicantProfileId: profileId, opportunityId },
    })
  }
  revalidatePath("/opportunities")
  revalidatePath("/opportunities/[id]")
}

export async function withdrawApplication(applicationId: string) {
  const { profileId, userId } = await requireApplicant()
  
  // Verify ownership
  const app = await prisma.application.findFirst({
    where: { id: applicationId, applicantProfileId: profileId },
  })
  if (!app) throw new Error("Application not found")

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: "WITHDRAWN" },
  })

  await prisma.applicationStatusHistory.create({
    data: {
      applicationId,
      status: "WITHDRAWN",
      reason: "Withdrawn by applicant",
      changedById: userId,
    },
  })

  revalidatePath("/applications")
  revalidatePath(`/applications/${applicationId}`)
}

// ─── Recruiter Actions ───────────────────────────────────────────────────────

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus, reason?: string) {
  const userId = await requireRecruiter()

  const app = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
    include: {
      applicantProfile: { select: { userId: true } },
      opportunity: { select: { title: true } },
    }
  })

  await prisma.applicationStatusHistory.create({
    data: {
      applicationId,
      status,
      changedById: userId,
      reason,
    },
  })

  // Notify applicant
  await createNotification({
    userId: app.applicantProfile.userId,
    type: "APPLICATION_STATUS_UPDATED",
    title: "Application Status Updated",
    message: `Your application for ${app.opportunity.title} is now ${status}.`,
    linkUrl: `/applications/${applicationId}`,
    entityType: "Application",
    entityId: applicationId,
  })

  revalidatePath("/recruiter/applications")
  revalidatePath(`/recruiter/applications/${applicationId}`)
  revalidatePath("/applications")
}

const InterviewSchema = z.object({
  scheduledAt: z.string().min(1),
  timezone:    z.string().default("UTC"),
  type:        z.nativeEnum(InterviewType),
  location:    z.string().optional(),
  meetingLink: z.string().optional(),
})

export async function scheduleInterview(applicationId: string, formData: FormData) {
  await requireRecruiter()
  const data = InterviewSchema.parse(Object.fromEntries(formData))

  await prisma.interview.create({
    data: {
      applicationId,
      scheduledAt: new Date(data.scheduledAt),
      timezone: data.timezone,
      type: data.type,
      location: data.location || null,
      meetingLink: data.meetingLink || null,
    },
  })

  // Auto-transition to INTERVIEWING if not already in an advanced state
  const app = await prisma.application.findUnique({ 
    where: { id: applicationId },
    include: { applicantProfile: { select: { userId: true } }, opportunity: { select: { title: true } } }
  })
  if (app && ["NEW", "SCREENING", "QUALIFIED", "SHORTLIST_SENT"].includes(app.status)) {
    await updateApplicationStatus(applicationId, "INTERVIEWING", "System: Interview scheduled")
  }
  
  if (app) {
    await createNotification({
      userId: app.applicantProfile.userId,
      type: "INTERVIEW_SCHEDULED",
      title: "Interview Scheduled",
      message: `An interview has been scheduled for ${app.opportunity.title} on ${new Date(data.scheduledAt).toLocaleDateString()}.`,
      linkUrl: `/applications/${applicationId}`,
      entityType: "Application",
      entityId: applicationId,
    })
  }

  revalidatePath(`/recruiter/applications/${applicationId}`)
  revalidatePath("/applications")
}

export async function addRecruiterNote(applicationId: string, content: string) {
  const userId = await requireRecruiter()

  await prisma.recruiterNote.create({
    data: {
      applicationId,
      authorId: userId,
      content,
    },
  })
  revalidatePath(`/recruiter/applications/${applicationId}`)
}
