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
  if (cvData.personal) {
    if (!merged.user.firstName || merged.user.firstName === "Doctor") {
      merged.user.firstName = cvData.personal.firstName || merged.user.firstName
    }
    if (!merged.user.lastName) merged.user.lastName = cvData.personal.lastName || ""
    if (!merged.user.phone) merged.user.phone = cvData.personal.phone || ""
    
    if (!merged.profile.nationality) merged.profile.nationality = cvData.personal.nationality || ""
    if (!merged.profile.countryOfResidence) merged.profile.countryOfResidence = cvData.personal.countryOfResidence || ""
    if (!merged.profile.currentCity) merged.profile.currentCity = cvData.personal.city || ""
  }

  // --- 2. Professional Summary ---
  if (!merged.profile.professionalSummary && cvData.summary?.professionalSummary) {
    merged.profile.professionalSummary = cvData.summary.professionalSummary
  }
  if (!merged.profile.totalYearsExperience && cvData.summary?.totalYearsExperience) {
    merged.profile.totalYearsExperience = cvData.summary.totalYearsExperience
  }

  // --- 3. Education ---
  if ((!merged.profile.educations || merged.profile.educations.length === 0) && cvData.educations && cvData.educations.length > 0) {
    merged.profile.educations = cvData.educations.map(ed => ({
      degree: ed?.degree || "",
      institution: ed?.institution || "",
      country: ed?.country || "",
      graduationDate: ed?.graduationDate ? `${String(ed.graduationDate).split("-")[0]}-01-01T00:00:00.000Z` : new Date().toISOString(),
      notes: ""
    }))
  }

  if ((!merged.profile.residencyTrainings || merged.profile.residencyTrainings.length === 0) && cvData.trainings && cvData.trainings.length > 0) {
    const residencies = cvData.trainings.filter(t => t?.type?.toUpperCase() === "RESIDENCY" || !t?.type)
    if (residencies.length > 0) {
      merged.profile.residencyTrainings = residencies.map(r => ({
        programName: r?.programName || "",
        institution: r?.institution || "",
        specialty: r?.specialty || "",
        country: r?.country || "",
        startDate: r?.startDate && String(r.startDate).includes("-") ? `${String(r.startDate)}T00:00:00.000Z` : undefined,
        endDate: r?.endDate && String(r.endDate).includes("-") ? `${String(r.endDate)}T00:00:00.000Z` : undefined,
      }))
    }
  }

  if ((!merged.profile.fellowshipTrainings || merged.profile.fellowshipTrainings.length === 0) && cvData.trainings && cvData.trainings.length > 0) {
    const fellowships = cvData.trainings.filter(t => t?.type?.toUpperCase() === "FELLOWSHIP")
    if (fellowships.length > 0) {
      merged.profile.fellowshipTrainings = fellowships.map(f => ({
        programName: f?.programName || "",
        institution: f?.institution || "",
        subspecialty: f?.specialty || "",
        country: f?.country || "",
        startDate: f?.startDate && String(f.startDate).includes("-") ? `${String(f.startDate)}T00:00:00.000Z` : undefined,
        endDate: f?.endDate && String(f.endDate).includes("-") ? `${String(f.endDate)}T00:00:00.000Z` : undefined,
      }))
    }
  }

  // --- 4. Work Experience ---
  if ((!merged.profile.workExperiences || merged.profile.workExperiences.length === 0) && cvData.work && cvData.work.length > 0) {
    merged.profile.workExperiences = cvData.work.map(wk => {
      const isCurrent = wk?.isCurrent || false
      return {
        employer: wk?.employer || "",
        title: wk?.title || "",
        department: wk?.department || cvData.summary?.specialty || "",
        country: wk?.country || "",
        city: wk?.city || "",
        startDate: wk?.startDate ? `${String(wk.startDate)}T00:00:00.000Z` : new Date().toISOString(),
        endDate: isCurrent ? null : (wk?.endDate ? `${String(wk.endDate)}T00:00:00.000Z` : null),
        isCurrent,
        summary: wk?.summary || ""
      }
    })
    
    if (!merged.profile.currentEmployer) merged.profile.currentEmployer = merged.profile.workExperiences[0]?.employer || ""
    if (!merged.profile.currentJobTitle) merged.profile.currentJobTitle = merged.profile.workExperiences[0]?.title || ""
  }

  // --- 5. Licenses ---
  if ((!merged.profile.medicalLicenses || merged.profile.medicalLicenses.length === 0) && cvData.licenses && cvData.licenses.length > 0) {
    merged.profile.medicalLicenses = cvData.licenses.map(lic => ({
      issuingAuthority: lic?.issuingAuthority || "",
      country: lic?.country || "",
      licenseNumber: "", 
      status: lic?.status === "ACTIVE" ? "ACTIVE" : "PENDING"
    }))
  }

  if ((!merged.profile.boardCertifications || merged.profile.boardCertifications.length === 0) && cvData.boardCertifications && cvData.boardCertifications.length > 0) {
    merged.profile.boardCertifications = cvData.boardCertifications.map(bc => ({
      boardName: bc?.boardName || "",
      specialty: bc?.specialty || "",
      country: bc?.country || "",
      issueDate: bc?.issueDate ? `${String(bc.issueDate).split("-")[0]}-01-01T00:00:00.000Z` : undefined,
    }))
  }

  if ((!merged.profile.certifications || merged.profile.certifications.length === 0) && cvData.certifications && cvData.certifications.length > 0) {
    merged.profile.certifications = cvData.certifications.map(c => ({
      certificationName: c?.certificationName || "",
      issuingBody: c?.issuingBody || "",
      issueDate: c?.issueDate ? `${String(c.issueDate).split("-")[0]}-01-01T00:00:00.000Z` : undefined,
    }))
  }

  // --- 6. Advanced Optional Sections ---
  if ((!merged.profile.clinicalProcedures || merged.profile.clinicalProcedures.length === 0) && cvData.clinicalProcedures && cvData.clinicalProcedures.length > 0) {
    merged.profile.clinicalProcedures = cvData.clinicalProcedures.map(p => ({
      procedureName: p?.procedureName || "",
      experienceLevel: p?.experienceLevel || "",
      volume: p?.volume || null,
      notes: ""
    }))
  }

  if ((!merged.profile.trainingCourses || merged.profile.trainingCourses.length === 0) && cvData.trainingCourses && cvData.trainingCourses.length > 0) {
    merged.profile.trainingCourses = cvData.trainingCourses.map(c => ({
      title: c?.title || "",
      provider: c?.provider || "",
      location: c?.location || "",
      startDate: c?.startDate ? `${String(c.startDate).split("-")[0]}-01-01T00:00:00.000Z` : undefined,
      certificateReceived: false,
      notes: ""
    }))
  }

  if ((!merged.profile.publications || merged.profile.publications.length === 0) && cvData.publications && cvData.publications.length > 0) {
    merged.profile.publications = cvData.publications.map(p => ({
      title: p?.title || "",
      authors: p?.authors || "",
      journal: p?.journal || "",
      year: p?.year ? p.year : null,
      doi: p?.doi || "",
      notes: ""
    }))
  }

  if ((!merged.profile.presentations || merged.profile.presentations.length === 0) && cvData.presentations && cvData.presentations.length > 0) {
    merged.profile.presentations = cvData.presentations.map(p => ({
      title: p?.title || "",
      conferenceName: p?.conferenceName || "",
      year: p?.year ? p.year : null,
      notes: ""
    }))
  }

  if ((!merged.profile.teachingRoles || merged.profile.teachingRoles.length === 0) && cvData.teachingRoles && cvData.teachingRoles.length > 0) {
    merged.profile.teachingRoles = cvData.teachingRoles.map(t => ({
      roleTitle: t?.roleTitle || "",
      institution: t?.institution || "",
      audienceType: t?.audienceType || "",
      notes: ""
    }))
  }

  if ((!merged.profile.qiProjects || merged.profile.qiProjects.length === 0) && cvData.qiProjects && cvData.qiProjects.length > 0) {
    merged.profile.qiProjects = cvData.qiProjects.map(q => ({
      projectTitle: q?.projectTitle || "",
      institution: q?.institution || "",
      year: q?.year ? q.year : null,
      outcome: q?.outcome || "",
      notes: ""
    }))
  }

  if ((!merged.profile.leadershipRoles || merged.profile.leadershipRoles.length === 0) && cvData.leadershipRoles && cvData.leadershipRoles.length > 0) {
    merged.profile.leadershipRoles = cvData.leadershipRoles.map(l => ({
      roleTitle: l?.roleTitle || "",
      organization: l?.organization || "",
      startDate: l?.startDate ? `${String(l.startDate).split("-")[0]}-01-01T00:00:00.000Z` : undefined,
      notes: ""
    }))
  }

  if ((!merged.profile.awards || merged.profile.awards.length === 0) && cvData.awards && cvData.awards.length > 0) {
    merged.profile.awards = cvData.awards.map(a => ({
      title: a?.title || "",
      awardingOrganization: a?.awardingOrganization || "",
      year: a?.year ? a.year : null,
      notes: ""
    }))
  }

  if ((!merged.profile.memberships || merged.profile.memberships.length === 0) && cvData.memberships && cvData.memberships.length > 0) {
    merged.profile.memberships = cvData.memberships.map(m => ({
      organization: m?.organization || "",
      membershipType: m?.membershipType || "",
      notes: ""
    }))
  }

  if ((!merged.profile.referees || merged.profile.referees.length === 0) && cvData.referees && cvData.referees.length > 0) {
    merged.profile.referees = cvData.referees.map(r => ({
      fullName: r?.fullName || "",
      title: r?.title || "",
      email: r?.email || "",
      phone: r?.phone || "",
      relationship: "",
      notes: ""
    }))
  }

  if ((!merged.profile.languages || merged.profile.languages.length === 0) && cvData.languages && cvData.languages.length > 0) {
    merged.profile.languages = cvData.languages.map(l => ({
      language: l?.language || "",
      proficiency: l?.proficiency || "BEGINNER"
    }))
  }

  // --- 7. Preferences ---
  if (cvData.preferences) {
    if (!merged.profile.preferences) merged.profile.preferences = {}
    
    if (cvData.preferences.preferredCountries && (!merged.profile.preferences.preferredCountries || merged.profile.preferences.preferredCountries.length === 0)) {
      merged.profile.preferences.preferredCountries = cvData.preferences.preferredCountries
    }
    if (cvData.preferences.relocationWilling !== undefined && merged.profile.preferences.relocationWilling === undefined) {
      merged.profile.preferences.relocationWilling = cvData.preferences.relocationWilling
    }
  }

  return merged
}
