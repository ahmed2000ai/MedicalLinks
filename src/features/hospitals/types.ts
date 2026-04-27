import { OpportunityStatus, EmploymentType } from "@prisma/client"

// ─── Labels ───────────────────────────────────────────────────────────────────

export const OPPORTUNITY_STATUS_LABELS: Record<OpportunityStatus, string> = {
  INTAKE:  "Intake",
  ACTIVE:  "Published",
  PAUSED:  "Paused",
  CLOSED:  "Closed",
  FILLED:  "Filled",
}

export const OPPORTUNITY_STATUS_COLORS: Record<OpportunityStatus, { text: string; bg: string }> = {
  INTAKE:  { text: "text-yellow-700",  bg: "bg-yellow-50  border-yellow-200" },
  ACTIVE:  { text: "text-green-700",   bg: "bg-green-50   border-green-200"  },
  PAUSED:  { text: "text-orange-700",  bg: "bg-orange-50  border-orange-200" },
  CLOSED:  { text: "text-red-700",     bg: "bg-red-50     border-red-200"    },
  FILLED:  { text: "text-blue-700",    bg: "bg-blue-50    border-blue-200"   },
}

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full-Time",
  PART_TIME: "Part-Time",
  CONTRACT:  "Contract",
  LOCUM:     "Locum",
}

export const URGENCY_LABELS: Record<string, string> = {
  URGENT:   "Urgent",
  STANDARD: "Standard",
  PIPELINE: "Pipeline",
}

export const HOSPITAL_TYPES = [
  "Private Hospital",
  "Government Hospital",
  "Specialty Center",
  "University Hospital",
  "Clinic / Polyclinic",
  "Day Surgery Center",
  "Other",
]

export const GCC_COUNTRIES = [
  "Saudi Arabia",
  "United Arab Emirates",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
]

export const MEDICAL_SPECIALTIES = [
  "Anesthesiology",
  "Cardiology",
  "Cardiothoracic Surgery",
  "Dermatology",
  "Emergency Medicine",
  "Endocrinology",
  "Family Medicine",
  "Gastroenterology",
  "General Surgery",
  "Geriatrics",
  "Hematology",
  "Infectious Disease",
  "Internal Medicine",
  "Nephrology",
  "Neurology",
  "Neurosurgery",
  "Obstetrics & Gynecology",
  "Oncology",
  "Ophthalmology",
  "Orthopedic Surgery",
  "Otolaryngology (ENT)",
  "Pediatrics",
  "Pediatric Surgery",
  "Plastic Surgery",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Rheumatology",
  "Urology",
  "Vascular Surgery",
  "Other",
]

export const SENIORITY_LEVELS = [
  "Senior Registrar",
  "Specialist",
  "Senior Specialist",
  "Consultant",
  "Senior Consultant",
  "Head of Department",
]

export const DEFAULT_DEPARTMENTS = [
  "Internal Medicine",
  "Pediatrics",
  "Emergency Medicine",
  "Anesthesiology",
  "Family Medicine",
  "Radiology",
  "Surgery",
  "ICU / Critical Care",
  "Cardiology",
  "Oncology",
  "Obstetrics & Gynecology",
  "Orthopedics",
  "Neurology",
  "Psychiatry",
]

// ─── Derived types for list/detail views ─────────────────────────────────────

export interface HospitalListItem {
  id: string
  name: string
  type: string | null
  country: string | null
  city: string | null
  isActive: boolean
  opportunityCount: number
  departmentCount: number
  createdAt: Date
}

export interface OpportunityListItem {
  id: string
  title: string
  specialty: string
  seniority: string | null
  country: string
  city: string | null
  status: OpportunityStatus
  urgency: string | null
  hospitalName: string
  departmentName: string | null
  employmentType: EmploymentType
  applicationCount: number
  createdAt: Date
}
