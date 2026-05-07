"use server"

import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { PrivacySettingsSchema, PrivacySettingsInput } from "./privacy-types"

const prisma = new PrismaClient()

async function getAuthorizedProfileId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    const newProfile = await prisma.applicantProfile.create({
      data: { userId: session.user.id },
    })
    return newProfile.id
  }

  return profile.id
}

export type { PrivacySettingsInput }

export async function getApplicantPrivacySettings() {
  const profileId = await getAuthorizedProfileId()
  
  const preference = await prisma.applicantPreference.findUnique({
    where: { applicantProfileId: profileId },
    select: {
      visibility: true,
      openToOpportunities: true,
      hideContactDetails: true,
      hideCurrentEmployer: true,
    }
  })
  
  if (!preference) {
    // If preference doesn't exist, it will be created with defaults on first update
    return {
      visibility: "VISIBLE",
      openToOpportunities: "ACTIVE",
      hideContactDetails: true,
      hideCurrentEmployer: true,
    }
  }
  
  return preference
}

export async function updateApplicantPrivacySettings(data: PrivacySettingsInput) {
  const profileId = await getAuthorizedProfileId()
  const parsed = PrivacySettingsSchema.parse(data)
  
  await prisma.applicantPreference.upsert({
    where: { applicantProfileId: profileId },
    update: {
      visibility: parsed.visibility,
      openToOpportunities: parsed.openToOpportunities,
      hideContactDetails: parsed.hideContactDetails,
      hideCurrentEmployer: parsed.hideCurrentEmployer,
    },
    create: {
      applicantProfileId: profileId,
      visibility: parsed.visibility,
      openToOpportunities: parsed.openToOpportunities,
      hideContactDetails: parsed.hideContactDetails,
      hideCurrentEmployer: parsed.hideCurrentEmployer,
    }
  })
  
  revalidatePath("/settings")
  revalidatePath("/dashboard")
  return { success: true }
}
