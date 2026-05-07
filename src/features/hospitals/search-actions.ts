"use server"

import { PrismaClient } from "@prisma/client"
import { getHospitalSafeDoctorPreview } from "./candidate-view"

const prisma = new PrismaClient()

export interface CandidateDirectoryFilterParams {
  keyword?: string
  country?: string
  minExperience?: number
  readiness?: import("@prisma/client").ReadinessLabel
  openToOpportunities?: import("@prisma/client").OpenToOpportunities
  relocation?: boolean
}

/**
 * Fetches the baseline candidate directory for hospitals.
 * This does not yet include keyword search or complex filtering.
 * It enforces privacy by filtering out HIDDEN candidates and applying the
 * safe data masker to every returned record.
 */
export async function getHospitalCandidateDirectory(params: CandidateDirectoryFilterParams = {}) {
  const { keyword, country, minExperience, readiness, openToOpportunities, relocation } = params

  // Construct the search filter if a keyword is provided
  const searchFilter = keyword ? {
    OR: [
      { professionalSummary: { contains: keyword, mode: 'insensitive' } },
      { currentJobTitle: { contains: keyword, mode: 'insensitive' } },
      { currentCity: { contains: keyword, mode: 'insensitive' } },
      { countryOfResidence: { contains: keyword, mode: 'insensitive' } },
      { internalNotes: { contains: keyword, mode: 'insensitive' } },
      {
        languages: { some: { language: { contains: keyword, mode: 'insensitive' } } }
      },
      {
        workExperiences: { some: { title: { contains: keyword, mode: 'insensitive' } } }
      },
      {
        educations: { some: { degree: { contains: keyword, mode: 'insensitive' } } }
      },
      // Privacy Rule: Name search ONLY if visible
      {
        AND: [
          { preferences: { visibility: "VISIBLE" } },
          {
            user: {
              OR: [
                { firstName: { contains: keyword, mode: 'insensitive' } },
                { lastName: { contains: keyword, mode: 'insensitive' } }
              ]
            }
          }
        ]
      },
      // Privacy Rule: Employer search ONLY if not hidden
      {
        AND: [
          { preferences: { hideCurrentEmployer: false } },
          {
            OR: [
              { currentEmployer: { contains: keyword, mode: 'insensitive' } },
              { workExperiences: { some: { hospitalName: { contains: keyword, mode: 'insensitive' } } } }
            ]
          }
        ]
      }
    ]
  } : {}

  const structuredFilters: any[] = []

  if (country) {
    structuredFilters.push({ countryOfResidence: country })
  }
  
  if (minExperience !== undefined && !isNaN(minExperience)) {
    structuredFilters.push({ totalYearsExperience: { gte: minExperience } })
  }

  if (readiness) {
    structuredFilters.push({ readinessLabel: readiness })
  }

  if (openToOpportunities) {
    structuredFilters.push({ preferences: { openToOpportunities } })
  }

  if (relocation === true) {
    structuredFilters.push({ preferences: { relocationWilling: true } })
  }

  // 1. Fetch discoverable profiles
  const profiles = await prisma.applicantProfile.findMany({
    where: {
      AND: [
        {
          preferences: {
            visibility: { in: ["VISIBLE", "ANONYMOUS"] },
          }
        },
        ...(keyword ? [searchFilter] : []),
        ...structuredFilters
      ]
    },
    take: 50, // Scaffold limit
    orderBy: { updatedAt: 'desc' }
  })

  if (profiles.length === 0) return []

  // 2. Map through the secure privacy masker
  // We use Promise.all to fetch the deep relations via the existing safe preview function
  const safeProfiles = await Promise.all(
    profiles.map((p) => getHospitalSafeDoctorPreview(p.id).catch(() => null))
  )

  // Filter out any that threw an error during masking (e.g., deleted mid-flight)
  return safeProfiles.filter(Boolean)
}
