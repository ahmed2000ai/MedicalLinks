"use client"

import React, { useState, useTransition, useEffect } from "react"
import { DocumentType } from "@prisma/client"
import type { Document } from "@prisma/client"
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_TYPE_LABELS,
  REQUIRED_DOCUMENT_TYPES,
  calculateCredentialReadiness,
} from "../types"
import { DocumentRow } from "./DocumentRow"
import { UploadDocumentForm } from "./UploadDocumentForm"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Plus, ShieldCheck, AlertTriangle, CheckCircle2, Clock, FileUp
} from "lucide-react"

interface DocumentManagerProps {
  documents: Document[]
  initialUploadType?: DocumentType
}

export function DocumentManager({ documents, initialUploadType }: DocumentManagerProps) {
  const [showUpload, setShowUpload] = useState(false)
  const [uploadDefaultType, setUploadDefaultType] = useState<DocumentType | undefined>(initialUploadType)
  const [, startTransition] = useTransition()

  // Auto-open dialog when arriving via a typed deep link (e.g. ?type=DATAFLOW_REPORT)
  useEffect(() => {
    if (initialUploadType) {
      setUploadDefaultType(initialUploadType)
      setShowUpload(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const readiness = calculateCredentialReadiness(
    documents.map(d => ({
      type: d.type,
      fileUrl: d.fileUrl,
      title: d.title,
      expiryDate: d.expiryDate,
      issueDate: d.issueDate,
      issuingAuthority: d.issuingAuthority,
    }))
  )

  const openUpload = (type?: DocumentType) => {
    setUploadDefaultType(type)
    setShowUpload(true)
  }

  const handleUploadSuccess = () => {
    setShowUpload(false)
    // Trigger a page reload to get fresh server data (simpler than optimistic update for file uploads)
    startTransition(() => { window.location.reload() })
  }

  const handleDeleted = () => {
    startTransition(() => { window.location.reload() })
  }

  return (
    <div className="space-y-6">
      {/* ── Credential Readiness Summary ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Score card */}
        <div className="col-span-1 bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Credential Readiness</p>
              <p className="text-5xl font-black mt-1">{readiness.score}<span className="text-2xl font-semibold text-white/70">%</span></p>
            </div>
            <ShieldCheck className="h-12 w-12 text-white/30" />
          </div>
          <div className="mt-4">
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${readiness.score}%` }}
              />
            </div>
            <p className="text-xs text-white/60 mt-1.5">
              {readiness.requiredUploaded} of {readiness.requiredCount} required documents uploaded
            </p>
          </div>
        </div>

        {/* Missing required */}
        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold">Missing Required</span>
          </div>
          {readiness.missingRequired.length === 0 ? (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 size={16} />
              All required documents uploaded
            </div>
          ) : (
            <ul className="space-y-2">
              {readiness.missingRequired.map(type => (
                <li key={type} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{DOCUMENT_TYPE_LABELS[type]}</span>
                  <button
                    type="button"
                    onClick={() => openUpload(type)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus size={11} /> Add
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Expiry alerts */}
        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold">Expiry Alerts</span>
          </div>
          {readiness.expiredDocs.length === 0 && readiness.expiringDocs.length === 0 ? (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 size={16} />
              No expiry issues
            </div>
          ) : (
            <div className="space-y-2">
              {readiness.expiredDocs.map(d => (
                <div key={d} className="flex items-center gap-2 text-xs text-red-600">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                  {d} — Expired
                </div>
              ))}
              {readiness.expiringDocs.map(d => (
                <div key={d} className="flex items-center gap-2 text-xs text-amber-600">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {d} — Expiring soon
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Upload button ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Documents</h2>
        <Button onClick={() => openUpload()} className="gap-2">
          <FileUp size={16} />
          Upload Document
        </Button>
      </div>

      {/* ── Document list by category ─────────────────────────────────────── */}
      {documents.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center">
          <FileUp className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-semibold text-foreground">No documents yet</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Upload your credentials to prepare for GCC hospital applications.
          </p>
          <Button onClick={() => openUpload()}>Upload Your First Document</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {DOCUMENT_CATEGORIES.map(category => {
            const categoryDocs = documents.filter(d => category.types.includes(d.type))
            if (categoryDocs.length === 0) return null
            return (
              <div key={category.label}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  {category.label}
                </h3>
                <div className="space-y-3">
                  {categoryDocs.map(doc => (
                    <DocumentRow key={doc.id} doc={doc} onDeleted={handleDeleted} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Missing required checklist footer ────────────────────────────── */}
      {readiness.missingRequired.length > 0 && (
        <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-amber-800 mb-2">Recommended for GCC Applications</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {REQUIRED_DOCUMENT_TYPES.map(type => {
              const uploaded = documents.some(d => d.type === type)
              return (
                <div key={type} className={`flex items-center gap-2 text-xs ${uploaded ? "text-green-700" : "text-amber-700"}`}>
                  {uploaded
                    ? <CheckCircle2 size={13} className="text-green-600 shrink-0" />
                    : <AlertTriangle size={13} className="text-amber-500 shrink-0" />
                  }
                  {DOCUMENT_TYPE_LABELS[type]}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Upload dialog ─────────────────────────────────────────────────── */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent onClose={() => setShowUpload(false)} size="lg">
          <DialogHeader>
            <DialogTitle>Upload Credential Document</DialogTitle>
          </DialogHeader>
          <UploadDocumentForm
            defaultType={uploadDefaultType}
            onSuccess={handleUploadSuccess}
            onCancel={() => setShowUpload(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
