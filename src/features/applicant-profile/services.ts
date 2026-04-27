import { PrismaClient, ApplicantProfile, Education, WorkExperience, MedicalLicense, ApplicantLanguage, ApplicantPreference } from "@prisma/client"

const prisma = new PrismaClient()

type ProfileWithRelations = ApplicantProfile & {
  educations: Education[]
  workExperiences: WorkExperience[]
  medicalLicenses: MedicalLicense[]
  languages: ApplicantLanguage[]
  preferences: ApplicantPreference | null
}

export function calculateProfileCompletion(profile: ProfileWithRelations): number {
  let score = 0
  const maxScore = 100

  // 1. Personal Details (20%)
  // Needs name (from User, but let's assume it's there), gender, nationality, dob, residence
  let personalScore = 0
  if (profile.gender) personalScore += 4
  if (profile.nationality) personalScore += 4
  if (profile.dateOfBirth) personalScore += 4
  if (profile.countryOfResidence) personalScore += 4
  if (profile.currentCity) personalScore += 4
  score += personalScore

  // 2. Professional Summary (20%)
  let summaryScore = 0
  if (profile.professionalSummary) summaryScore += 5
  if (profile.totalYearsExperience !== null) summaryScore += 5
  if (profile.currentEmployer) summaryScore += 5
  if (profile.currentJobTitle) summaryScore += 5
  score += summaryScore

  // 3. Education (15%)
  if (profile.educations && profile.educations.length > 0) {
    score += 15
  }

  // 4. Work Experience (15%)
  if (profile.workExperiences && profile.workExperiences.length > 0) {
    score += 15
  }

  // 5. Licenses (10%)
  if (profile.medicalLicenses && profile.medicalLicenses.length > 0) {
    score += 10
  }

  // 6. Languages (10%)
  if (profile.languages && profile.languages.length > 0) {
    score += 10
  }

  // 7. Preferences (10%)
  if (profile.preferences) {
    score += 10
  }

  // Ensure it doesn't exceed 100 somehow
  return Math.min(score, maxScore)
}

export async function getApplicantProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      applicantProfile: {
        include: {
          educations: true,
          residencyTrainings: true,
          fellowshipTrainings: true,
          workExperiences: { orderBy: { startDate: "desc" } },
          medicalLicenses: true,
          boardCertifications: true,
          certifications: true,
          languages: true,
          preferences: true,
        },
      },
    },
  })

  if (!user || !user.applicantProfile) return null

  const completionPct = calculateProfileCompletion(user.applicantProfile)

  return {
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    },
    profile: user.applicantProfile,
    completionPct,
  }
}
