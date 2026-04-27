export type MatchBand = "STRONG" | "GOOD" | "PARTIAL" | "LOW"

export interface MatchReason {
  type: "POSITIVE" | "NEGATIVE" | "NEUTRAL"
  description: string
}

export interface MatchResult {
  score: number // 0 to 100
  band: MatchBand
  reasons: MatchReason[]
  breakdown: {
    specialty: number
    experience: number
    licensing: number
    location: number
    relocation: number
  }
}

export const MATCH_BAND_COLORS: Record<MatchBand, { text: string; bg: string; border: string }> = {
  STRONG:  { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  GOOD:    { text: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  PARTIAL: { text: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  LOW:     { text: "text-gray-600",    bg: "bg-gray-50",    border: "border-gray-200" },
}

export const MATCH_BAND_LABELS: Record<MatchBand, string> = {
  STRONG: "Strong Match",
  GOOD: "Good Match",
  PARTIAL: "Partial Match",
  LOW: "Low Match",
}
