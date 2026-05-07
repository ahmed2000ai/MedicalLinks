"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { InterviewInvitationStatus, InterviewType } from "@prisma/client";
import { createNotification } from "@/features/notifications/actions";

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

async function getAuthorizedHospitalContact() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const contact = await prisma.hospitalContact.findUnique({
    where: { userId: session.user.id },
    include: { hospital: true },
  });

  if (!contact || contact.hospital.status !== "ACTIVE") {
    throw new Error("Hospital account is not active");
  }

  return { session, contact, hospital: contact.hospital };
}

async function getAuthorizedDoctor() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  if (session.user.role !== "APPLICANT") throw new Error("Doctors only");

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) throw new Error("Doctor profile not found");

  return { session, profile };
}

// ---------------------------------------------------------------------------
// Hospital: Create interview invitation
// ---------------------------------------------------------------------------

export async function createInterviewInvitation(data: {
  applicantProfileId: string;
  title: string;
  scheduledAt: string; // ISO date string from form
  timezone: string;
  type: InterviewType;
  location?: string;
  meetingLink?: string;
  notes?: string;
  opportunityId?: string;
}) {
  try {
    const { contact, hospital } = await getAuthorizedHospitalContact();

    // Validate that the doctor profile exists and is discoverable
    const doctor = await prisma.applicantProfile.findUnique({
      where: { id: data.applicantProfileId },
      include: { user: true, preferences: true },
    });
    if (!doctor) return { success: false, error: "Doctor profile not found" };

    const scheduledAt = new Date(data.scheduledAt);
    if (isNaN(scheduledAt.getTime())) {
      return { success: false, error: "Invalid date/time" };
    }
    if (scheduledAt < new Date()) {
      return { success: false, error: "Interview date must be in the future" };
    }

    const invitation = await prisma.interviewInvitation.create({
      data: {
        hospitalId: hospital.id,
        initiatedByUserId: contact.userId,
        applicantProfileId: data.applicantProfileId,
        opportunityId: data.opportunityId || null,
        title: data.title,
        scheduledAt,
        timezone: data.timezone || "GST",
        type: data.type,
        location: data.location || null,
        meetingLink: data.meetingLink || null,
        notes: data.notes || null,
        status: "INVITED",
      },
    });

    // Auto-advance shortlist stage to INTERVIEW_INVITED
    await prisma.savedCandidate.updateMany({
      where: {
        hospitalId: hospital.id,
        applicantProfileId: data.applicantProfileId,
        stage: { in: ["SAVED", "REVIEWING"] },
      },
      data: { stage: "INTERVIEW_INVITED" },
    });

    // Notify the doctor
    await createNotification({
      userId: doctor.userId,
      type: "INTERVIEW_INVITED",
      title: "Interview Invitation",
      message: `${hospital.name} has invited you to interview: ${data.title}`,
      linkUrl: `/interviews`,
      entityType: "InterviewInvitation",
      entityId: invitation.id,
    });

    revalidatePath("/hospitals/interviews");
    revalidatePath("/hospitals/shortlist");
    return { success: true, invitationId: invitation.id };
  } catch (error) {
    console.error("createInterviewInvitation error", error);
    return { success: false, error: "Failed to create interview invitation" };
  }
}

// ---------------------------------------------------------------------------
// Hospital: List invitations sent by this hospital
// ---------------------------------------------------------------------------

export async function listInvitationsForHospital() {
  try {
    const { hospital } = await getAuthorizedHospitalContact();

    const invitations = await prisma.interviewInvitation.findMany({
      where: { hospitalId: hospital.id },
      orderBy: { scheduledAt: "asc" },
      include: {
        applicantProfile: {
          include: {
            user: { select: { firstName: true, lastName: true } },
            preferences: { select: { visibility: true } },
          },
        },
        opportunity: { select: { title: true } },
        initiatedBy: { select: { firstName: true, lastName: true } },
      },
    });

    return { success: true, invitations };
  } catch (error) {
    console.error("listInvitationsForHospital error", error);
    return { success: false, invitations: [], error: "Failed to load invitations" };
  }
}

// ---------------------------------------------------------------------------
// Doctor: List invitations received
// ---------------------------------------------------------------------------

export async function listInvitationsForDoctor() {
  try {
    const { profile } = await getAuthorizedDoctor();

    const invitations = await prisma.interviewInvitation.findMany({
      where: { applicantProfileId: profile.id },
      orderBy: { scheduledAt: "asc" },
      include: {
        hospital: { select: { id: true, name: true, logoUrl: true } },
        opportunity: { select: { title: true, specialty: true } },
        initiatedBy: { select: { firstName: true, lastName: true } },
      },
    });

    return { success: true, invitations };
  } catch (error) {
    console.error("listInvitationsForDoctor error", error);
    return { success: false, invitations: [], error: "Failed to load invitations" };
  }
}

// ---------------------------------------------------------------------------
// Doctor: Respond to invitation
// ---------------------------------------------------------------------------

export async function respondToInvitation(
  invitationId: string,
  response: "ACCEPTED" | "DECLINED" | "RESCHEDULE_REQUESTED",
  responseNote?: string
) {
  try {
    const { profile, session } = await getAuthorizedDoctor();

    const invitation = await prisma.interviewInvitation.findUnique({
      where: { id: invitationId },
      include: {
        hospital: { select: { name: true } },
        initiatedBy: true,
      },
    });

    if (!invitation) return { success: false, error: "Invitation not found" };
    if (invitation.applicantProfileId !== profile.id) {
      return { success: false, error: "Not authorized to respond to this invitation" };
    }
    if (invitation.status === "CANCELLED") {
      return { success: false, error: "This invitation has been cancelled" };
    }
    if (!["INVITED", "RESCHEDULE_REQUESTED"].includes(invitation.status)) {
      return { success: false, error: "This invitation can no longer be responded to" };
    }

    await prisma.interviewInvitation.update({
      where: { id: invitationId },
      data: {
        status: response as InterviewInvitationStatus,
        doctorResponseNote: responseNote || null,
      },
    });

    // Notify the hospital contact
    const responseLabels: Record<string, string> = {
      ACCEPTED: "accepted",
      DECLINED: "declined",
      RESCHEDULE_REQUESTED: "requested a reschedule for",
    };
    const doctorName = `${session.user.name ?? "The doctor"}`;

    await createNotification({
      userId: invitation.initiatedByUserId,
      type: "INTERVIEW_RESPONSE",
      title: `Interview Response — ${invitation.title}`,
      message: `${doctorName} has ${responseLabels[response]} your interview invitation.`,
      linkUrl: `/hospitals/interviews`,
      entityType: "InterviewInvitation",
      entityId: invitationId,
    });

    // Auto-advance shortlist on acceptance
    if (response === "ACCEPTED") {
      await prisma.savedCandidate.updateMany({
        where: {
          hospitalId: invitation.hospitalId,
          applicantProfileId: invitation.applicantProfileId,
          stage: "INTERVIEW_INVITED",
        },
        data: { stage: "INTERVIEW_COMPLETED" },
      });
    }

    revalidatePath("/interviews");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("respondToInvitation error", error);
    return { success: false, error: "Failed to submit response" };
  }
}

// ---------------------------------------------------------------------------
// Hospital: Cancel invitation
// ---------------------------------------------------------------------------

export async function cancelInvitation(invitationId: string) {
  try {
    const { hospital } = await getAuthorizedHospitalContact();

    const invitation = await prisma.interviewInvitation.findUnique({
      where: { id: invitationId },
    });
    if (!invitation) return { success: false, error: "Not found" };
    if (invitation.hospitalId !== hospital.id) {
      return { success: false, error: "Not authorized" };
    }

    await prisma.interviewInvitation.update({
      where: { id: invitationId },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/hospitals/interviews");
    return { success: true };
  } catch (error) {
    console.error("cancelInvitation error", error);
    return { success: false, error: "Failed to cancel invitation" };
  }
}

// ---------------------------------------------------------------------------
// Hospital: Get active opportunities for the invite form dropdown
// ---------------------------------------------------------------------------

export async function getHospitalOpportunitiesForSelect() {
  try {
    const { hospital } = await getAuthorizedHospitalContact();

    const opportunities = await prisma.opportunity.findMany({
      where: { hospitalId: hospital.id, status: "ACTIVE" },
      select: { id: true, title: true, specialty: true },
      orderBy: { title: "asc" },
    });

    return { success: true, opportunities };
  } catch (error) {
    return { success: false, opportunities: [] };
  }
}
