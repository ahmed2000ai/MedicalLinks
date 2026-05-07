import { CvExtractionResult } from "./cv-extraction"

/**
 * Merges the extracted CV data into the existing profile initial data.
 * Safe overwrite rules: Only prefill if the existing database field is empty/null,
 * or if an array (like educations or workExperiences) is empty.
 */
export function mergeCvDataWithProfile(dbData: any): any {
  if (!dbData) return dbData
  
  const cvData: CvExtractionResult | null = dbData.profile?.cvExtractionData
  if (!cvData) return dbData

  // Create a deep copy to avoid mutating the original prop directly
  const merged = JSON.parse(JSON.stringify(dbData))

  // --- 1. Personal Details ---
  if (cvData.personalInfo) {
    if (!merged.user.firstName || merged.user.firstName === "Doctor") {
      merged.user.firstName = cvData.personalInfo.firstName || merged.user.firstName
    }
    if (!merged.user.lastName) merged.user.lastName = cvData.personalInfo.lastName || ""
    if (!merged.user.phone) merged.user.phone = cvData.personalInfo.phone || ""
    
    if (!merged.profile.nationality) merged.profile.nationality = cvData.personalInfo.nationality || ""
    if (!merged.profile.countryOfResidence) merged.profile.countryOfResidence = cvData.personalInfo.countryOfResidence || ""
    if (!merged.profile.currentCity) merged.profile.currentCity = cvData.personalInfo.city || ""
  }

  // --- 2. Professional Summary ---
  if (!merged.profile.professionalSummary && cvData.professionalSummary) {
    merged.profile.professionalSummary = cvData.professionalSummary
  }
  if (!merged.profile.totalYearsExperience && cvData.totalYearsExperience) {
    merged.profile.totalYearsExperience = cvData.totalYearsExperience
  }

  // --- 3. Education ---
  // If the DB has no educations, map the CV ones
  if ((!merged.profile.educations || merged.profile.educations.length === 0) && cvData.education && cvData.education.length > 0) {
    merged.profile.educations = cvData.education.map(ed => ({
      degree: ed.degree,
      institution: ed.institution,
      country: ed.country,
      graduationDate: ed.graduationYear ? `${ed.graduationYear}-01-01T00:00:00.000Z` : new Date().toISOString(),
      notes: ""
    }))
  }

  // --- 4. Work Experience ---
  if ((!merged.profile.workExperiences || merged.profile.workExperiences.length === 0) && cvData.workExperience && cvData.workExperience.length > 0) {
    merged.profile.workExperiences = cvData.workExperience.map(wk => {
      const isCurrent = wk.endDate === "Present"
      return {
        employer: wk.employer,
        title: wk.title,
        department: cvData.specialty || "", // fallback if department is missing
        country: wk.country,
        city: "", // CV might not have city per job
        startDate: wk.startDate ? `${wk.startDate}T00:00:00.000Z` : new Date().toISOString(),
        endDate: isCurrent ? null : (wk.endDate ? `${wk.endDate}T00:00:00.000Z` : null),
        isCurrent,
        summary: wk.summary
      }
    })
    
    // Also try to set current employer / title on the profile root if empty
    if (!merged.profile.currentEmployer) merged.profile.currentEmployer = merged.profile.workExperiences[0]?.employer || ""
    if (!merged.profile.currentJobTitle) merged.profile.currentJobTitle = merged.profile.workExperiences[0]?.title || ""
  }

  // --- 5. Licenses ---
  if ((!merged.profile.medicalLicenses || merged.profile.medicalLicenses.length === 0) && cvData.licenses && cvData.licenses.length > 0) {
    merged.profile.medicalLicenses = cvData.licenses.map(lic => ({
      issuingAuthority: lic.issuingAuthority,
      country: lic.country,
      licenseNumber: "", // Usually not parsed safely from CV, needs manual entry
      status: lic.status === "ACTIVE" ? "ACTIVE" : "PENDING"
    }))
  }

  return merged
}
