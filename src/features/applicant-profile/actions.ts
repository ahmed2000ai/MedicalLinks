"use server"

import { auth } from "@/auth"
import { PrismaClient, Prisma, Gender } from "@prisma/client"
import { revalidatePath } from "next/cache"
import {
  PersonalDetailsSchema,
  PersonalDetailsInput,
  ProfessionalSummarySchema,
  ProfessionalSummaryInput,
  EducationListSchema,
  EducationEntryInput,
  TrainingListSchema,
  TrainingEntryInput,
  WorkExperienceListSchema,
  WorkExperienceEntryInput,
  LicenseListSchema,
  LicenseEntryInput,
  CertificationListSchema,
  CertificationEntryInput,
  LanguageListSchema,
  LanguageEntryInput,
  PreferencesSchema,
  PreferencesInput,
} from "./schemas"

const prisma = new PrismaClient()

// Helper to get authorized applicant profile
async function getAuthorizedProfileId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    // If no profile exists, create one
    const newProfile = await prisma.applicantProfile.create({
      data: { userId: session.user.id },
    })
    return newProfile.id
  }

  return profile.id
}

// -----------------------------------------------------------------------------
// Personal Details
// -----------------------------------------------------------------------------
export async function updatePersonalDetails(data: PersonalDetailsInput) {
  const profileId = await getAuthorizedProfileId()
  const parsed = PersonalDetailsSchema.parse(data)

  const session = await auth()
  if (session?.user?.id) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        phone: parsed.phone,
      },
    })
  }

  await prisma.applicantProfile.update({
    where: { id: profileId },
    data: {
      gender: parsed.gender as Gender | null,
      nationality: parsed.nationality,
      dateOfBirth: parsed.dateOfBirth,
      countryOfResidence: parsed.countryOfResidence,
      currentCity: parsed.city,
    },
  })

  revalidatePath("/profile")
  revalidatePath("/dashboard")
  return { success: true }
}

// -----------------------------------------------------------------------------
// Professional Summary
// -----------------------------------------------------------------------------
export async function updateProfessionalSummary(data: ProfessionalSummaryInput) {
  const profileId = await getAuthorizedProfileId()
  const parsed = ProfessionalSummarySchema.parse(data)

  await prisma.applicantProfile.update({
    where: { id: profileId },
    data: {
      professionalSummary: parsed.professionalSummary,
      totalYearsExperience: parsed.totalYearsExperience,
      postSpecialtyExp: parsed.postSpecialtyExperience,
      currentEmployer: parsed.currentEmployer,
      currentJobTitle: parsed.currentRole,
      noticePeriodDays: parsed.noticePeriod ? parseInt(parsed.noticePeriod, 10) || null : null,
    },
  })

  revalidatePath("/profile")
  revalidatePath("/dashboard")
  return { success: true }
}

// -----------------------------------------------------------------------------
// Education
// -----------------------------------------------------------------------------
export async function replaceEducationEntries(data: EducationEntryInput[]) {
  const profileId = await getAuthorizedProfileId()
  const parsed = EducationListSchema.parse(data)

  // Transaction to replace all
  await prisma.$transaction([
    prisma.education.deleteMany({ where: { applicantProfileId: profileId } }),
    prisma.education.createMany({
      data: parsed.map((e) => ({
        applicantProfileId: profileId,
        degree: e.degree,
        institution: e.institution,
        country: e.country,
        graduationDate: e.graduationDate,
        notes: e.notes,
      })),
    }),
  ])

  revalidatePath("/profile")
  return { success: true }
}

// -----------------------------------------------------------------------------
// Training (Residency & Fellowship)
// -----------------------------------------------------------------------------
export async function replaceTrainingEntries(data: TrainingEntryInput[]) {
  const profileId = await getAuthorizedProfileId()
  const parsed = TrainingListSchema.parse(data)

  const residencies = parsed.filter(t => t.type?.toLowerCase() === "residency" || !t.type)
  const fellowships = parsed.filter(t => t.type?.toLowerCase() === "fellowship")

  await prisma.$transaction([
    prisma.residencyTraining.deleteMany({ where: { applicantProfileId: profileId } }),
    prisma.fellowshipTraining.deleteMany({ where: { applicantProfileId: profileId } }),
    prisma.residencyTraining.createMany({
      data: residencies.map((t) => ({
        applicantProfileId: profileId,
        programName: t.programName,
        institution: t.institution,
        specialty: t.specialty || "General",
        country: t.country,
        startDate: t.startDate,
        endDate: t.endDate,
      })),
    }),
    prisma.fellowshipTraining.createMany({
      data: fellowships.map((t) => ({
        applicantProfileId: profileId,
        programName: t.programName,
        institution: t.institution,
        subspecialty: t.specialty || "General",
        country: t.country,
        startDate: t.startDate,
        endDate: t.endDate,
      })),
    }),
  ])

  revalidatePath("/profile")
  return { success: true }
}

// -----------------------------------------------------------------------------
// Work Experience
// -----------------------------------------------------------------------------
export async function replaceWorkExperience(data: WorkExperienceEntryInput[]) {
  const profileId = await getAuthorizedProfileId()
  const parsed = WorkExperienceListSchema.parse(data)

  await prisma.$transaction([
    prisma.workExperience.deleteMany({ where: { applicantProfileId: profileId } }),
    prisma.workExperience.createMany({
      data: parsed.map((w) => ({
        applicantProfileId: profileId,
        hospitalName: w.employer,
        title: w.title,
        department: w.department,
        country: w.country || "",
        city: w.city,
        startDate: w.startDate || new Date(),
        endDate: w.endDate,
        isCurrent: w.isCurrent,
        description: w.summary,
      })),
    }),
  ])

  revalidatePath("/profile")
  return { success: true }
}

// -----------------------------------------------------------------------------
// Licenses & Certifications
// -----------------------------------------------------------------------------
export async function replaceLicenses(data: LicenseEntryInput[]) {
  const profileId = await getAuthorizedProfileId()
  const parsed = LicenseListSchema.parse(data)

  await prisma.$transaction([
    prisma.medicalLicense.deleteMany({ where: { applicantProfileId: profileId } }),
    prisma.medicalLicense.createMany({
      data: parsed.map((l) => ({
        applicantProfileId: profileId,
        issuingAuthority: l.issuingAuthority,
        country: l.country,
        licenseNumber: l.licenseNumber,
        issueDate: l.issueDate,
        expiryDate: l.expiryDate,
        status: l.status,
      })),
    }),
  ])

  revalidatePath("/profile")
  return { success: true }
}

export async function replaceCertifications(data: CertificationEntryInput[]) {
  const profileId = await getAuthorizedProfileId()
  const parsed = CertificationListSchema.parse(data)

  await prisma.$transaction([
    prisma.professionalCertification.deleteMany({ where: { applicantProfileId: profileId } }),
    prisma.professionalCertification.createMany({
      data: parsed.map((c) => ({
        applicantProfileId: profileId,
        certificationName: c.certificationName,
        issuingBody: c.issuingBody,
        issueDate: c.issueDate,
        expiryDate: c.expiryDate,
      })),
    }),
  ])

  revalidatePath("/profile")
  return { success: true }
}

// -----------------------------------------------------------------------------
// Languages
// -----------------------------------------------------------------------------
export async function replaceLanguages(data: LanguageEntryInput[]) {
  const profileId = await getAuthorizedProfileId()
  const parsed = LanguageListSchema.parse(data)

  await prisma.$transaction([
    prisma.applicantLanguage.deleteMany({ where: { applicantProfileId: profileId } }),
    prisma.applicantLanguage.createMany({
      data: parsed.map((l) => ({
        applicantProfileId: profileId,
        language: l.language,
        proficiency: l.proficiency,
      })),
    }),
  ])

  revalidatePath("/profile")
  return { success: true }
}

// -----------------------------------------------------------------------------
// Preferences
// -----------------------------------------------------------------------------
export async function updatePreferences(data: PreferencesInput) {
  const profileId = await getAuthorizedProfileId()
  const parsed = PreferencesSchema.parse(data)

  await prisma.applicantPreference.upsert({
    where: { applicantProfileId: profileId },
    update: {
      preferredCountries: parsed.preferredCountries,
      preferredCities: parsed.preferredCities,
      relocationWilling: parsed.relocationWilling,
      visaSponsorshipReq: parsed.visaSponsorshipReq,
      expectedSalaryMin: parsed.expectedSalaryMin,
      expectedSalaryMax: parsed.expectedSalaryMax,
    },
    create: {
      applicantProfileId: profileId,
      preferredCountries: parsed.preferredCountries,
      preferredCities: parsed.preferredCities,
      relocationWilling: parsed.relocationWilling,
      visaSponsorshipReq: parsed.visaSponsorshipReq,
      expectedSalaryMin: parsed.expectedSalaryMin,
      expectedSalaryMax: parsed.expectedSalaryMax,
    },
  })

  revalidatePath("/profile")
  return { success: true }
}

// -----------------------------------------------------------------------------
// CV Extraction
// -----------------------------------------------------------------------------
export async function saveCvExtraction(data: any) {
  const profileId = await getAuthorizedProfileId()
  
  await prisma.applicantProfile.update({
    where: { id: profileId },
    data: {
      cvExtractionData: data
    }
  })
  
  revalidatePath("/profile")
  return { success: true }
}

export async function clearCvExtraction() {
  const profileId = await getAuthorizedProfileId()
  
  await prisma.applicantProfile.update({
    where: { id: profileId },
    data: {
      cvExtractionData: Prisma.JsonNull
    }
  })
  
  revalidatePath("/profile")
  return { success: true }
}
