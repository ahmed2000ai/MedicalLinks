import { getHospitalDetail } from "@/features/hospitals/services"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { HospitalForm } from "@/features/hospitals/components/HospitalForm"

export default async function EditHospitalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // For "new", hospitalId is "new" — render empty form
  const hospital = id === "new" ? null : await getHospitalDetail(id)
  if (id !== "new" && !hospital) notFound()

  return (
    <PageContainer>
      <PageHeader
        title={hospital ? `Edit ${hospital.name}` : "Add Hospital"}
        description={hospital ? "Update hospital details, locations, and departments." : "Create a new hospital partner record."}
        breadcrumbs={[
          { label: "Recruiter",  href: "/recruiter" },
          { label: "Hospitals",  href: "/recruiter/hospitals" },
          ...(hospital ? [{ label: hospital.name, href: `/recruiter/hospitals/${id}` }] : []),
          { label: hospital ? "Edit" : "New" },
        ]}
      />
      <HospitalForm hospital={hospital ?? undefined} />
    </PageContainer>
  )
}
