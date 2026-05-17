/**
 * CV extraction orchestrator.
 *
 * Handles:
 *   - Provider selection (primary / fallback)
 *   - Timeout enforcement via CV_EXTRACTION_TIMEOUT_MS
 *   - Gemini → Mistral fallback on any failure
 *   - Lightweight server-side logging
 *
 * Env vars consumed:
 *   AI_PROVIDER                    — "gemini" (primary); anything else skips to fallback
 *   CV_EXTRACTION_FALLBACK_PROVIDER — "mistral" triggers Mistral fallback
 *   CV_EXTRACTION_TIMEOUT_MS       — ms timeout applied to each provider call (default 30000)
 *   GEMINI_API_KEY                 — passed through to gemini extractor
 *   MISTRAL_API_KEY                — passed through to mistral extractor
 *   MISTRAL_OCR_MODEL              — passed through to mistral extractor
 *   AI_MODEL                       — passed through to gemini extractor
 */

import { CvExtractionResult } from "./types"
import { extractWithGemini } from "./gemini"
import { extractWithMistral } from "./mistral"

// ── Config ──────────────────────────────────────────────────────────────────

function getTimeoutMs(): number {
  const raw = process.env.CV_EXTRACTION_TIMEOUT_MS
  const parsed = parseInt(raw ?? "", 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30_000
}

type FailureReason = "timeout" | "provider_error" | "json_parse" | "schema_validation" | "empty_result"

interface ExtractionSuccess {
  success: true
  result: CvExtractionResult
  provider: string
  durationMs: number
}

interface ExtractionFailure {
  success: false
  provider: string
  reason: FailureReason
  error: string
  durationMs: number
}

type ExtractionAttemptResult = ExtractionSuccess | ExtractionFailure

// ── Timeout wrapper ──────────────────────────────────────────────────────────

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`[${label}] timed out after ${ms}ms`))
    }, ms)

    promise
      .then((val) => { clearTimeout(timer); resolve(val) })
      .catch((err) => { clearTimeout(timer); reject(err) })
  })
}

// ── Classify errors for logging ──────────────────────────────────────────────

function classifyError(err: unknown): FailureReason {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase()
  if (msg.includes("timed out")) return "timeout"
  if (msg.includes("non-json") || msg.includes("json")) return "json_parse"
  if (msg.includes("empty or unusable") || msg.includes("unusable")) return "schema_validation"
  return "provider_error"
}

// ── Single provider attempt ──────────────────────────────────────────────────

async function attemptGemini(cvText: string, timeoutMs: number): Promise<ExtractionAttemptResult> {
  const t0 = Date.now()
  try {
    const result = await withTimeout(extractWithGemini(cvText), timeoutMs, "Gemini")
    return { success: true, result, provider: "gemini", durationMs: Date.now() - t0 }
  } catch (err) {
    return {
      success: false,
      provider: "gemini",
      reason: classifyError(err),
      error: err instanceof Error ? err.message : String(err),
      durationMs: Date.now() - t0,
    }
  }
}

async function attemptMistral(pdfBuffer: Buffer, fileName: string, timeoutMs: number): Promise<ExtractionAttemptResult> {
  const t0 = Date.now()
  try {
    const result = await withTimeout(
      extractWithMistral(pdfBuffer, fileName),
      // Give Mistral a bit more time since it does an extra Files upload + OCR round-trip
      Math.max(timeoutMs, 45_000),
      "Mistral"
    )
    return { success: true, result, provider: "mistral", durationMs: Date.now() - t0 }
  } catch (err) {
    return {
      success: false,
      provider: "mistral",
      reason: classifyError(err),
      error: err instanceof Error ? err.message : String(err),
      durationMs: Date.now() - t0,
    }
  }
}

// ── Logging helpers (no PII / no API key leakage) ───────────────────────────

function log(level: "info" | "warn" | "error", msg: string, meta?: Record<string, unknown>) {
  const prefix = `[CV-Extraction][${level.toUpperCase()}]`
  if (meta) {
    console[level === "info" ? "log" : level](`${prefix} ${msg}`, JSON.stringify(meta))
  } else {
    console[level === "info" ? "log" : level](`${prefix} ${msg}`)
  }
}

// ── Main orchestrator ────────────────────────────────────────────────────────

export async function runCvExtraction(
  cvText: string,
  pdfBuffer: Buffer,
  fileName: string
): Promise<CvExtractionResult> {
  const timeoutMs = getTimeoutMs()
  const primaryProvider = (process.env.AI_PROVIDER ?? "gemini").toLowerCase()
  const fallbackProvider = (process.env.CV_EXTRACTION_FALLBACK_PROVIDER ?? "mistral").toLowerCase()

  log("info", "Starting CV extraction", {
    primary: primaryProvider,
    fallback: fallbackProvider,
    timeoutMs,
    fileSize: pdfBuffer.byteLength,
    textLength: cvText.length,
  })

  // ── Primary: Gemini ──────────────────────────────────────────────────────
  if (primaryProvider === "gemini") {
    const geminiResult = await attemptGemini(cvText, timeoutMs)

    if (geminiResult.success) {
      log("info", "Gemini extraction succeeded", {
        durationMs: geminiResult.durationMs,
      })
      return geminiResult.result
    }

    log("warn", "Gemini extraction failed — attempting fallback", {
      reason: geminiResult.reason,
      durationMs: geminiResult.durationMs,
      // truncated error — no raw provider detail exposed to clients
      errorSummary: geminiResult.error.slice(0, 120),
    })
  }

  // ── Fallback: Mistral ────────────────────────────────────────────────────
  if (fallbackProvider === "mistral") {
    const mistralResult = await attemptMistral(pdfBuffer, fileName, timeoutMs)

    if (mistralResult.success) {
      log("info", "Mistral fallback extraction succeeded", {
        durationMs: mistralResult.durationMs,
      })
      return mistralResult.result
    }

    log("error", "Both providers failed", {
      mistralReason: mistralResult.reason,
      mistralDurationMs: mistralResult.durationMs,
      mistralErrorSummary: mistralResult.error.slice(0, 120),
    })
  }

  // ── Both failed ──────────────────────────────────────────────────────────
  throw new Error(
    "CV extraction failed. Please try again or complete your profile manually."
  )
}

// Re-export the shared type so callers only need one import
export type { CvExtractionResult }
