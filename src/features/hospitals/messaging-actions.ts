"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

async function getHospitalUser() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "HOSPITAL_CONTACT") {
    throw new Error("Unauthorized")
  }

  const contact = await prisma.hospitalContact.findUnique({
    where: { userId: session.user.id },
    include: { hospital: true }
  })

  if (!contact || contact.hospital.status !== "ACTIVE") {
    throw new Error("Hospital account is not active")
  }

  return { userId: session.user.id, contact }
}

/**
 * Ensures a conversation exists between the current hospital user and the specified applicant.
 * Returns the conversation ID for navigation.
 */
export async function getOrStartConversationWithDoctor(applicantProfileId: string): Promise<string> {
  const hospital = await getHospitalUser()

  const applicant = await prisma.applicantProfile.findUnique({
    where: { id: applicantProfileId },
    select: { userId: true, preferences: true }
  })

  if (!applicant) {
    throw new Error("Applicant not found")
  }

  // Find if a conversation already exists between these two users
  const existingConversations = await prisma.conversation.findMany({
    where: {
      AND: [
        { participants: { some: { userId: hospital.userId } } },
        { participants: { some: { userId: applicant.userId } } }
      ]
    },
    orderBy: { updatedAt: "desc" },
    take: 1
  })

  if (existingConversations.length > 0) {
    return existingConversations[0].id
  }

  // Create a new conversation if it doesn't exist
  // We can set a generic subject, or leave it null
  const subject = `Message from ${hospital.contact.hospital.name}`

  const newConv = await prisma.conversation.create({
    data: {
      subject,
      participants: {
        create: [
          { userId: hospital.userId, hasUnread: false },
          { userId: applicant.userId, hasUnread: true }
        ]
      },
      messages: {
        create: {
          senderId: hospital.userId,
          content: `Hello, ${hospital.contact.hospital.name} would like to connect with you.`
        }
      }
    }
  })

  // We should create a notification for the applicant
  await prisma.notification.create({
    data: {
      userId: applicant.userId,
      type: "MESSAGE_RECEIVED",
      title: "New Message",
      message: `You received a new message from ${hospital.contact.hospital.name}`,
      linkUrl: `/messages/${newConv.id}`,
      entityType: "Conversation",
      entityId: newConv.id
    }
  })

  return newConv.id
}
