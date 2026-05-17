/**
 * Mistral OCR CV extractor — fallback provider.
 *
 * Strategy:
 *   1. Upload the raw PDF buffer to Mistral Files API (purpose: "ocr")
 *   2. Get a signed URL for the uploaded file
 *   3. Call client.ocr.process() with the document URL to extract text
 *   4. Feed the extracted markdown text to a Mistral chat model using the
 *      same structured-extraction prompt as Gemini
 *   5. Parse + validate the JSON response into CvExtractionResult
 *   6. Delete the uploaded file (best-effort cleanup)
 *
 * Env vars consumed:
 *   MISTRAL_API_KEY    — required
 *   MISTRAL_OCR_MODEL  — optional, defaults to "mistral-ocr-latest"
 */
import { Mistral } from "@mistralai/mistralai"
import {
  CvExtractionResult,
  CV_EXTRACTION_PROMPT,
  cleanJsonString,
  isUsableExtractionResult,
} from "./types"

export async function extractWithMistral(
  pdfBuffer: Buffer,
  fileName: string
): Promise<CvExtractionResult> {
  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) throw new Error("MISTRAL_API_KEY is not configured")

  const ocrModel = process.env.MISTRAL_OCR_MODEL || "mistral-ocr-latest"

  const client = new Mistral({ apiKey })

  // ── Step 1: Upload PDF to Mistral Files API ──────────────────────────────
  // Copy buffer into a plain ArrayBuffer to satisfy strict Blob typing
  const arrayBuffer = pdfBuffer.buffer.slice(
    pdfBuffer.byteOffset,
    pdfBuffer.byteOffset + pdfBuffer.byteLength
  ) as ArrayBuffer
  const blob = new Blob([arrayBuffer], { type: "application/pdf" })
  const uploadedFile = await client.files.upload({
    file: {
      fileName,
      content: blob,
    },
    purpose: "ocr" as any,
  })

  const fileId = uploadedFile.id
  if (!fileId) throw new Error("Mistral Files API did not return a file ID")

  let ocrText = ""

  try {
    // ── Step 2: Get signed URL ─────────────────────────────────────────────
    const signedUrlResponse = await client.files.getSignedUrl({ fileId })
    const documentUrl = signedUrlResponse?.url
    if (!documentUrl) throw new Error("Mistral did not return a signed URL")

    // ── Step 3: Run OCR on the document ───────────────────────────────────
    const ocrResponse = await client.ocr.process({
      model: ocrModel,
      document: {
        type: "document_url",
        documentUrl,
      },
    } as any)

    // Extract text from OCR pages array
    const pages: any[] = (ocrResponse as any)?.pages ?? []
    ocrText = pages
      .map((p: any) => p.markdown ?? p.text ?? "")
      .join("\n\n")
      .trim()

    if (!ocrText || ocrText.length < 50) {
      throw new Error("Mistral OCR returned empty or very short text")
    }
  } finally {
    // ── Step 6 (cleanup): Delete uploaded file — best-effort ──────────────
    try {
      await client.files.delete({ fileId })
    } catch {
      // intentionally swallowed — do not fail extraction on cleanup error
    }
  }

  // ── Step 4: Feed OCR text into Mistral chat for structured extraction ────
  const chatResponse = await client.chat.complete({
    model: "mistral-small-latest",
    messages: [
      {
        role: "user",
        content: `${CV_EXTRACTION_PROMPT}\n\nCV TEXT:\n${ocrText.slice(0, 20000)}`,
      },
    ],
  })

  const rawContent = chatResponse.choices?.[0]?.message?.content
  const raw = (typeof rawContent === "string" ? rawContent : "").trim()

  if (!raw) {
    throw new Error("Mistral chat returned an empty response")
  }

  const json = cleanJsonString(raw)

  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error(`Mistral returned non-JSON response (${json.slice(0, 80)}…)`)
  }

  if (!isUsableExtractionResult(parsed)) {
    throw new Error("Mistral extraction result is empty or unusable")
  }

  return parsed
}
