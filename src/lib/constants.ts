export const USER_ROLES = {
  CANDIDATE: "CANDIDATE",
  RECRUITER: "RECRUITER",
  HOSPITAL_CONTACT: "HOSPITAL_CONTACT",
  ADMIN: "ADMIN",
} as const;

export const APPLICATION_STATUS = {
  DRAFT: "DRAFT",
  NEW: "NEW",
  SCREENING: "SCREENING",
  QUALIFIED: "QUALIFIED",
  NURTURE: "NURTURE",
  NEEDS_DOCUMENTS: "NEEDS_DOCUMENTS",
  SHORTLIST_SENT: "SHORTLIST_SENT",
  INTERVIEWING: "INTERVIEWING",
  OFFER_STAGE: "OFFER_STAGE",
  ONBOARDING: "ONBOARDING",
  HIRED: "HIRED",
  REJECTED: "REJECTED",
  ON_HOLD: "ON_HOLD",
} as const;

export const ROLE_STATUS = {
  INTAKE: "INTAKE",
  ACTIVE: "ACTIVE",
  SHORTLIST_SENT: "SHORTLIST_SENT",
  INTERVIEWING: "INTERVIEWING",
  OFFER_STAGE: "OFFER_STAGE",
  ONBOARDING: "ONBOARDING",
  FILLED: "FILLED",
  PAUSED: "PAUSED",
  CLOSED: "CLOSED",
} as const;

export const READINESS_LABEL = {
  READY_NOW: "READY_NOW",
  NEAR_READY: "NEAR_READY",
  FUTURE_PIPELINE: "FUTURE_PIPELINE",
  NOT_A_FIT: "NOT_A_FIT",
} as const;

export const GCC_COUNTRIES = {
  SAUDI_ARABIA: "Saudi Arabia",
  UAE: "United Arab Emirates",
  QATAR: "Qatar",
  BAHRAIN: "Bahrain",
  OMAN: "Oman",
  KUWAIT: "Kuwait",
} as const;

export const LICENSING_AUTHORITIES = {
  SCFHS: "SCFHS (Saudi Arabia)",
  DHA: "DHA (Dubai)",
  DOH: "DOH (Abu Dhabi)",
  MOH_UAE: "MOH (UAE)",
  DHP: "DHP (Qatar)",
  NHRA: "NHRA (Bahrain)",
  OMSB: "OMSB (Oman)",
  KUWAIT_MOH: "Kuwait MOH",
} as const;

export const DOCUMENT_CATEGORIES = {
  CV: "CV",
  PASSPORT: "Passport",
  MEDICAL_DEGREE: "Medical Degree",
  INTERNSHIP_CERT: "Internship Certificate",
  RESIDENCY_CERT: "Residency Certificate",
  FELLOWSHIP_CERT: "Fellowship Certificate",
  MEDICAL_LICENSE: "Medical License",
  BOARD_CERTIFICATION: "Board Certification",
  GOOD_STANDING: "Good Standing Certificate",
  EXPERIENCE_CERT: "Experience Certificate",
  DATAFLOW_REPORT: "DataFlow Report",
} as const;
