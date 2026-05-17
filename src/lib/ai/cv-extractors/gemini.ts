/**
 * Gemini CV extractor.
 *
 * Receives pre-extracted CV text (from pdf2json) and calls the Gemini
 * generateContent API. Returns a parsed CvExtractionResult.
 *
 * Env vars consumed:
 *   GEMINI_API_KEY  — required
 *   AI_MODEL        — optional, defaults to "gemini-3.1-flash-lite"
 */
import { GoogleGenerativeAI } from "@google/generative-ai"
import {
  CvExtractionResult,
  CV_EXTRACTION_PROMPT,
  cleanJsonString,
  isUsableExtractionResult,
} from "./types"

export async function extractWithGemini(cvText: string): Promise<CvExtractionResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured")

  const modelName = process.env.AI_MODEL || "gemini-3.1-flash-lite"

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: modelName })

  const result = await model.generateContent([
    CV_EXTRACTION_PROMPT,
    `\n\nCV TEXT:\n${cvText.slice(0, 20000)}`,
  ])

  const raw = result.response.text().trim()
  const json = cleanJsonString(raw)

  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error(`Gemini returned non-JSON response (${json.slice(0, 80)}…)`)
  }

  if (!isUsableExtractionResult(parsed)) {
    throw new Error("Gemini extraction result is empty or unusable")
  }

  return parsed
}
