import { PrismaClient } from "@prisma/client"
import type { HospitalListItem, OpportunityListItem } from "./types"

const prisma = new PrismaClient()

// ─── Hospitals ────────────────────────────────────────────────────────────────

export async function listHospitals(): Promise<HospitalListItem[]> {
  const hospitals = await prisma.hospitalOrganization.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { opportunities: true, departments: true } },
    },
  })
  return hospitals.map(h => ({
    id:               h.id,
    name:             h.name,
    type:             h.type,
    country:          h.country,
    city:             h.city,
    isActive:         h.isActive,
    opportunityCount: h._count.opportunities,
    departmentCount:  h._count.departments,
    createdAt:        h.createdAt,
  }))
}

export async function getHospitalDetail(hospitalId: string) {
  return prisma.hospitalOrganization.findUnique({
    where: { id: hospitalId },
    include: {
      locations:   { orderBy: { isPrimary: "desc" } },
      departments: { orderBy: { name: "asc" }, include: { _count: { select: { opportunities: true } } } },
      opportunities: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, title: true, specialty: true, status: true, createdAt: true, _count: { select: { applications: true } } },
      },
    },
  })
}

// ─── Opportunities ────────────────────────────────────────────────────────────

export async function listOpportunities(filters?: {
  status?: string
  hospitalId?: string
  specialty?: string
}): Promise<OpportunityListItem[]> {
  const opportunities = await prisma.opportunity.findMany({
    where: {
      ...(filters?.status    ? { status: filters.status as any }    : {}),
      ...(filters?.hospitalId ? { hospitalId: filters.hospitalId } : {}),
      ...(filters?.specialty  ? { specialty:  { contains: filters.specialty, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      hospital:   { select: { name: true } },
      department: { select: { name: true } },
      _count:     { select: { applications: true } },
    },
  })

  return opportunities.map(o => ({
    id:              o.id,
    title:           o.title,
    specialty:       o.specialty,
    seniority:       o.seniority,
    country:         o.country,
    city:            o.city,
    status:          o.status,
    urgency:         o.urgency,
    hospitalName:    o.hospital.name,
    departmentName:  o.department?.name ?? null,
    employmentType:  o.employmentType,
    applicationCount: o._count.applications,
    createdAt:       o.createdAt,
  }))
}

export async function getOpportunityDetail(opportunityId: string) {
  return prisma.opportunity.findUnique({
    where: { id: opportunityId },
    include: {
      hospital:     { select: { id: true, name: true, country: true, city: true, type: true } },
      department:   { select: { id: true, name: true } },
      requirements: { orderBy: [{ isMandatory: "desc" }, { createdAt: "asc" }] },
      benefits:     { orderBy: { createdAt: "asc" } },
      _count:       { select: { applications: true } },
    },
  })
}

export async function getHospitalsForSelect() {
  return prisma.hospitalOrganization.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, country: true },
  })
}

export async function getDepartmentsForHospital(hospitalId: string) {
  return prisma.department.findMany({
    where: { hospitalId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })
}
