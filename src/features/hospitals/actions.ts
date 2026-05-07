"use server"

import { PrismaClient, OpportunityStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { z } from "zod"

const prisma = new PrismaClient()

// ─── Auth guard (ADMIN) ────────────────────────────────────────────────────────
async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  const role = (session.user as any).role
  if (role !== "ADMIN") throw new Error("Forbidden")
  return session.user.id
}

// ─────────────────────────────────────────────────────────────────────────────
// HOSPITAL ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

const HospitalSchema = z.object({
  name:         z.string().min(2),
  description:  z.string().optional(),
  website:      z.string().url().optional().or(z.literal("")),
  type:         z.string().optional(),
  country:      z.string().optional(),
  city:         z.string().optional(),
  isActive:     z.coerce.boolean().optional(),
  internalNotes:z.string().optional(),
})

export async function createHospital(formData: FormData) {
  await requireAdmin()
  const data = HospitalSchema.parse(Object.fromEntries(formData))
  const hospital = await prisma.hospitalOrganization.create({
    data: {
      name:          data.name,
      description:   data.description || null,
      website:       data.website || null,
      type:          data.type || null,
      country:       data.country || null,
      city:          data.city || null,
      isActive:      data.isActive ?? true,
      internalNotes: data.internalNotes || null,
    },
  })
  revalidatePath("/admin/hospitals")
  return hospital.id
}

export async function updateHospital(hospitalId: string, formData: FormData) {
  await requireAdmin()
  const data = HospitalSchema.parse(Object.fromEntries(formData))
  await prisma.hospitalOrganization.update({
    where: { id: hospitalId },
    data: {
      name:          data.name,
      description:   data.description || null,
      website:       data.website || null,
      type:          data.type || null,
      country:       data.country || null,
      city:          data.city || null,
      isActive:      data.isActive ?? true,
      internalNotes: data.internalNotes || null,
    },
  })
  revalidatePath("/admin/hospitals")
  revalidatePath(`/admin/hospitals/${hospitalId}`)
}

export async function deleteHospital(hospitalId: string) {
  await requireAdmin()
  await prisma.hospitalOrganization.delete({ where: { id: hospitalId } })
  revalidatePath("/admin/hospitals")
}

// ─── Department actions ───────────────────────────────────────────────────────

const DeptSchema = z.object({
  name:        z.string().min(1),
  description: z.string().optional(),
})

export async function createDepartment(hospitalId: string, formData: FormData) {
  await requireAdmin()
  const data = DeptSchema.parse(Object.fromEntries(formData))
  await prisma.department.create({
    data: { hospitalId, name: data.name, description: data.description || null },
  })
  revalidatePath(`/admin/hospitals/${hospitalId}`)
}

export async function deleteDepartment(deptId: string, hospitalId: string) {
  await requireAdmin()
  await prisma.department.delete({ where: { id: deptId } })
  revalidatePath(`/admin/hospitals/${hospitalId}`)
}

// ─── Location actions ─────────────────────────────────────────────────────────

const LocationSchema = z.object({
  country:   z.string().min(1),
  city:      z.string().min(1),
  address:   z.string().optional(),
  isPrimary: z.coerce.boolean().optional(),
})

export async function createLocation(hospitalId: string, formData: FormData) {
  await requireAdmin()
  const data = LocationSchema.parse(Object.fromEntries(formData))
  await prisma.hospitalLocation.create({
    data: { hospitalId, country: data.country, city: data.city, address: data.address || null, isPrimary: data.isPrimary ?? false },
  })
  revalidatePath(`/admin/hospitals/${hospitalId}`)
}

export async function deleteLocation(locationId: string, hospitalId: string) {
  await requireAdmin()
  await prisma.hospitalLocation.delete({ where: { id: locationId } })
  revalidatePath(`/admin/hospitals/${hospitalId}`)
}

// ─────────────────────────────────────────────────────────────────────────────
// OPPORTUNITY ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

const OpportunitySchema = z.object({
  hospitalId:             z.string().min(1),
  departmentId:           z.string().optional(),
  title:                  z.string().min(2),
  specialty:              z.string().min(1),
  subspecialty:           z.string().optional(),
  seniority:              z.string().optional(),
  country:                z.string().min(1),
  city:                   z.string().optional(),
  employmentType:         z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "LOCUM"]).default("FULL_TIME"),
  minYearsExperience:     z.coerce.number().int().optional(),
  minYearsPostSpecialty:  z.coerce.number().int().optional(),
  boardCertRequired:      z.coerce.boolean().optional(),
  salaryRangeMin:         z.coerce.number().int().optional(),
  salaryRangeMax:         z.coerce.number().int().optional(),
  currency:               z.string().default("USD"),
  housingAllowance:       z.coerce.boolean().optional(),
  healthInsurance:        z.coerce.boolean().optional(),
  annualFlights:          z.coerce.number().int().optional(),
  leaveAllowanceDays:     z.coerce.number().int().optional(),
  benefitsNotes:          z.string().optional(),
  visaSponsorship:        z.coerce.boolean().optional(),
  relocationSupport:      z.coerce.boolean().optional(),
  description:            z.string().min(10),
  licensingRequirement:   z.string().optional(),
  targetStartDate:        z.string().optional(),
  urgency:                z.enum(["URGENT", "STANDARD", "PIPELINE"]).default("STANDARD"),
  internalNotes:          z.string().optional(),
  status:                 z.nativeEnum(OpportunityStatus).default("INTAKE"),
})

function buildOpportunityData(data: z.infer<typeof OpportunitySchema>) {
  return {
    hospitalId:            data.hospitalId,
    departmentId:          data.departmentId || null,
    title:                 data.title,
    specialty:             data.specialty,
    subspecialty:          data.subspecialty || null,
    seniority:             data.seniority || null,
    country:               data.country,
    city:                  data.city || null,
    employmentType:        data.employmentType,
    minYearsExperience:    data.minYearsExperience ?? null,
    minYearsPostSpecialty: data.minYearsPostSpecialty ?? null,
    boardCertRequired:     data.boardCertRequired ?? false,
    salaryRangeMin:        data.salaryRangeMin ?? null,
    salaryRangeMax:        data.salaryRangeMax ?? null,
    currency:              data.currency,
    housingAllowance:      data.housingAllowance ?? false,
    healthInsurance:       data.healthInsurance ?? true,
    annualFlights:         data.annualFlights ?? null,
    leaveAllowanceDays:    data.leaveAllowanceDays ?? null,
    benefitsNotes:         data.benefitsNotes || null,
    visaSponsorship:       data.visaSponsorship ?? true,
    relocationSupport:     data.relocationSupport ?? true,
    description:           data.description,
    licensingRequirement:  data.licensingRequirement || null,
    targetStartDate:       data.targetStartDate ? new Date(data.targetStartDate) : null,
    urgency:               data.urgency,
    internalNotes:         data.internalNotes || null,
    status:                data.status,
  }
}

export async function createOpportunity(formData: FormData) {
  await requireAdmin()
  const data = OpportunitySchema.parse(Object.fromEntries(formData))
  const opp = await prisma.opportunity.create({ data: buildOpportunityData(data) })
  revalidatePath("/admin/opportunities")
  return opp.id
}

export async function updateOpportunity(opportunityId: string, formData: FormData) {
  await requireAdmin()
  const data = OpportunitySchema.parse(Object.fromEntries(formData))
  await prisma.opportunity.update({
    where: { id: opportunityId },
    data:  buildOpportunityData(data),
  })
  revalidatePath("/admin/opportunities")
  revalidatePath(`/admin/opportunities/${opportunityId}`)
}

export async function setOpportunityStatus(opportunityId: string, status: OpportunityStatus) {
  await requireAdmin()
  await prisma.opportunity.update({ where: { id: opportunityId }, data: { status } })
  revalidatePath("/admin/opportunities")
  revalidatePath(`/admin/opportunities/${opportunityId}`)
}

export async function deleteOpportunity(opportunityId: string) {
  await requireAdmin()
  await prisma.opportunity.delete({ where: { id: opportunityId } })
  revalidatePath("/admin/opportunities")
}

// ─── Requirement / Benefit helpers ───────────────────────────────────────────

export async function addRequirement(opportunityId: string, description: string, isMandatory: boolean) {
  await requireAdmin()
  await prisma.opportunityRequirement.create({
    data: { opportunityId, description, isMandatory },
  })
  revalidatePath(`/admin/opportunities/${opportunityId}`)
}

export async function removeRequirement(reqId: string, opportunityId: string) {
  await requireAdmin()
  await prisma.opportunityRequirement.delete({ where: { id: reqId } })
  revalidatePath(`/admin/opportunities/${opportunityId}`)
}

export async function addBenefit(opportunityId: string, description: string) {
  await requireAdmin()
  await prisma.opportunityBenefit.create({ data: { opportunityId, description } })
  revalidatePath(`/admin/opportunities/${opportunityId}`)
}

export async function removeBenefit(benefitId: string, opportunityId: string) {
  await requireAdmin()
  await prisma.opportunityBenefit.delete({ where: { id: benefitId } })
  revalidatePath(`/admin/opportunities/${opportunityId}`)
}
