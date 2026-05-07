"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createNotification } from "../notifications/actions";

export async function listConversations(userId: string) {
  try {
    const participants = await prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    applicantProfile: {
                      select: {
                        preferences: {
                          select: {
                            visibility: true,
                            hideContactDetails: true,
                          }
                        }
                      }
                    },
                    hospitalContact: {
                      select: {
                        hospital: {
                          select: {
                            name: true,
                          }
                        }
                      }
                    }
                  },
                },
              },
            },
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1, // Get the last message for preview
            },
            application: {
              select: {
                id: true,
                opportunity: {
                  select: { title: true },
                },
              },
            },
          },
        },
      },
      orderBy: {
        conversation: {
          updatedAt: "desc",
        },
      },
    });

    return participants.map((p) => ({
      id: p.conversation.id,
      subject: p.conversation.subject,
      hasUnread: p.hasUnread,
      lastMessage: p.conversation.messages[0],
      updatedAt: p.conversation.updatedAt,
      application: p.conversation.application,
      participants: p.conversation.participants
        .filter((part) => part.userId !== userId)
        .map((part) => part.user),
    }));
  } catch (error) {
    console.error("Failed to list conversations", error);
    return [];
  }
}

export async function getConversationDetails(conversationId: string, userId: string) {
  try {
    // Ensure the user is a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    if (!participant) {
      return { success: false, error: "Not authorized" };
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: {
            user: {
              select: { 
                id: true, 
                firstName: true, 
                lastName: true, 
                role: true,
                applicantProfile: {
                  select: { preferences: { select: { visibility: true, hideContactDetails: true } } }
                },
                hospitalContact: {
                  select: { hospital: { select: { name: true } } }
                }
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: { 
                id: true, 
                firstName: true, 
                lastName: true, 
                role: true,
                applicantProfile: {
                  select: { preferences: { select: { visibility: true, hideContactDetails: true } } }
                },
                hospitalContact: {
                  select: { hospital: { select: { name: true } } }
                }
              },
            },
          },
        },
        application: {
          select: {
            id: true,
            status: true,
            opportunity: { select: { title: true, hospital: { select: { name: true } } } },
          },
        },
      },
    });

    return { success: true, conversation };
  } catch (error) {
    console.error("Failed to get conversation details", error);
    return { success: false, error: "Failed to load conversation" };
  }
}

export async function sendMessage(conversationId: string, senderId: string, content: string) {
  try {
    // Validate content
    const trimmed = content.trim();
    if (!trimmed) return { success: false, error: "Message cannot be empty" };
    if (trimmed.length > 4000) return { success: false, error: "Message is too long (max 4000 characters)" };

    // Verify role — only doctors (APPLICANT) and hospital contacts (HOSPITAL_CONTACT) may send
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { role: true },
    });
    if (!sender || !["APPLICANT", "HOSPITAL_CONTACT"].includes(sender.role)) {
      return { success: false, error: "Your account type cannot send messages" };
    }

    // Ensure sender is a participant in this conversation
    const isParticipant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: senderId } },
    });

    if (!isParticipant) {
      return { success: false, error: "You are not a participant in this conversation" };
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
    });

    // Mark other participants as having unread
    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId: { not: senderId },
      },
      data: {
        hasUnread: true,
      },
    });

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Create notifications for other participants
    const otherParticipants = await prisma.conversationParticipant.findMany({
      where: { conversationId, userId: { not: senderId } },
      include: { user: true },
    });
    
    for (const p of otherParticipants) {
      await createNotification({
        userId: p.userId,
        type: "MESSAGE_RECEIVED",
        title: "New Message",
        message: `You received a new message regarding your conversation.`,
        linkUrl: `/messages/${conversationId}`,
        entityType: "Message",
        entityId: message.id,
      });
    }

    revalidatePath("/messages", "layout");
    revalidatePath(`/messages/${conversationId}`);

    return { success: true, message };
  } catch (error) {
    console.error("Failed to send message", error);
    return { success: false, error: "Failed to send message" };
  }
}

export async function startConversation(data: {
  senderId: string;
  participantIds: string[];
  subject?: string;
  applicationId?: string;
  opportunityId?: string;
  content: string;
}) {
  try {
    const allParticipantIds = Array.from(new Set([data.senderId, ...data.participantIds]));

    const conversation = await prisma.conversation.create({
      data: {
        subject: data.subject,
        applicationId: data.applicationId,
        opportunityId: data.opportunityId,
        participants: {
          create: allParticipantIds.map((id) => ({
            userId: id,
            hasUnread: id !== data.senderId, // Others have unread
          })),
        },
        messages: {
          create: {
            senderId: data.senderId,
            content: data.content,
          },
        },
      },
    });
    
    // Create notifications for other participants
    for (const participantId of data.participantIds) {
      if (participantId !== data.senderId) {
        await createNotification({
          userId: participantId,
          type: "MESSAGE_RECEIVED",
          title: "New Conversation",
          message: data.subject ? `New conversation started: ${data.subject}` : "You have been added to a new conversation.",
          linkUrl: `/messages/${conversation.id}`,
          entityType: "Conversation",
          entityId: conversation.id,
        });
      }
    }

    revalidatePath("/messages", "layout");

    return { success: true, conversationId: conversation.id };
  } catch (error) {
    console.error("Failed to start conversation", error);
    return { success: false, error: "Failed to start conversation" };
  }
}

export async function markConversationRead(conversationId: string, userId: string) {
  try {
    await prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: {
        hasUnread: false,
        lastReadAt: new Date(),
      },
    });

    revalidatePath("/messages", "layout");
    revalidatePath(`/messages/${conversationId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to mark conversation read", error);
    return { success: false, error: "Failed to mark as read" };
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  try {
    return await prisma.conversationParticipant.count({
      where: { userId, hasUnread: true },
    });
  } catch {
    return 0;
  }
}

