"use server"

import { auth } from "@/auth"
import { PrismaClient, DocumentType } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { z } from "zod"
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  buildLocalStoragePath,
} from "./types"

const prisma = new PrismaClient()

// ─── Auth helper ──────────────────────────────────────────────────────────────
async function getAuthorizedProfileId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })

  if (!profile) {
    const newProfile = await prisma.applicantProfile.create({
      data: { userId: session.user.id },
    })
    return newProfile.id
  }

  return profile.id
}

// ─── Upload metadata schema ───────────────────────────────────────────────────
const UploadMetadataSchema = z.object({
  type:             z.nativeEnum(DocumentType),
  title:            z.string().optional(),
  issuingAuthority: z.string().optional(),
  issueDate:        z.string().optional(), // ISO string from FormData
  expiryDate:       z.string().optional(),
  notes:            z.string().optional(),
})

// ─── uploadDocument ───────────────────────────────────────────────────────────
export async function uploadDocument(formData: FormData) {
  const profileId = await getAuthorizedProfileId()

  const file = formData.get("file") as File | null
  if (!file || file.size === 0) throw new Error("No file provided")

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("File type not allowed. Please upload PDF, JPEG, PNG, or WebP.")
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File is too large. Maximum allowed size is 10 MB.")
  }

  const meta = UploadMetadataSchema.parse({
    type:             formData.get("type"),
    title:            formData.get("title") || undefined,
    issuingAuthority: formData.get("issuingAuthority") || undefined,
    issueDate:        formData.get("issueDate") || undefined,
    expiryDate:       formData.get("expiryDate") || undefined,
    notes:            formData.get("notes") || undefined,
  })

  // Store file locally (dev). In production, replace with cloud upload.
  const fileUrl = buildLocalStoragePath(profileId, meta.type, file.name)
  const absPath = join(process.cwd(), "public", fileUrl)
  const dir = absPath.substring(0, absPath.lastIndexOf("\\") !== -1 ? absPath.lastIndexOf("\\") : absPath.lastIndexOf("/"))

  await mkdir(dir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(absPath, buffer)

  await prisma.document.create({
    data: {
      applicantProfileId: profileId,
      type:             meta.type,
      title:            meta.title || null,
      fileName:         file.name,
      fileUrl,
      fileSize:         file.size,
      mimeType:         file.type,
      issuingAuthority: meta.issuingAuthority || null,
      issueDate:        meta.issueDate ? new Date(meta.issueDate) : null,
      expiryDate:       meta.expiryDate ? new Date(meta.expiryDate) : null,
      notes:            meta.notes || null,
    },
  })

  revalidatePath("/documents")
  revalidatePath("/dashboard")
  return { success: true }
}

// ─── updateDocumentMetadata ───────────────────────────────────────────────────
export async function updateDocumentMetadata(documentId: string, formData: FormData) {
  const profileId = await getAuthorizedProfileId()

  // Verify ownership
  const doc = await prisma.document.findFirst({
    where: { id: documentId, applicantProfileId: profileId },
    select: { id: true },
  })
  if (!doc) throw new Error("Document not found")

  const meta = UploadMetadataSchema.parse({
    type:             formData.get("type"),
    title:            formData.get("title") || undefined,
    issuingAuthority: formData.get("issuingAuthority") || undefined,
    issueDate:        formData.get("issueDate") || undefined,
    expiryDate:       formData.get("expiryDate") || undefined,
    notes:            formData.get("notes") || undefined,
  })

  await prisma.document.update({
    where: { id: documentId },
    data: {
      title:            meta.title || null,
      issuingAuthority: meta.issuingAuthority || null,
      issueDate:        meta.issueDate ? new Date(meta.issueDate) : null,
      expiryDate:       meta.expiryDate ? new Date(meta.expiryDate) : null,
      notes:            meta.notes || null,
    },
  })

  revalidatePath("/documents")
  return { success: true }
}

// ─── replaceDocument ──────────────────────────────────────────────────────────
export async function replaceDocument(documentId: string, formData: FormData) {
  const profileId = await getAuthorizedProfileId()

  const existing = await prisma.document.findFirst({
    where: { id: documentId, applicantProfileId: profileId },
  })
  if (!existing) throw new Error("Document not found")

  const file = formData.get("file") as File | null
  if (!file || file.size === 0) throw new Error("No replacement file provided")

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("File type not allowed.")
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File is too large.")
  }

  const fileUrl = buildLocalStoragePath(profileId, existing.type, file.name)
  const absPath = join(process.cwd(), "public", fileUrl)
  const dir = absPath.substring(0, absPath.lastIndexOf("\\") !== -1 ? absPath.lastIndexOf("\\") : absPath.lastIndexOf("/"))

  await mkdir(dir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(absPath, buffer)

  await prisma.document.update({
    where: { id: documentId },
    data: {
      fileName:  file.name,
      fileUrl,
      fileSize:  file.size,
      mimeType:  file.type,
      uploadedAt: new Date(),
    },
  })

  revalidatePath("/documents")
  return { success: true }
}

// ─── deleteDocument ───────────────────────────────────────────────────────────
export async function deleteDocument(documentId: string) {
  const profileId = await getAuthorizedProfileId()

  const doc = await prisma.document.findFirst({
    where: { id: documentId, applicantProfileId: profileId },
    select: { id: true },
  })
  if (!doc) throw new Error("Document not found")

  await prisma.document.delete({ where: { id: documentId } })

  revalidatePath("/documents")
  revalidatePath("/dashboard")
  return { success: true }
}

// ─── listDocuments ────────────────────────────────────────────────────────────
export async function listApplicantDocuments() {
  const session = await auth()
  if (!session?.user?.id) return []

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      documents: {
        orderBy: { uploadedAt: "desc" },
      },
    },
  })

  return profile?.documents ?? []
}
