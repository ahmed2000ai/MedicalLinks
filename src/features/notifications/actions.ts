"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message?: string;
  linkUrl?: string;
  entityType?: string;
  entityId?: string;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        linkUrl: data.linkUrl,
        entityType: data.entityType,
        entityId: data.entityId,
      },
    });
    
    // We don't revalidate here typically because we want real-time or layout based polling,
    // but doing so for now to refresh server-rendered notification components.
    revalidatePath("/", "layout");
    
    return { success: true, notification };
  } catch (error) {
    console.error("Failed to create notification", error);
    return { success: false, error: "Failed to create notification" };
  }
}

export async function getUserNotifications(userId: string, options?: { unreadOnly?: boolean; limit?: number }) {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(options?.unreadOnly ? { isRead: false } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: options?.limit ?? 50,
    });
    
    return notifications;
  } catch (error) {
    console.error("Failed to get notifications", error);
    return [];
  }
}

export async function getUnreadNotificationCount(userId: string) {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
    return count;
  } catch (error) {
    console.error("Failed to get unread notification count", error);
    return 0;
  }
}

export async function markNotificationRead(notificationId: string, userId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
    
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification read", error);
    return { success: false, error: "Failed to mark as read" };
  }
}

export async function markAllNotificationsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark all notifications read", error);
    return { success: false, error: "Failed to mark all as read" };
  }
}
