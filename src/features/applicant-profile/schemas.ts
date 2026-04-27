import { z } from "zod"

// -----------------------------------------------------------------------------
// 1. Personal Details
// -----------------------------------------------------------------------------
export const PersonalDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.coerce.date().optional().nullable(),
  gender: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  countryOfResidence: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  maritalStatus: z.string().optional().nullable(),
})

export type PersonalDetailsInput = z.infer<typeof PersonalDetailsSchema>

// -----------------------------------------------------------------------------
// 2. Professional Summary
// -----------------------------------------------------------------------------
export const ProfessionalSummarySchema = z.object({
  headline: z.string().optional().nullable(),
  specialty: z.string().optional().nullable(),
  subspecialty: z.string().optional().nullable(),
  totalYearsExperience: z.number().min(0).optional().nullable(),
  postSpecialtyExperience: z.number().min(0).optional().nullable(),
  professionalSummary: z.string().optional().nullable(),
  currentEmployer: z.string().optional().nullable(),
  currentRole: z.string().optional().nullable(),
  noticePeriod: z.string().optional().nullable(),
  earliestStartDate: z.coerce.date().optional().nullable(),
})

export type ProfessionalSummaryInput = z.infer<typeof ProfessionalSummarySchema>

// -----------------------------------------------------------------------------
// 3. Education
// -----------------------------------------------------------------------------
export const EducationEntrySchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  country: z.string().min(1, "Country is required"),
  graduationDate: z.coerce.date().optional().nullable(),
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
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  type: z.string().optional().nullable(), // e.g., "Residency", "Fellowship"
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
  country: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  isCurrent: z.boolean().default(false),
  summary: z.string().optional().nullable(),
})

export const WorkExperienceListSchema = z.array(WorkExperienceEntrySchema)
export type WorkExperienceEntryInput = z.infer<typeof WorkExperienceEntrySchema>

// -----------------------------------------------------------------------------
// 6. Licenses & Certifications
// -----------------------------------------------------------------------------
export const LicenseEntrySchema = z.object({
  id: z.string().optional(),
  licenseName: z.string().min(1, "License name is required"),
  issuingAuthority: z.string().min(1, "Issuing authority is required"),
  country: z.string().min(1, "Country is required"),
  licenseNumber: z.string().optional().nullable(),
  issueDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  status: z.string().optional().nullable(),
})

export const LicenseListSchema = z.array(LicenseEntrySchema)
export type LicenseEntryInput = z.infer<typeof LicenseEntrySchema>

export const CertificationEntrySchema = z.object({
  id: z.string().optional(),
  certificationName: z.string().min(1, "Certification name is required"),
  issuingBody: z.string().min(1, "Issuing body is required"),
  issueDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
})

export const CertificationListSchema = z.array(CertificationEntrySchema)
export type CertificationEntryInput = z.infer<typeof CertificationEntrySchema>

// -----------------------------------------------------------------------------
// 7. Languages
// -----------------------------------------------------------------------------
// Assuming enum LanguageProficiency { NATIVE, FLUENT, INTERMEDIATE, BASIC } in Prisma
export const LanguageEntrySchema = z.object({
  language: z.string().min(1, "Language is required"),
  proficiency: z.enum(["BASIC", "CONVERSATIONAL", "FLUENT", "NATIVE"]).default("CONVERSATIONAL"),
})

export const LanguageListSchema = z.array(LanguageEntrySchema)
export type LanguageEntryInput = z.infer<typeof LanguageEntrySchema>

// -----------------------------------------------------------------------------
// 8. Preferences
// -----------------------------------------------------------------------------
export const PreferencesSchema = z.object({
  preferredCountries: z.array(z.string()).optional().default([]),
  preferredCities: z.array(z.string()).optional().default([]),
  relocationWilling: z.boolean().optional().default(true),
  visaSponsorshipReq: z.boolean().optional().default(true),
  expectedSalaryMin: z.number().min(0).optional().nullable(),
  expectedSalaryMax: z.number().min(0).optional().nullable(),
})

export type PreferencesInput = z.infer<typeof PreferencesSchema>
