"use server"

import { auth } from "@/auth"
import PDFParser from "pdf2json"
import { runCvExtraction } from "@/lib/ai/cv-extractors"

// Re-export the canonical type so other files that import from here continue to work
export type { CvExtractionResult } from "@/lib/ai/cv-extractors"

// -----------------------------------------------------------------------------
// MAIN SERVER ACTION
// Called from: GlobalCvImportAction.tsx → onExtract handler
// -----------------------------------------------------------------------------
export async function extractDoctorProfileFromCv(formData: FormData) {
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

  // ── 1. Convert File → Buffer (needed for both pdf2json and Mistral upload) ──
  const arrayBuffer = await file.arrayBuffer()
  const pdfBuffer = Buffer.from(arrayBuffer)

  // ── 2. Extract text via pdf2json (used by Gemini; also kept as OCR fallback context) ──
  let cvText = ""
  try {
    cvText = await extractTextFromPdf(pdfBuffer)
  } catch {
    // If pdf2json fails we still try providers — Mistral OCR works on the raw PDF bytes
    console.warn("[CV-Extraction][WARN] pdf2json failed; Gemini will likely fail too — Mistral OCR will handle the raw PDF")
  }

  // ── 3. Delegate to the provider orchestrator ─────────────────────────────
  // The orchestrator tries Gemini first (using cvText), then Mistral (using pdfBuffer)
  return runCvExtraction(cvText, pdfBuffer, file.name)
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractTextFromPdf(buffer: Buffer): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const pdfParser = new PDFParser()

    pdfParser.on("pdfParser_dataError", (errData: any) =>
      reject(new Error(errData.parserError))
    )

    pdfParser.on("pdfParser_dataReady", () => {
      const text = pdfParser.getRawTextContent()
      resolve(text)
    })

    pdfParser.parseBuffer(buffer)
  })
}
