import { ProfileBuilderInput } from "@/features/applicant-profile/schemas"

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

// Shared canonical extraction result type.
// Both Gemini and Mistral normalizers must produce this shape.
export type CvExtractionResult = DeepPartial<ProfileBuilderInput>

// -----------------------------------------------------------------------------
// Validation — checks that a parsed result is "usable" (not effectively empty)
// -----------------------------------------------------------------------------
export function isUsableExtractionResult(result: unknown): result is CvExtractionResult {
  if (!result || typeof result !== "object") return false

  const r = result as CvExtractionResult

  // Must have at least one of: personal info, specialty, work experience, or education
  const hasPersonal = !!(
    r.personal?.firstName ||
    r.personal?.lastName ||
    r.personal?.phone
  )
  const hasSpecialty = !!r.summary?.specialty
  const hasWork = Array.isArray(r.work) && r.work.length > 0
  const hasEducation = Array.isArray(r.educations) && r.educations.length > 0
  const hasSummary = !!r.summary?.professionalSummary

  return hasPersonal || hasSpecialty || hasWork || hasEducation || hasSummary
}

// Strip markdown fences and trim — handles both providers
export function cleanJsonString(raw: string): string {
  return raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim()
}

// The extraction prompt used by both providers
export const CV_EXTRACTION_PROMPT = `
You are an expert medical CV parser. Extract structured data from the following doctor/physician CV text.

Return ONLY a valid JSON object with this exact structure (omit fields you cannot confidently extract, returning empty arrays for missing lists):

{
  "personal": {
    "firstName": "string",
    "lastName": "string",
    "dateOfBirth": "YYYY-MM-DD",
    "gender": "MALE, FEMALE, or PREFER_NOT_TO_SAY",
    "nationality": "string",
    "countryOfResidence": "string",
    "city": "string",
    "phone": "string",
    "maritalStatus": "SINGLE, MARRIED, DIVORCED, or WIDOWED"
  },
  "summary": {
    "headline": "string",
    "careerObjective": "string",
    "specialty": "string",
    "subspecialty": "string",
    "totalYearsExperience": number,
    "postSpecialtyExperience": number,
    "professionalSummary": "string",
    "currentEmployer": "string",
    "currentRole": "string",
    "noticePeriod": "string",
    "earliestStartDate": "YYYY-MM-DD"
  },
  "educations": [
    {
      "degree": "string (e.g. MBBS, MD, MRCP)",
      "institution": "string (university or college name)",
      "country": "string",
      "graduationDate": "YYYY-MM-DD",
      "notes": "string"
    }
  ],
  "trainings": [
    {
      "type": "RESIDENCY or FELLOWSHIP",
      "programName": "string",
      "institution": "string (hospital or medical center)",
      "specialty": "string",
      "country": "string",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "notes": "string"
    }
  ],
  "licenses": [
    {
      "licenseName": "string",
      "issuingAuthority": "string (e.g. GMC, DHA, MOH, SCFHS)",
      "country": "string",
      "issueDate": "YYYY-MM-DD",
      "expiryDate": "YYYY-MM-DD",
      "status": "Active, Expired, or In Progress",
      "notes": "string"
    }
  ],
  "boardCertifications": [
    {
      "boardName": "string (e.g. American Board, Arab Board, MRCP)",
      "specialty": "string",
      "country": "string",
      "issueDate": "YYYY-MM-DD",
      "expiryDate": "YYYY-MM-DD",
      "notes": "string"
    }
  ],
  "certifications": [
    {
      "certificationName": "string (e.g. BLS, ACLS, ATLS)",
      "issuingBody": "string",
      "issueDate": "YYYY-MM-DD",
      "expiryDate": "YYYY-MM-DD",
      "hasValidBlsAcls": boolean,
      "notes": "string"
    }
  ],
  "work": [
    {
      "employer": "string (hospital, clinic, or institution name)",
      "title": "string (job role or title)",
      "department": "string",
      "country": "string",
      "city": "string",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "isCurrent": boolean,
      "summary": "string"
    }
  ],
  "clinicalProcedures": [
    {
      "procedureName": "string",
      "experienceLevel": "string",
      "volume": number,
      "lastPerformedDate": "YYYY-MM-DD",
      "notes": "string"
    }
  ],
  "trainingCourses": [
    {
      "title": "string",
      "provider": "string",
      "location": "string",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "certificateReceived": boolean,
      "notes": "string"
    }
  ],
  "publications": [
    {
      "title": "string",
      "authors": "string",
      "journal": "string",
      "year": number,
      "doi": "string",
      "url": "string",
      "notes": "string"
    }
  ],
  "presentations": [
    {
      "title": "string",
      "conferenceName": "string",
      "year": number,
      "location": "string",
      "url": "string",
      "notes": "string"
    }
  ],
  "teachingRoles": [
    {
      "roleTitle": "string",
      "institution": "string",
      "audienceType": "string",
      "notes": "string"
    }
  ],
  "qiProjects": [
    {
      "projectTitle": "string",
      "institution": "string",
      "year": number,
      "outcome": "string",
      "notes": "string"
    }
  ],
  "leadershipRoles": [
    {
      "roleTitle": "string",
      "organization": "string",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "notes": "string"
    }
  ],
  "awards": [
    {
      "title": "string",
      "awardingOrganization": "string",
      "year": number,
      "description": "string",
      "category": "string"
    }
  ],
  "memberships": [
    {
      "organization": "string",
      "membershipType": "string",
      "membershipNumber": "string",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "notes": "string"
    }
  ],
  "referees": [
    {
      "fullName": "string",
      "title": "string",
      "relationship": "string",
      "institution": "string",
      "email": "string",
      "phone": "string",
      "notes": "string"
    }
  ],
  "languages": [
    {
      "language": "string",
      "proficiency": "NATIVE, FLUENT, INTERMEDIATE, or BEGINNER"
    }
  ],
  "preferences": {
    "preferredCountries": ["string"],
    "preferredCities": ["string"],
    "relocationWilling": boolean,
    "visaSponsorshipReq": boolean,
    "expectedSalaryMin": number,
    "expectedSalaryMax": number
  }
}

Rules:
- Return ONLY the JSON object — no explanation, no markdown, no code fences
- If a field is not present or unclear, omit it entirely or use null
- For optional arrays (publications, procedures, etc.), return [] if not found — do NOT hallucinate entries
- Dates should be ISO format (YYYY-MM-DD) where possible, or just YYYY-01-01 if only the year is available
- Infer totalYearsExperience from work history if not explicitly stated
`
