import { ApplicationStatus, InterviewType } from "@prisma/client"

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  DRAFT: "Draft",
  NEW: "Applied",
  SCREENING: "Recruiter Review",
  QUALIFIED: "Qualified",
  NURTURE: "Pipeline",
  NEEDS_DOCUMENTS: "Needs Documents",
  SHORTLIST_SENT: "Submitted to Hospital",
  INTERVIEWING: "Interview Scheduled",
  OFFER_STAGE: "Offer Stage",
  ONBOARDING: "Onboarding",
  HIRED: "Hired",
  REJECTED: "Not Selected",
  WITHDRAWN: "Withdrawn",
  ON_HOLD: "On Hold",
  ARCHIVED: "Archived",
}

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, { text: string; bg: string }> = {
  DRAFT:           { text: "text-gray-500",    bg: "bg-gray-100 border-gray-200" },
  NEW:             { text: "text-blue-700",    bg: "bg-blue-50 border-blue-200" },
  SCREENING:       { text: "text-indigo-700",  bg: "bg-indigo-50 border-indigo-200" },
  QUALIFIED:       { text: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  NURTURE:         { text: "text-purple-700",  bg: "bg-purple-50 border-purple-200" },
  NEEDS_DOCUMENTS: { text: "text-amber-700",   bg: "bg-amber-50 border-amber-200" },
  SHORTLIST_SENT:  { text: "text-orange-700",  bg: "bg-orange-50 border-orange-200" },
  INTERVIEWING:    { text: "text-cyan-700",    bg: "bg-cyan-50 border-cyan-200" },
  OFFER_STAGE:     { text: "text-teal-700",    bg: "bg-teal-50 border-teal-200" },
  ONBOARDING:      { text: "text-green-700",   bg: "bg-green-50 border-green-200" },
  HIRED:           { text: "text-green-800",   bg: "bg-green-100 border-green-300" },
  REJECTED:        { text: "text-red-700",     bg: "bg-red-50 border-red-200" },
  WITHDRAWN:       { text: "text-gray-600",    bg: "bg-gray-100 border-gray-200" },
  ON_HOLD:         { text: "text-yellow-700",  bg: "bg-yellow-50 border-yellow-200" },
  ARCHIVED:        { text: "text-gray-500",    bg: "bg-gray-100 border-gray-200" },
}

export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  VIRTUAL: "Virtual / Video",
  IN_PERSON: "In Person",
}
