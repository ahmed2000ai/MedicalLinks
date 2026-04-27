import { MatchResult, MatchBand, MatchReason } from "./types"

/**
 * Calculates a match score between an applicant profile and an opportunity.
 * Deterministic rules-based scoring (0-100).
 */
export function calculateMatchScore(applicant: any, opportunity: any): MatchResult {
  let score = 0
  const reasons: MatchReason[] = []
  const breakdown = { specialty: 0, experience: 0, licensing: 0, location: 0, relocation: 0 }

  // 1. Specialty Fit (Max 40 points)
  const oppSpec = opportunity.specialty?.toLowerCase() || ""
  const oppSub = opportunity.subspecialty?.toLowerCase() || ""
  
  let specialtyScore = 0
  
  // Collect applicant specialties from residency, board certs, current title, and professional summary
  const applicantSpecs = [
    ...(applicant.residencyTrainings?.map((r: any) => r.specialty) || []),
    ...(applicant.boardCertifications?.map((b: any) => b.specialty) || []),
    ...(applicant.fellowshipTrainings?.map((f: any) => f.subspecialty) || []),
    applicant.currentJobTitle || "",
  ].map(s => s?.toLowerCase()).filter(Boolean)

  const hasSpecialtyMatch = oppSpec && applicantSpecs.some(s => s.includes(oppSpec) || oppSpec.includes(s))
  const hasSubspecialtyMatch = oppSub && applicantSpecs.some(s => s.includes(oppSub) || oppSub.includes(s))

  if (hasSubspecialtyMatch && oppSub) {
    specialtyScore = 40
    reasons.push({ type: "POSITIVE", description: `Subspecialty matches: ${opportunity.subspecialty}` })
  } else if (hasSpecialtyMatch) {
    specialtyScore = oppSub ? 25 : 40
    if (oppSub) {
      reasons.push({ type: "NEUTRAL", description: `Specialty matches (${opportunity.specialty}), but missing subspecialty` })
    } else {
      reasons.push({ type: "POSITIVE", description: `Direct specialty match: ${opportunity.specialty}` })
    }
  } else {
    specialtyScore = 0
    reasons.push({ type: "NEGATIVE", description: `Specialty mismatch (Requires ${opportunity.specialty})` })
  }
  
  score += specialtyScore
  breakdown.specialty = specialtyScore

  // 2. Experience Fit (Max 25 points)
  let expScore = 0
  const reqTotalExp = opportunity.minYearsExperience || 0
  const reqPostExp = opportunity.minYearsPostSpecialty || 0
  const appTotalExp = applicant.totalYearsExperience || 0
  const appPostExp = applicant.postSpecialtyExp || 0

  if (appPostExp >= reqPostExp && reqPostExp > 0) {
    expScore += 15
    reasons.push({ type: "POSITIVE", description: `Meets post-specialty experience requirement (${reqPostExp}+ years)` })
  } else if (reqPostExp > 0) {
    reasons.push({ type: "NEGATIVE", description: `Short on post-specialty experience (Has ${appPostExp}, needs ${reqPostExp})` })
  } else {
    expScore += 15 // Free points if no requirement
  }

  if (appTotalExp >= reqTotalExp && reqTotalExp > 0) {
    expScore += 10
    reasons.push({ type: "POSITIVE", description: `Meets total experience requirement (${reqTotalExp}+ years)` })
  } else if (reqTotalExp > 0) {
    reasons.push({ type: "NEGATIVE", description: `Short on total experience (Has ${appTotalExp}, needs ${reqTotalExp})` })
  } else {
    expScore += 10 // Free points if no requirement
  }

  score += expScore
  breakdown.experience = expScore

  // 3. Licensing / Credential Fit (Max 15 points)
  let licScore = 0
  
  // Board Cert Check
  const hasBoardCert = applicant.boardCertifications?.length > 0
  if (opportunity.boardCertRequired) {
    if (hasBoardCert) {
      licScore += 10
      reasons.push({ type: "POSITIVE", description: "Board certification documented" })
    } else {
      reasons.push({ type: "NEGATIVE", description: "Missing required board certification" })
    }
  } else {
    licScore += 10 // Free points
  }

  // Licensing check
  const targetAuthority = opportunity.licensingRequirement?.toLowerCase() || ""
  if (targetAuthority) {
    const licenses = applicant.medicalLicenses?.map((l: any) => l.issuingAuthority?.toLowerCase()) || []
    const hasLicenseMatch = licenses.some((l: string) => targetAuthority.includes(l) || l.includes(targetAuthority))
    
    if (hasLicenseMatch) {
      licScore += 5
      reasons.push({ type: "POSITIVE", description: `Holds relevant license (${opportunity.licensingRequirement})` })
    } else {
      reasons.push({ type: "NEUTRAL", description: `May need to acquire ${opportunity.licensingRequirement} license` })
    }
  } else {
    licScore += 5
  }

  score += licScore
  breakdown.licensing = licScore

  // 4. Location Fit (Max 10 points)
  let locScore = 0
  const oppCountry = opportunity.country?.toLowerCase()
  const preferredCountries = applicant.preferences?.preferredCountries?.map((c: string) => c.toLowerCase()) || []
  
  if (preferredCountries.includes(oppCountry) || preferredCountries.length === 0) {
    locScore = 10
    if (preferredCountries.length > 0) {
      reasons.push({ type: "POSITIVE", description: `Matches preferred location (${opportunity.country})` })
    }
  } else {
    locScore = 0
    reasons.push({ type: "NEUTRAL", description: `Outside preferred countries` })
  }
  
  score += locScore
  breakdown.location = locScore

  // 5. Relocation / Visa Fit (Max 10 points)
  let reloScore = 0
  const needsVisa = applicant.preferences?.visaSponsorshipReq ?? false
  const providesVisa = opportunity.visaSponsorship ?? true
  const willingToRelocate = applicant.preferences?.relocationWilling ?? true

  if (needsVisa && !providesVisa) {
    reasons.push({ type: "NEGATIVE", description: "Visa sponsorship required but not provided" })
  } else {
    reloScore += 5
  }

  if (!willingToRelocate && oppCountry !== applicant.countryOfResidence?.toLowerCase()) {
    reasons.push({ type: "NEGATIVE", description: "Not willing to relocate internationally" })
  } else {
    reloScore += 5
  }

  score += reloScore
  breakdown.relocation = reloScore

  // Clamp and Determine Band
  score = Math.max(0, Math.min(100, Math.round(score)))
  
  let band: MatchBand = "LOW"
  if (score >= 85) band = "STRONG"
  else if (score >= 70) band = "GOOD"
  else if (score >= 50) band = "PARTIAL"

  return { score, band, reasons, breakdown }
}
