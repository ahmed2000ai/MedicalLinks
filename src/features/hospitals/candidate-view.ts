"use server"

import { PrismaClient, ProfileVisibility } from "@prisma/client"

const prisma = new PrismaClient()

/**
 * Fetches a candidate's profile and securely applies privacy rules.
 * This should be used by all Hospital-facing UI when displaying candidate data.
 */
export async function getHospitalSafeDoctorPreview(profileId: string) {
  const profile = await prisma.applicantProfile.findUnique({
    where: { id: profileId },
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
      certifications: true,
      documents: {
        select: {
          id: true,
          type: true,
          title: true,
          isVerified: true,
          uploadedAt: true,
          issuingAuthority: true,
        }
      },
      languages: true,
      clinicalProcedures: true,
      trainingCourses: true,
      publications: {
        orderBy: { year: "desc" }
      },
      presentations: {
        orderBy: { year: "desc" }
      },
      teachingRoles: true,
      qiProjects: {
        orderBy: { year: "desc" }
      },
      leadershipRoles: true,
      awards: {
        orderBy: { year: "desc" }
      },
      memberships: true,
      // Intentionally omitting 'referees' as they are strictly private
    }
  })

  if (!profile) throw new Error("Candidate not found")

  const prefs = profile.preferences
  
  // Rule 1: If HIDDEN, completely block access
  if (prefs?.visibility === "HIDDEN") {
    throw new Error("This candidate profile is not discoverable.")
  }

  // Deep clone to safely mutate
  const safeProfile = JSON.parse(JSON.stringify(profile))

  // Rule 2: ANONYMOUS visibility masking
  if (prefs?.visibility === "ANONYMOUS") {
    safeProfile.user.firstName = "Confidential"
    safeProfile.user.lastName = "Candidate"
    
    // In anonymous mode, contact details are implicitly hidden regardless of the toggle
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
    
    // Also mask the most recent work experience if it's marked as current
    if (safeProfile.workExperiences && safeProfile.workExperiences.length > 0) {
      safeProfile.workExperiences.forEach((exp: any) => {
        if (exp.isCurrent) {
          exp.hospitalName = "Confidential Employer"
        }
      })
    }
  }

  return safeProfile
}
