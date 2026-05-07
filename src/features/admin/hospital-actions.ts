"use server"

import { PrismaClient, HospitalStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { z } from "zod"

const prisma = new PrismaClient()

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  const role = (session.user as any).role
  if (role !== "ADMIN") throw new Error("Forbidden")
  return session.user.id
}

export async function listHospitalsForAdmin() {
  await requireAdmin()
  
  const hospitals = await prisma.hospitalOrganization.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      contacts: {
        include: {
          user: {
            select: { email: true, firstName: true, lastName: true }
          }
        }
      }
    }
  })
  
  return hospitals
}

export async function getHospitalAgreement(hospitalId: string) {
  await requireAdmin()
  
  const hospital = await prisma.hospitalOrganization.findUnique({
    where: { id: hospitalId }
  })
  
  if (!hospital) throw new Error("Hospital not found")
  
  return hospital
}

const AgreementSchema = z.object({
  status: z.nativeEnum(HospitalStatus),
  commissionRate: z.coerce.number().optional().nullable(),
  agreementStartDate: z.string().optional().nullable(),
  agreementEndDate: z.string().optional().nullable(),
  agreementNotes: z.string().optional().nullable(),
})

export async function updateHospitalAgreement(hospitalId: string, formData: FormData) {
  await requireAdmin()
  
  const data = Object.fromEntries(formData)
  const parsed = AgreementSchema.parse(data)
  
  await prisma.hospitalOrganization.update({
    where: { id: hospitalId },
    data: {
      status: parsed.status,
      commissionRate: parsed.commissionRate || null,
      agreementStartDate: parsed.agreementStartDate ? new Date(parsed.agreementStartDate) : null,
      agreementEndDate: parsed.agreementEndDate ? new Date(parsed.agreementEndDate) : null,
      agreementNotes: parsed.agreementNotes || null,
    }
  })
  
  revalidatePath("/admin/hospitals")
  revalidatePath(`/admin/hospitals/${hospitalId}`)
}
