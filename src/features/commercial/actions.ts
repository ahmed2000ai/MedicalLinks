"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { CommercialRecordStatus } from "@prisma/client";

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  if ((session.user as any).role !== "ADMIN")
    throw new Error("Forbidden: Admins only");
  return session.user.id;
}

// ---------------------------------------------------------------------------
// Admin: Create commercial record from a confirmed placement
// ---------------------------------------------------------------------------

export async function createCommercialRecordFromPlacement(placementId: string) {
  try {
    const adminId = await requireAdmin();

    const placement = await prisma.placement.findUnique({
      where: { id: placementId },
      include: { commercialRecord: true },
    });

    if (!placement) return { success: false, error: "Placement not found" };
    if (placement.status !== "CONFIRMED") {
      return {
        success: false,
        error: "Placement must be CONFIRMED to create a commercial record",
      };
    }
    if (placement.commercialRecord) {
      return { success: false, error: "Commercial record already exists" };
    }

    const record = await prisma.commercialRecord.create({
      data: {
        placementId: placement.id,
        hospitalId: placement.hospitalId,
        applicantProfileId: placement.applicantProfileId,
        status: "DRAFT",
        monthlySalary: placement.monthlySalary,
        commissionRate: placement.commissionRate,
        feeAmount: placement.feeAmount,
        currency: placement.currency,
      },
    });

    return { success: true, recordId: record.id };
  } catch (error) {
    console.error("createCommercialRecordFromPlacement error", error);
    return { success: false, error: "Failed to create commercial record" };
  }
}

// ---------------------------------------------------------------------------
// Admin: List all commercial records
// ---------------------------------------------------------------------------

export async function listCommercialRecordsForAdmin(filters?: {
  status?: CommercialRecordStatus;
  hospitalId?: string;
}) {
  try {
    await requireAdmin();

    const records = await prisma.commercialRecord.findMany({
      where: {
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.hospitalId ? { hospitalId: filters.hospitalId } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        hospital: { select: { name: true } },
        applicantProfile: {
          include: {
            user: { select: { firstName: true, lastName: true } },
            preferences: { select: { visibility: true } },
          },
        },
        placement: { select: { hireDate: true, jobTitle: true } },
      },
    });

    // High-level metrics
    const totalOutstanding = records
      .filter((r) => ["ISSUED", "OVERDUE"].includes(r.status))
      .reduce((sum, r) => sum + r.feeAmount, 0);

    const totalPaid = records
      .filter((r) => r.status === "PAID")
      .reduce((sum, r) => sum + r.feeAmount, 0);

    return { success: true, records, totalOutstanding, totalPaid };
  } catch (error) {
    console.error("listCommercialRecordsForAdmin error", error);
    return {
      success: false,
      records: [],
      totalOutstanding: 0,
      totalPaid: 0,
      error: "Failed to load commercial records",
    };
  }
}

// ---------------------------------------------------------------------------
// Admin: Get commercial record detail
// ---------------------------------------------------------------------------

export async function getCommercialRecordById(recordId: string) {
  try {
    await requireAdmin();

    const record = await prisma.commercialRecord.findUnique({
      where: { id: recordId },
      include: {
        hospital: { select: { id: true, name: true, city: true, country: true } },
        applicantProfile: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            preferences: { select: { visibility: true } },
          },
        },
        placement: {
          select: {
            id: true,
            jobTitle: true,
            hireDate: true,
            createdAt: true,
            confirmedAt: true,
            source: true,
            notes: true,
          },
        },
      },
    });

    if (!record) return { success: false, error: "Record not found" };
    return { success: true, record };
  } catch (error) {
    return { success: false, error: "Failed to load record" };
  }
}

// ---------------------------------------------------------------------------
// Admin: Update commercial record status and dates
// ---------------------------------------------------------------------------

export async function updateCommercialRecordStatus(
  recordId: string,
  data: {
    status?: CommercialRecordStatus;
    issueDate?: string | null;
    dueDate?: string | null;
    paymentDate?: string | null;
    notes?: string;
  }
) {
  try {
    await requireAdmin();

    const record = await prisma.commercialRecord.findUnique({
      where: { id: recordId },
    });
    if (!record) return { success: false, error: "Record not found" };

    const updateData: any = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;

    // Date parsing
    if (data.issueDate !== undefined) {
      updateData.issueDate = data.issueDate ? new Date(data.issueDate) : null;
    }
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    if (data.paymentDate !== undefined) {
      updateData.paymentDate = data.paymentDate
        ? new Date(data.paymentDate)
        : null;
    }

    await prisma.commercialRecord.update({
      where: { id: recordId },
      data: updateData,
    });

    revalidatePath("/admin/commercial");
    revalidatePath(`/admin/commercial/${recordId}`);
    return { success: true };
  } catch (error) {
    console.error("updateCommercialRecordStatus error", error);
    return { success: false, error: "Failed to update record" };
  }
}
