import { DocumentType } from "@prisma/client"

// ─── Human-readable labels ────────────────────────────────────────────────────
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  CV:                  "CV / Resume",
  PASSPORT:            "Passport Copy",
  MEDICAL_DEGREE:      "Medical Degree",
  INTERNSHIP_CERT:     "Internship Certificate",
  RESIDENCY_CERT:      "Residency Certificate",
  FELLOWSHIP_CERT:     "Fellowship Certificate",
  MEDICAL_LICENSE:     "Medical License",
  BOARD_CERTIFICATION: "Board Certification",
  GOOD_STANDING_CERT:  "Good Standing Certificate",
  EXPERIENCE_CERT:     "Experience Certificate",
  LANGUAGE_CERT:       "Language Certificate",
  DATAFLOW_REPORT:     "DataFlow / PSV Report",
  OTHER:               "Other Supporting Document",
}

// ─── Category grouping ────────────────────────────────────────────────────────
export const DOCUMENT_CATEGORIES: { label: string; types: DocumentType[] }[] = [
  {
    label: "Identity & Travel",
    types: ["PASSPORT"],
  },
  {
    label: "Credentials & Qualifications",
    types: ["MEDICAL_DEGREE", "INTERNSHIP_CERT", "RESIDENCY_CERT", "FELLOWSHIP_CERT"],
  },
  {
    label: "Licensing & Certification",
    types: ["MEDICAL_LICENSE", "BOARD_CERTIFICATION", "GOOD_STANDING_CERT", "DATAFLOW_REPORT"],
  },
  {
    label: "Professional History",
    types: ["EXPERIENCE_CERT", "LANGUAGE_CERT", "CV"],
  },
  {
    label: "Other",
    types: ["OTHER"],
  },
]

// ─── Required documents for GCC readiness ────────────────────────────────────
export const REQUIRED_DOCUMENT_TYPES: DocumentType[] = [
  "CV",
  "PASSPORT",
  "MEDICAL_DEGREE",
  "MEDICAL_LICENSE",
  "GOOD_STANDING_CERT",
]

// ─── Document status model ────────────────────────────────────────────────────
export type DocumentStatus = "MISSING" | "UPLOADED" | "EXPIRING_SOON" | "EXPIRED" | "INCOMPLETE" | "READY"

export interface DocumentStatusInfo {
  status: DocumentStatus
  label: string
  color: string // Tailwind text color
  bg: string    // Tailwind bg color
}

export const DOCUMENT_STATUS_MAP: Record<DocumentStatus, DocumentStatusInfo> = {
  MISSING:       { status: "MISSING",       label: "Missing",       color: "text-red-600",    bg: "bg-red-50" },
  UPLOADED:      { status: "UPLOADED",      label: "Uploaded",      color: "text-blue-600",   bg: "bg-blue-50" },
  EXPIRING_SOON: { status: "EXPIRING_SOON", label: "Expiring Soon", color: "text-amber-600",  bg: "bg-amber-50" },
  EXPIRED:       { status: "EXPIRED",       label: "Expired",       color: "text-red-700",    bg: "bg-red-50" },
  INCOMPLETE:    { status: "INCOMPLETE",    label: "Incomplete",    color: "text-orange-600", bg: "bg-orange-50" },
  READY:         { status: "READY",         label: "Ready",         color: "text-green-700",  bg: "bg-green-50" },
}

// ─── Status calculation ───────────────────────────────────────────────────────
export function resolveDocumentStatus(doc: {
  fileUrl: string
  issueDate?: Date | null
  expiryDate?: Date | null
  issuingAuthority?: string | null
  title?: string | null
}): DocumentStatus {
  if (!doc.fileUrl) return "MISSING"

  const now = new Date()

  if (doc.expiryDate) {
    const exp = new Date(doc.expiryDate)
    if (exp < now) return "EXPIRED"
    const thirtyDays = 30 * 24 * 60 * 60 * 1000
    if (exp.getTime() - now.getTime() < thirtyDays * 3) return "EXPIRING_SOON" // 90 days
  }

  return "READY"
}

// ─── Credential readiness calculation ────────────────────────────────────────
export interface CredentialReadiness {
  uploadedCount: number
  requiredCount: number
  requiredUploaded: number
  missingRequired: DocumentType[]
  expiringDocs: string[]
  expiredDocs: string[]
  score: number // 0-100
}

export function calculateCredentialReadiness(
  documents: Array<{
    type: DocumentType
    fileUrl: string
    title?: string | null
    expiryDate?: Date | null
    issueDate?: Date | null
    issuingAuthority?: string | null
  }>
): CredentialReadiness {
  const now = new Date()
  const ninetyDays = 90 * 24 * 60 * 60 * 1000

  const uploadedTypes = new Set(documents.map(d => d.type))
  const missingRequired = REQUIRED_DOCUMENT_TYPES.filter(t => !uploadedTypes.has(t))
  const requiredUploaded = REQUIRED_DOCUMENT_TYPES.length - missingRequired.length

  const expiringDocs: string[] = []
  const expiredDocs: string[] = []

  for (const doc of documents) {
    if (!doc.expiryDate) continue
    const exp = new Date(doc.expiryDate)
    const label = doc.title || DOCUMENT_TYPE_LABELS[doc.type]
    if (exp < now) expiredDocs.push(label)
    else if (exp.getTime() - now.getTime() < ninetyDays) expiringDocs.push(label)
  }

  // Score: 60% from required docs coverage + 20% extra docs + 20% no expiry issues
  const requiredScore   = (requiredUploaded / REQUIRED_DOCUMENT_TYPES.length) * 60
  const extraDocScore   = Math.min((documents.length / 8) * 20, 20)
  const expiryPenalty   = (expiredDocs.length * 10) + (expiringDocs.length * 5)
  const expiryScore     = Math.max(0, 20 - expiryPenalty)
  const score           = Math.round(Math.min(100, requiredScore + extraDocScore + expiryScore))

  return {
    uploadedCount:    documents.length,
    requiredCount:    REQUIRED_DOCUMENT_TYPES.length,
    requiredUploaded,
    missingRequired,
    expiringDocs,
    expiredDocs,
    score,
  }
}

// ─── File storage helpers ─────────────────────────────────────────────────────
// Storage abstraction — uses local /public/uploads/ for development.
// Swap uploadFile() to call S3/GCS/Cloudflare R2 in production.

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export function buildLocalStoragePath(profileId: string, type: DocumentType, fileName: string): string {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
  return `/uploads/${profileId}/${type}/${Date.now()}_${safe}`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
