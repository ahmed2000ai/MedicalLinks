"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { PlacementStatus, PlacementSource } from "@prisma/client";
import { createCommercialRecordFromPlacement } from "@/features/commercial/actions";

// ---------------------------------------------------------------------------
// Fee calculation — single source of truth
// ---------------------------------------------------------------------------

export function calculatePlacementFee(
  monthlySalary: number,
  commissionRate: number
): number {
  return parseFloat((monthlySalary * (commissionRate / 100)).toFixed(2));
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  if ((session.user as any).role !== "ADMIN") throw new Error("Forbidden: Admins only");
  return session.user.id;
}

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

// ---------------------------------------------------------------------------
// Shared: get the commission rate for a hospital (from agreement or manual)
// ---------------------------------------------------------------------------

export async function getDefaultCommissionForHospital(
  hospitalId: string
): Promise<number | null> {
  const hospital = await prisma.hospitalOrganization.findUnique({
    where: { id: hospitalId },
    select: { commissionRate: true },
  });
  return hospital?.commissionRate ?? null;
}

// ---------------------------------------------------------------------------
// Hospital: Create / report a placement record
// ---------------------------------------------------------------------------

export async function createPlacementRecord(data: {
  applicantProfileId: string;
  jobTitle: string;
  hireDate: string;          // ISO date string
  monthlySalary: number;
  currency: string;
  commissionRate: number;
  source: PlacementSource;
  opportunityId?: string;
  interviewInvitationId?: string;
  notes?: string;
  submitNow?: boolean;       // true = REPORTED, false = DRAFT
}) {
  try {
    const { contact, hospital } = await getAuthorizedHospitalContact();

    // Validate doctor exists
    const doctor = await prisma.applicantProfile.findUnique({
      where: { id: data.applicantProfileId },
    });
    if (!doctor) return { success: false, error: "Doctor profile not found" };

    const hireDate = new Date(data.hireDate);
    if (isNaN(hireDate.getTime()))
      return { success: false, error: "Invalid hire date" };
    if (data.monthlySalary <= 0)
      return { success: false, error: "Monthly salary must be a positive amount" };
    if (data.commissionRate <= 0 || data.commissionRate > 100)
      return { success: false, error: "Commission rate must be between 0 and 100" };

    const feeAmount = calculatePlacementFee(data.monthlySalary, data.commissionRate);

    const placement = await prisma.placement.create({
      data: {
        applicantProfileId: data.applicantProfileId,
        hospitalId: hospital.id,
        recordedByUserId: contact.userId,
        opportunityId: data.opportunityId || null,
        interviewInvitationId: data.interviewInvitationId || null,
        source: data.source,
        hireDate,
        jobTitle: data.jobTitle,
        monthlySalary: data.monthlySalary,
        currency: data.currency || "USD",
        commissionRate: data.commissionRate,
        feeAmount,
        status: data.submitNow ? "REPORTED" : "DRAFT",
        notes: data.notes || null,
      },
    });

    // Auto-advance shortlist stage to HIRED
    await prisma.savedCandidate.updateMany({
      where: {
        hospitalId: hospital.id,
        applicantProfileId: data.applicantProfileId,
        stage: { notIn: ["HIRED", "REJECTED"] },
      },
      data: { stage: "HIRED" },
    });

    revalidatePath("/hospitals/placements");
    revalidatePath("/hospitals/shortlist");
    return { success: true, placementId: placement.id };
  } catch (error) {
    console.error("createPlacementRecord error", error);
    return { success: false, error: "Failed to create placement record" };
  }
}

// ---------------------------------------------------------------------------
// Hospital: Submit a DRAFT placement to REPORTED
// ---------------------------------------------------------------------------

export async function submitPlacementRecord(placementId: string) {
  try {
    const { hospital } = await getAuthorizedHospitalContact();

    const placement = await prisma.placement.findUnique({
      where: { id: placementId },
    });
    if (!placement) return { success: false, error: "Placement not found" };
    if (placement.hospitalId !== hospital.id)
      return { success: false, error: "Not authorized" };
    if (placement.status !== "DRAFT")
      return { success: false, error: "Only draft placements can be submitted" };

    await prisma.placement.update({
      where: { id: placementId },
      data: { status: "REPORTED" },
    });

    revalidatePath("/hospitals/placements");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to submit placement" };
  }
}

// ---------------------------------------------------------------------------
// Hospital: List placements for their hospital
// ---------------------------------------------------------------------------

export async function listPlacementsForHospital() {
  try {
    const { hospital } = await getAuthorizedHospitalContact();

    const placements = await prisma.placement.findMany({
      where: { hospitalId: hospital.id },
      orderBy: { hireDate: "desc" },
      include: {
        applicantProfile: {
          include: {
            user: { select: { firstName: true, lastName: true } },
            preferences: { select: { visibility: true } },
          },
        },
        opportunity: { select: { title: true } },
        interviewInvitation: { select: { title: true } },
      },
    });

    return { success: true, placements };
  } catch (error) {
    console.error("listPlacementsForHospital error", error);
    return { success: false, placements: [], error: "Failed to load placements" };
  }
}

// ---------------------------------------------------------------------------
// Admin: List all placements across all hospitals
// ---------------------------------------------------------------------------

export async function listPlacementsForAdmin(filters?: {
  status?: PlacementStatus;
  hospitalId?: string;
}) {
  try {
    await requireAdmin();

    const placements = await prisma.placement.findMany({
      where: {
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.hospitalId ? { hospitalId: filters.hospitalId } : {}),
      },
      orderBy: { hireDate: "desc" },
      include: {
        applicantProfile: {
          include: {
            user: { select: { firstName: true, lastName: true } },
            preferences: { select: { visibility: true } },
          },
        },
        hospital: { select: { id: true, name: true } },
        opportunity: { select: { title: true } },
        recordedBy: { select: { firstName: true, lastName: true } },
      },
    });

    // Aggregate fee summary
    const confirmedFees = placements
      .filter((p) => p.status === "CONFIRMED")
      .reduce((sum, p) => sum + p.feeAmount, 0);

    const pendingFees = placements
      .filter((p) => p.status === "REPORTED")
      .reduce((sum, p) => sum + p.feeAmount, 0);

    return { success: true, placements, confirmedFees, pendingFees };
  } catch (error) {
    console.error("listPlacementsForAdmin error", error);
    return { success: false, placements: [], confirmedFees: 0, pendingFees: 0 };
  }
}

// ---------------------------------------------------------------------------
// Admin: Update placement status (confirm, dispute, cancel)
// ---------------------------------------------------------------------------

export async function updatePlacementStatus(
  placementId: string,
  status: PlacementStatus,
  notes?: string
) {
  try {
    const adminId = await requireAdmin();

    const placement = await prisma.placement.findUnique({
      where: { id: placementId },
    });
    if (!placement) return { success: false, error: "Placement not found" };

    await prisma.placement.update({
      where: { id: placementId },
      data: {
        status,
        notes: notes !== undefined ? notes : placement.notes,
        ...(status === "CONFIRMED"
          ? { confirmedAt: new Date(), confirmedByUserId: adminId }
          : {}),
      },
    });

    if (status === "CONFIRMED" && placement.status !== "CONFIRMED") {
      await createCommercialRecordFromPlacement(placementId);
    }

    revalidatePath("/admin/placements");
    revalidatePath("/hospitals/placements");
    return { success: true };
  } catch (error) {
    console.error("updatePlacementStatus error", error);
    return { success: false, error: "Failed to update status" };
  }
}

// ---------------------------------------------------------------------------
// Admin: Get single placement detail
// ---------------------------------------------------------------------------

export async function getPlacementById(placementId: string) {
  try {
    await requireAdmin();

    const placement = await prisma.placement.findUnique({
      where: { id: placementId },
      include: {
        applicantProfile: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            preferences: { select: { visibility: true } },
            workExperiences: { where: { isCurrent: true }, take: 1 },
          },
        },
        hospital: {
          select: { id: true, name: true, commissionRate: true, country: true, city: true },
        },
        opportunity: { select: { title: true, specialty: true } },
        interviewInvitation: { select: { title: true, scheduledAt: true } },
        recordedBy: { select: { firstName: true, lastName: true } },
      },
    });

    if (!placement) return { success: false, error: "Placement not found" };
    return { success: true, placement };
  } catch (error) {
    return { success: false, error: "Failed to load placement" };
  }
}
