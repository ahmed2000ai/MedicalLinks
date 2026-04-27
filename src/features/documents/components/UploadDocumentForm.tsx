"use client"

import React, { useRef, useState } from "react"
import { DocumentType } from "@prisma/client"
import { uploadDocument } from "../actions"
import { DOCUMENT_TYPE_LABELS, ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "../types"
import { FormField } from "@/components/ui/form-section"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FeedbackAlert } from "@/components/ui/feedback"
import { Upload, X, FileText } from "lucide-react"

interface UploadDocumentFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  defaultType?: DocumentType
}

export function UploadDocumentForm({ onSuccess, onCancel, defaultType }: UploadDocumentFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (file: File | null) => {
    if (!file) return
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError("File type not allowed. Please upload PDF, JPEG, or PNG.")
      return
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("File is too large. Maximum 10 MB.")
      return
    }
    setError(null)
    setSelectedFile(file)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedFile) { setError("Please select a file."); return }

    setIsSubmitting(true)
    setError(null)

    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      formData.set("file", selectedFile)

      await uploadDocument(formData)
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || "Upload failed.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <FeedbackAlert type="error" message={error} />}

      {/* File drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer
          ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFileChange(e.dataTransfer.files?.[0] ?? null)
        }}
      >
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />
        {selectedFile ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(0)} KB</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setSelectedFile(null) }}
              className="ml-2 text-muted-foreground hover:text-destructive"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">PDF, JPEG, PNG — max 10 MB</p>
          </div>
        )}
      </div>

      {/* Document type */}
      <FormField label="Document Type" htmlFor="type" required>
        <select
          id="type"
          name="type"
          defaultValue={defaultType || ""}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          required
        >
          <option value="" disabled>Select document type</option>
          {(Object.keys(DOCUMENT_TYPE_LABELS) as DocumentType[]).map((t) => (
            <option key={t} value={t}>{DOCUMENT_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </FormField>

      {/* Optional metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Label / Title" htmlFor="title" hint="e.g. DHA License 2024">
          <Input id="title" name="title" placeholder="Optional label" />
        </FormField>

        <FormField label="Issuing Authority" htmlFor="issuingAuthority" hint="e.g. DHA, SCFHS, GMC">
          <Input id="issuingAuthority" name="issuingAuthority" placeholder="Authority / issuer" />
        </FormField>

        <FormField label="Issue Date" htmlFor="issueDate">
          <Input id="issueDate" name="issueDate" type="date" />
        </FormField>

        <FormField label="Expiry Date" htmlFor="expiryDate">
          <Input id="expiryDate" name="expiryDate" type="date" />
        </FormField>
      </div>

      <FormField label="Notes" htmlFor="notes">
        <Textarea id="notes" name="notes" rows={2} placeholder="Optional notes or reference numbers" />
      </FormField>

      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || !selectedFile}>
          {isSubmitting ? "Uploading..." : "Upload Document"}
        </Button>
      </div>
    </form>
  )
}
