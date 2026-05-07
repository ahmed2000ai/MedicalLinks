"use server"

import { auth } from "@/auth"
import { GoogleGenerativeAI } from "@google/generative-ai"
import PDFParser from "pdf2json"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------
export interface CvExtractionResult {
  personalInfo?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    dateOfBirth?: string
    gender?: string
    nationality?: string
    city?: string
    countryOfResidence?: string
  }
  professionalSummary?: string
  specialty?: string
  subspecialty?: string
  totalYearsExperience?: number
  education?: Array<{
    degree: string
    institution: string
    country: string
    graduationYear: string
  }>
  workExperience?: Array<{
    title: string
    employer: string
    country: string
    startDate: string
    endDate: string | "Present"
    summary: string
  }>
  licenses?: Array<{
    issuingAuthority: string
    country: string
    status: string
  }>
}

// -----------------------------------------------------------------------------
// PROMPT
// -----------------------------------------------------------------------------
const SYSTEM_PROMPT = `
You are an expert medical CV parser. Extract structured data from the following doctor/physician CV text.

Return ONLY a valid JSON object with this exact structure (omit fields you cannot confidently extract):

{
  "personalInfo": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "dateOfBirth": "YYYY-MM-DD",
    "gender": "MALE, FEMALE, or PREFER_NOT_TO_SAY",
    "nationality": "string",
    "city": "string",
    "countryOfResidence": "string"
  },
  "professionalSummary": "string (2-4 concise sentences summarising the doctor's career)",
  "specialty": "string (primary medical specialty, e.g. Cardiology)",
  "subspecialty": "string (subspecialty if present)",
  "totalYearsExperience": number,
  "education": [
    {
      "degree": "string (e.g. MBBS, MD, MRCP)",
      "institution": "string",
      "country": "string",
      "graduationYear": "string (4-digit year)"
    }
  ],
  "workExperience": [
    {
      "title": "string (job title)",
      "employer": "string (hospital or institution name)",
      "country": "string",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD or Present",
      "summary": "string (brief description of role)"
    }
  ],
  "licenses": [
    {
      "issuingAuthority": "string (e.g. GMC, DHA, MOH, SCFHS)",
      "country": "string",
      "status": "ACTIVE or UNKNOWN"
    }
  ]
}

Rules:
- Return ONLY the JSON object — no explanation, no markdown, no code fences
- If a field is not present or unclear, omit it entirely
- Dates should be ISO format (YYYY-MM-DD) where possible
- If end date is "current" or "present", use the string "Present"
- Infer totalYearsExperience from work history if not explicitly stated
`

// -----------------------------------------------------------------------------
// MAIN EXTRACTION FUNCTION
// -----------------------------------------------------------------------------
export async function extractDoctorProfileFromCv(formData: FormData): Promise<CvExtractionResult> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const file = formData.get("cv") as File | null
  if (!file) throw new Error("No CV file provided")

  if (file.type !== "application/pdf") {
    throw new Error("Invalid file type. Only PDF is supported.")
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File is too large. Maximum size is 5MB.")
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.")

  // 1. Extract text from PDF using pdf2json
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const cvText = await new Promise<string>((resolve, reject) => {
    const pdfParser = new PDFParser() // 1 = extract raw text

    pdfParser.on("pdfParser_dataError", (errData: any) =>
      reject(new Error(errData.parserError))
    )

    pdfParser.on("pdfParser_dataReady", () => {
      resolve(pdfParser.getRawTextContent())
    })

    pdfParser.parseBuffer(buffer)
  })

  if (!cvText || cvText.trim().length < 100) {
    throw new Error("Could not extract readable text from this PDF. Please ensure the file is not scanned/image-only.")
  }

  // 2. Call Gemini
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const result = await model.generateContent([
    SYSTEM_PROMPT,
    `\n\nCV TEXT:\n${cvText.slice(0, 20000)}` // cap at 20k chars to stay within context limits
  ])

  const raw = result.response.text().trim()

  // 3. Parse JSON response (strip any accidental markdown fences)
  const jsonString = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim()

  try {
    const parsed = JSON.parse(jsonString) as CvExtractionResult
    return parsed
  } catch {
    throw new Error("AI returned an unexpected format. Please try again or enter your profile manually.")
  }
}
