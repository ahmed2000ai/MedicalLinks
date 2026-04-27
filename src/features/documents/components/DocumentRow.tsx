"use client"

import React, { useState } from "react"
import { Document } from "@prisma/client"
import {
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_STATUS_MAP,
  resolveDocumentStatus,
  formatFileSize,
  DocumentStatus,
} from "../types"
import { deleteDocument, replaceDocument } from "../actions"
import { Button } from "@/components/ui/button"
import { FeedbackAlert } from "@/components/ui/feedback"
import {
  FileText, Download, Trash2, RefreshCw, Calendar, Building2,
  CheckCircle2, AlertTriangle, Clock, XCircle, Info, Upload
} from "lucide-react"

function StatusBadge({ status }: { status: DocumentStatus }) {
  const info = DOCUMENT_STATUS_MAP[status]
  const icons: Record<DocumentStatus, React.ReactNode> = {
    READY:         <CheckCircle2 size={12} />,
    UPLOADED:      <CheckCircle2 size={12} />,
    EXPIRING_SOON: <Clock size={12} />,
    EXPIRED:       <XCircle size={12} />,
    MISSING:       <AlertTriangle size={12} />,
    INCOMPLETE:    <Info size={12} />,
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${info.color} ${info.bg}`}>
      {icons[status]}
      {info.label}
    </span>
  )
}

function formatDate(d: Date | null | undefined): string {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

interface DocumentRowProps {
  doc: Document
  onDeleted: () => void
}

export function DocumentRow({ doc, onDeleted }: DocumentRowProps) {
  const [confirming, setConfirming] = useState(false)
  const [replacing, setReplacing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isWorking, setIsWorking] = useState(false)

  const status = resolveDocumentStatus({
    fileUrl: doc.fileUrl,
    issueDate: doc.issueDate,
    expiryDate: doc.expiryDate,
    issuingAuthority: doc.issuingAuthority,
    title: doc.title,
  })

  const handleDelete = async () => {
    setIsWorking(true)
    try {
      await deleteDocument(doc.id)
      onDeleted()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsWorking(false)
      setConfirming(false)
    }
  }

  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsWorking(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.set("file", file)
      await replaceDocument(doc.id, fd)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsWorking(false)
      setReplacing(false)
    }
  }

  return (
    <div className={`border border-border rounded-xl p-4 bg-white hover:shadow-sm transition-shadow ${isWorking ? "opacity-60" : ""}`}>
      {error && <FeedbackAlert type="error" message={error} className="mb-3" />}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="p-2.5 bg-primary/8 rounded-lg shrink-0">
          <FileText className="h-5 w-5 text-primary" />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {DOCUMENT_TYPE_LABELS[doc.type]}
            </span>
            <StatusBadge status={status} />
          </div>

          <p className="text-sm font-semibold text-foreground truncate">
            {doc.title || doc.fileName}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
            {doc.issuingAuthority && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 size={11} /> {doc.issuingAuthority}
              </span>
            )}
            {doc.issueDate && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={11} /> Issued {formatDate(doc.issueDate)}
              </span>
            )}
            {doc.expiryDate && (
              <span className={`flex items-center gap-1 text-xs font-medium ${
                status === "EXPIRED" ? "text-red-600" : status === "EXPIRING_SOON" ? "text-amber-600" : "text-muted-foreground"
              }`}>
                <Clock size={11} /> Expires {formatDate(doc.expiryDate)}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              Uploaded {formatDate(doc.uploadedAt)}
            </span>
            {doc.fileSize && (
              <span className="text-xs text-muted-foreground">
                {formatFileSize(doc.fileSize)}
              </span>
            )}
          </div>

          {doc.notes && (
            <p className="text-xs text-muted-foreground mt-1 italic">{doc.notes}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"
            title="View / Download"
          >
            <Download size={15} />
          </a>

          {/* Replace */}
          <label className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors cursor-pointer" title="Replace file">
            <RefreshCw size={15} />
            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={handleReplace} />
          </label>

          {/* Delete */}
          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors"
              title="Remove"
            >
              <Trash2 size={15} />
            </button>
          ) : (
            <div className="flex items-center gap-1 ml-1">
              <span className="text-xs text-destructive font-medium">Remove?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isWorking}
                className="text-xs px-2 py-1 bg-destructive text-white rounded-md hover:bg-red-700"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="text-xs px-2 py-1 border border-border rounded-md hover:bg-muted"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
