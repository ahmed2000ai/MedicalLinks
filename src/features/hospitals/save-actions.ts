"use server"

import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function getHospitalId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const contact = await prisma.hospitalContact.findUnique({
    where: { userId: session.user.id },
    include: { hospital: true }
  })

  if (!contact || contact.hospital.status !== "ACTIVE") {
    throw new Error("Hospital account is not active")
  }

  return contact.hospitalId
}

/**
 * Toggle save state for a candidate profile.
 * Returns the new saved state (true = now saved, false = now unsaved).
 */
export async function toggleSaveCandidate(
  applicantProfileId: string
): Promise<{ saved: boolean }> {
  const hospitalId = await getHospitalId()

  const existing = await prisma.savedCandidate.findUnique({
    where: {
      hospitalId_applicantProfileId: { hospitalId, applicantProfileId }
    }
  })

  if (existing) {
    await prisma.savedCandidate.delete({
      where: {
        hospitalId_applicantProfileId: { hospitalId, applicantProfileId }
      }
    })
    revalidatePath("/hospitals/search")
    revalidatePath(`/hospitals/candidates/${applicantProfileId}`)
    revalidatePath("/hospitals/shortlist")
    return { saved: false }
  }

  await prisma.savedCandidate.create({
    data: { hospitalId, applicantProfileId }
  })
  revalidatePath("/hospitals/search")
  revalidatePath(`/hospitals/candidates/${applicantProfileId}`)
  revalidatePath("/hospitals/shortlist")
  return { saved: true }
}

/**
 * Fetches the set of saved candidate profile IDs for the current hospital.
 * Used to hydrate the initial saved state on the search page.
 */
export async function getHospitalSavedCandidateIds(): Promise<Set<string>> {
  try {
    const hospitalId = await getHospitalId()
    const saved = await prisma.savedCandidate.findMany({
      where: { hospitalId },
      select: { applicantProfileId: true }
    })
    return new Set(saved.map((s) => s.applicantProfileId))
  } catch {
    return new Set()
  }
}
