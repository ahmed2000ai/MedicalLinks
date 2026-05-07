"use server"

import { auth } from "@/auth"
import { PrismaClient, ShortlistStage } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

async function getHospitalId(): Promise<string> {
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
 * Fetches all candidates in the hospital's shortlist pipeline,
 * applying the same privacy masking as the doctor profile view.
 */
export async function getHospitalShortlist() {
  const hospitalId = await getHospitalId()

  const savedCandidates = await prisma.savedCandidate.findMany({
    where: { hospitalId },
    orderBy: { updatedAt: "desc" },
    include: {
      applicantProfile: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            }
          },
          preferences: true,
          workExperiences: {
            orderBy: { startDate: "desc" }
          },
          educations: {
            orderBy: { graduationDate: "desc" }
          },
          medicalLicenses: true,
          boardCertifications: true,
          languages: true,
        }
      }
    }
  })

  // Apply privacy masking to each profile
  const safeShortlist = savedCandidates
    .filter((sc) => {
      // Rule 1: If HIDDEN, completely hide from shortlist
      // (Even if previously saved, they vanish until visible again)
      return sc.applicantProfile.preferences?.visibility !== "HIDDEN"
    })
    .map((sc) => {
      // Deep clone to safely mutate
      const safeProfile = JSON.parse(JSON.stringify(sc.applicantProfile))
      const prefs = safeProfile.preferences

      // Rule 2: ANONYMOUS visibility masking
      if (prefs?.visibility === "ANONYMOUS") {
        safeProfile.user.firstName = "Confidential"
        safeProfile.user.lastName = "Candidate"
        safeProfile.user.email = null
        safeProfile.user.phone = null
      }

      // Rule 3: Contact Privacy masking
      if (prefs?.hideContactDetails) {
        safeProfile.user.email = null
        safeProfile.user.phone = null
      }

      // Rule 4: Employer Privacy masking
      if (prefs?.hideCurrentEmployer) {
        safeProfile.currentEmployer = null
        if (safeProfile.workExperiences && safeProfile.workExperiences.length > 0) {
          safeProfile.workExperiences.forEach((exp: any) => {
            if (exp.isCurrent) {
              exp.hospitalName = "Confidential Employer"
            }
          })
        }
      }

      return {
        ...sc,
        applicantProfile: safeProfile
      }
    })

  return safeShortlist
}

/**
 * Update a candidate's pipeline stage.
 */
export async function moveCandidateStage(
  applicantProfileId: string,
  newStage: ShortlistStage
) {
  const hospitalId = await getHospitalId()

  await prisma.savedCandidate.update({
    where: {
      hospitalId_applicantProfileId: { hospitalId, applicantProfileId }
    },
    data: { stage: newStage }
  })

  revalidatePath("/hospitals/shortlist")
}

/**
 * Update internal hospital notes for a shortlisted candidate.
 */
export async function updateCandidateNotes(
  applicantProfileId: string,
  notes: string | null
) {
  const hospitalId = await getHospitalId()

  await prisma.savedCandidate.update({
    where: {
      hospitalId_applicantProfileId: { hospitalId, applicantProfileId }
    },
    data: { notes }
  })

  revalidatePath("/hospitals/shortlist")
}

/**
 * Completely remove a candidate from the shortlist (un-save).
 */
export async function removeCandidateFromShortlist(applicantProfileId: string) {
  const hospitalId = await getHospitalId()

  await prisma.savedCandidate.delete({
    where: {
      hospitalId_applicantProfileId: { hospitalId, applicantProfileId }
    }
  })

  revalidatePath("/hospitals/shortlist")
  revalidatePath("/hospitals/search")
  revalidatePath(`/hospitals/candidates/${applicantProfileId}`)
}
