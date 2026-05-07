"use server"

import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function getAuthorizedHospital() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const contact = await prisma.hospitalContact.findUnique({
    where: { userId: session.user.id },
    include: { hospital: true }
  })

  // Relying on layout.tsx for primary gate, but double-checking here for safety
  if (!contact || contact.hospital.status !== "ACTIVE") {
    throw new Error("Hospital account is not active")
  }

  return { contact, hospital: contact.hospital }
}

export async function getHospitalDashboardSummary() {
  const { hospital } = await getAuthorizedHospital()

  // 1. Metric: Discoverable Doctors
  // Count applicants who are either VISIBLE or ANONYMOUS, and actively/selectively open.
  const discoverableDoctors = await prisma.applicantPreference.count({
    where: {
      visibility: { in: ["VISIBLE", "ANONYMOUS"] },
      openToOpportunities: { in: ["ACTIVE", "SELECTIVE"] }
    }
  })

  // 2. Metric: Active Opportunities
  const activeOpportunitiesCount = await prisma.opportunity.count({
    where: {
      hospitalId: hospital.id,
      status: "ACTIVE"
    }
  })

  // 3. Metric: Upcoming Interview Invitations (hospital-access model)
  const upcomingInvitations = await prisma.interviewInvitation.findMany({
    where: {
      hospitalId: hospital.id,
      status: { in: ["INVITED", "ACCEPTED", "CONFIRMED"] },
      scheduledAt: { gte: new Date() }
    },
    orderBy: { scheduledAt: "asc" },
    take: 5,
    include: {
      applicantProfile: {
        include: {
          user: { select: { firstName: true, lastName: true } },
          preferences: { select: { visibility: true } }
        }
      },
      opportunity: { select: { title: true } }
    }
  })

  // 4. Metric: Unread Messages
  // Count unread conversations where the current user is a participant
  const session = await auth()
  const unreadMessagesCount = await prisma.conversationParticipant.count({
    where: {
      userId: session!.user!.id,
      hasUnread: true
    }
  })

  // Recent Opportunities for list
  const recentOpportunities = await prisma.opportunity.findMany({
    where: { hospitalId: hospital.id },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: { department: true }
  })

  // Recent Activity (Alerts/Notifications)
  const recentActivity = await prisma.notification.findMany({
    where: { userId: session!.user!.id },
    orderBy: { createdAt: "desc" },
    take: 3
  })

  // 5. Saved candidates count
  const savedCandidatesCount = await prisma.savedCandidate.count({
    where: { hospitalId: hospital.id }
  })

  return {
    hospitalName: hospital.name,
    stats: {
      discoverableDoctors,
      activeOpportunitiesCount,
      upcomingInterviewsCount: upcomingInvitations.length,
      savedCandidatesCount,
      unreadMessagesCount
    },
    recentOpportunities,
    upcomingInterviews: upcomingInvitations,
    recentActivity
  }
}
