import { z } from "zod"

// Helper: treats empty / whitespace strings as null before date coercion
// This prevents the "expected date, received Date" Zod error when a date
// input is disabled or cleared (HTML inputs always submit empty strings).
const coerceDateOrNull = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? null : val),
  z.coerce.date().optional().nullable()
)

// Helper: treats empty / whitespace strings as null for enum fields.
// Prevents Prisma rejecting "" for Gender/MaritalStatus/etc. enum columns.
const coerceEnumOrNull = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? null : val),
  z.string().optional().nullable()
)

// Helper: treats NaN (from valueAsNumber on empty <input type="number">) and
// empty strings as null so z.number().optional().nullable() passes cleanly.
const coerceNumberOrNull = z.preprocess(
  (val) => {
    if (typeof val === "string" && val.trim() === "") return null
    if (typeof val === "number" && isNaN(val)) return null
    return val
  },
  z.number().min(0).optional().nullable()
)

// -----------------------------------------------------------------------------
// 1. Personal Details
// -----------------------------------------------------------------------------
// Helper: treats empty string as undefined so required date validation fails properly
const coerceDateRequired = z.preprocess(
  (val) => {
    if (typeof val === "string" && val.trim() === "") return undefined
    if (typeof val === "string" || typeof val === "number") return new Date(val)
    return val
  },
  z.date({ error: "Valid date is required" })
)

export const PersonalDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: coerceDateRequired,
  gender: z.string().min(1, "Gender is required"),
  nationality: z.string().min(1, "Nationality is required"),
  countryOfResidence: z.string().min(1, "Country of residence is required"),
  city: z.string().min(1, "City is required"),
  phone: z.string().min(1, "Phone number is required"),
  maritalStatus: coerceEnumOrNull,
})

export type PersonalDetailsInput = z.infer<typeof PersonalDetailsSchema>

// -----------------------------------------------------------------------------
// 2. Professional Summary
// -----------------------------------------------------------------------------
export const ProfessionalSummarySchema = z.object({
  headline: z.string().optional().nullable(),
  careerObjective: z.string().optional().nullable(),
  specialty: z.string().optional().nullable(),
  subspecialty: z.string().optional().nullable(),
  totalYearsExperience: coerceNumberOrNull,
  postSpecialtyExperience: coerceNumberOrNull,
  professionalSummary: z.string().optional().nullable(),
  currentEmployer: z.string().optional().nullable(),
  currentRole: z.string().optional().nullable(),
  noticePeriod: z.string().optional().nullable(),
  earliestStartDate: coerceDateOrNull,
})

export type ProfessionalSummaryInput = z.infer<typeof ProfessionalSummarySchema>

// -----------------------------------------------------------------------------
// 3. Education
// -----------------------------------------------------------------------------
export const EducationEntrySchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1, "Degree is required"),
  qualificationType: z.string().optional().nullable(),
  field: z.string().optional().nullable(),
  institution: z.string().min(1, "Institution is required"),
  country: z.string().min(1, "Country is required"),
  graduationDate: coerceDateOrNull,
  distinction: z.string().optional().nullable(),
  specialty: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export const EducationListSchema = z.array(EducationEntrySchema)
export type EducationEntryInput = z.infer<typeof EducationEntrySchema>

// -----------------------------------------------------------------------------
// 4. Residency & Fellowship Training
// -----------------------------------------------------------------------------
export const TrainingEntrySchema = z.object({
  id: z.string().optional(),
  programName: z.string().min(1, "Program name is required"),
  institution: z.string().min(1, "Institution is required"),
  specialty: z.string().optional().nullable(),
  country: z.string().min(1, "Country is required"),
  startDate: coerceDateOrNull,
  endDate: coerceDateOrNull,
  type: z.string().optional().nullable(), // e.g., "Residency", "Fellowship"
  award: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export const TrainingListSchema = z.array(TrainingEntrySchema)
export type TrainingEntryInput = z.infer<typeof TrainingEntrySchema>

// -----------------------------------------------------------------------------
// 5. Work Experience
// -----------------------------------------------------------------------------
export const WorkExperienceEntrySchema = z.object({
  id: z.string().optional(),
  employer: z.string().min(1, "Employer is required"),
  title: z.string().min(1, "Job title is required"),
  department: z.string().optional().nullable(),
  specialty: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  startDate: coerceDateOrNull,
  endDate: coerceDateOrNull,
  isCurrent: z.boolean().default(false),
  summary: z.string().optional().nullable(),
  achievements: z.string().optional().nullable(),
  metrics: z.string().optional().nullable(),
  clinicalVolume: z.string().optional().nullable(),
})

export const WorkExperienceListSchema = z.array(WorkExperienceEntrySchema)
export type WorkExperienceEntryInput = z.infer<typeof WorkExperienceEntrySchema>

// -----------------------------------------------------------------------------
// 6. Licenses & Certifications
// -----------------------------------------------------------------------------
export const BoardCertificationEntrySchema = z.object({
  id: z.string().optional(),
  boardName: z.string().min(1, "Board name is required"),
  specialty: z.string().min(1, "Specialty is required"),
  country: z.string().min(1, "Country is required"),
  issueDate: coerceDateOrNull,
  expiryDate: coerceDateOrNull,
})

export const BoardCertificationListSchema = z.array(BoardCertificationEntrySchema)
export type BoardCertificationEntryInput = z.infer<typeof BoardCertificationEntrySchema>

export const LicenseEntrySchema = z.object({
  id: z.string().optional(),
  licenseName: z.string().min(1, "License name is required"),
  issuingAuthority: z.string().min(1, "Issuing authority is required"),
  country: z.string().min(1, "Country is required"),
  licenseNumber: z.string().optional().nullable(),
  issueDate: coerceDateOrNull,
  expiryDate: coerceDateOrNull,
  status: z.string().optional().nullable(),
})

export const LicenseListSchema = z.array(LicenseEntrySchema)
export type LicenseEntryInput = z.infer<typeof LicenseEntrySchema>

export const CertificationEntrySchema = z.object({
  id: z.string().optional(),
  certificationName: z.string().min(1, "Certification name is required"),
  issuingBody: z.string().min(1, "Issuing body is required"),
  issueDate: coerceDateOrNull,
  expiryDate: coerceDateOrNull,
})

export const CertificationListSchema = z.array(CertificationEntrySchema)
export type CertificationEntryInput = z.infer<typeof CertificationEntrySchema>

// -----------------------------------------------------------------------------
// 7. Languages
// -----------------------------------------------------------------------------
// Assuming enum LanguageProficiency { NATIVE, FLUENT, INTERMEDIATE, BASIC } in Prisma
export const LanguageEntrySchema = z.object({
  id: z.string().optional(),
  language: z.string().min(1, "Language is required"),
  proficiency: z.enum(["BASIC", "CONVERSATIONAL", "FLUENT", "NATIVE"]).default("CONVERSATIONAL"),
  spokenProficiency: z.string().optional().nullable(),
  writtenProficiency: z.string().optional().nullable(),
  readingProficiency: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export const LanguageListSchema = z.array(LanguageEntrySchema)
export type LanguageEntryInput = z.infer<typeof LanguageEntrySchema>

// -----------------------------------------------------------------------------
// 8. Preferences
// -----------------------------------------------------------------------------
const coerceStringToArray = z.preprocess(
  (val) => {
    if (Array.isArray(val)) return val
    if (typeof val === "string" && val.trim()) return val.split(",").map((s) => s.trim()).filter(Boolean)
    return []
  },
  z.array(z.string())
)

export const PreferencesSchema = z.object({
  preferredCountries: coerceStringToArray.optional().default([]),
  preferredCities: coerceStringToArray.optional().default([]),
  relocationWilling: z.boolean().optional().default(true),
  visaSponsorshipReq: z.boolean().optional().default(true),
  expectedSalaryMin: coerceNumberOrNull,
})

export type PreferencesInput = z.infer<typeof PreferencesSchema>
// -----------------------------------------------------------------------------
// 9. Clinical Procedures
// -----------------------------------------------------------------------------
export const ClinicalProcedureEntrySchema = z.object({
  id: z.string().optional(),
  procedureName: z.string().min(1, "Procedure name is required"),
  category: z.string().optional().nullable(),
  experienceLevel: z.string().optional().nullable(),
  volume: coerceNumberOrNull,
  notes: z.string().optional().nullable(),
})

export const ClinicalProcedureListSchema = z.array(ClinicalProcedureEntrySchema)
export type ClinicalProcedureEntryInput = z.infer<typeof ClinicalProcedureEntrySchema>

// -----------------------------------------------------------------------------
// 10. Training Courses & Workshops
// -----------------------------------------------------------------------------
export const TrainingCourseEntrySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  provider: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  startDate: coerceDateOrNull,
  endDate: coerceDateOrNull,
  certificateReceived: z.boolean().default(false),
  notes: z.string().optional().nullable(),
})

export const TrainingCourseListSchema = z.array(TrainingCourseEntrySchema)
export type TrainingCourseEntryInput = z.infer<typeof TrainingCourseEntrySchema>

// -----------------------------------------------------------------------------
// 11. Publications
// -----------------------------------------------------------------------------
export const PublicationEntrySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  authors: z.string().optional().nullable(),
  journal: z.string().optional().nullable(),
  year: coerceNumberOrNull,
  volume: z.string().optional().nullable(),
  doi: z.string().optional().nullable(),
  pmid: z.string().optional().nullable(),
  publicationType: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export const PublicationListSchema = z.array(PublicationEntrySchema)
export type PublicationEntryInput = z.infer<typeof PublicationEntrySchema>

// -----------------------------------------------------------------------------
// 12. Conference Presentations
// -----------------------------------------------------------------------------
export const ConferencePresentationEntrySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  conferenceName: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  year: coerceNumberOrNull,
  presentationType: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export const ConferencePresentationListSchema = z.array(ConferencePresentationEntrySchema)
export type ConferencePresentationEntryInput = z.infer<typeof ConferencePresentationEntrySchema>

// -----------------------------------------------------------------------------
// 13. Teaching Experience
// -----------------------------------------------------------------------------
export const TeachingExperienceEntrySchema = z.object({
  id: z.string().optional(),
  roleTitle: z.string().min(1, "Role is required"),
  audienceType: z.string().optional().nullable(),
  institution: z.string().optional().nullable(),
  subjectArea: z.string().optional().nullable(),
  format: z.string().optional().nullable(),
  startDate: coerceDateOrNull,
  endDate: coerceDateOrNull,
  notes: z.string().optional().nullable(),
})

export const TeachingExperienceListSchema = z.array(TeachingExperienceEntrySchema)
export type TeachingExperienceEntryInput = z.infer<typeof TeachingExperienceEntrySchema>

// -----------------------------------------------------------------------------
// 14. Quality Improvement & Audits
// -----------------------------------------------------------------------------
export const QualityImprovementEntrySchema = z.object({
  id: z.string().optional(),
  projectTitle: z.string().min(1, "Project title is required"),
  category: z.string().optional().nullable(),
  institution: z.string().optional().nullable(),
  year: coerceNumberOrNull,
  summary: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  outcome: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export const QualityImprovementListSchema = z.array(QualityImprovementEntrySchema)
export type QualityImprovementEntryInput = z.infer<typeof QualityImprovementEntrySchema>

// -----------------------------------------------------------------------------
// 15. Leadership & Committees
// -----------------------------------------------------------------------------
export const LeadershipRoleEntrySchema = z.object({
  id: z.string().optional(),
  roleTitle: z.string().min(1, "Role title is required"),
  organization: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  startDate: coerceDateOrNull,
  endDate: coerceDateOrNull,
  responsibilities: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export const LeadershipRoleListSchema = z.array(LeadershipRoleEntrySchema)
export type LeadershipRoleEntryInput = z.infer<typeof LeadershipRoleEntrySchema>

// -----------------------------------------------------------------------------
// 16. Awards
// -----------------------------------------------------------------------------
export const AwardEntrySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Award title is required"),
  awardingOrganization: z.string().optional().nullable(),
  year: coerceNumberOrNull,
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
})

export const AwardListSchema = z.array(AwardEntrySchema)
export type AwardEntryInput = z.infer<typeof AwardEntrySchema>

// -----------------------------------------------------------------------------
// 17. Professional Memberships
// -----------------------------------------------------------------------------
export const ProfessionalMembershipEntrySchema = z.object({
  id: z.string().optional(),
  organization: z.string().min(1, "Organization is required"),
  membershipType: z.string().optional().nullable(),
  membershipNumber: z.string().optional().nullable(),
  startDate: coerceDateOrNull,
  endDate: coerceDateOrNull,
  notes: z.string().optional().nullable(),
})

export const ProfessionalMembershipListSchema = z.array(ProfessionalMembershipEntrySchema)
export type ProfessionalMembershipEntryInput = z.infer<typeof ProfessionalMembershipEntrySchema>

// -----------------------------------------------------------------------------
// 18. Referees (Private)
// -----------------------------------------------------------------------------
export const RefereeEntrySchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1, "Name is required"),
  title: z.string().optional().nullable(),
  relationship: z.string().optional().nullable(),
  institution: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export const RefereeListSchema = z.array(RefereeEntrySchema)
export type RefereeEntryInput = z.infer<typeof RefereeEntrySchema>

// -----------------------------------------------------------------------------
// 19. Global Profile Builder Schema
// -----------------------------------------------------------------------------
export const ProfileBuilderSchema = z.object({
  personal: PersonalDetailsSchema,
  summary: ProfessionalSummarySchema,
  educations: EducationListSchema,
  trainings: TrainingListSchema,
  licenses: LicenseListSchema,
  boardCertifications: BoardCertificationListSchema,
  certifications: CertificationListSchema,
  work: WorkExperienceListSchema,
  clinicalProcedures: ClinicalProcedureListSchema,
  trainingCourses: TrainingCourseListSchema,
  publications: PublicationListSchema,
  presentations: ConferencePresentationListSchema,
  teachingRoles: TeachingExperienceListSchema,
  qiProjects: QualityImprovementListSchema,
  leadershipRoles: LeadershipRoleListSchema,
  awards: AwardListSchema,
  memberships: ProfessionalMembershipListSchema,
  referees: RefereeListSchema,
  languages: LanguageListSchema,
  preferences: PreferencesSchema,
})

export type ProfileBuilderInput = z.infer<typeof ProfileBuilderSchema>

