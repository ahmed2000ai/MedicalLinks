import { getOpportunityDetail, getHospitalsForSelect } from "@/features/hospitals/services"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { OpportunityForm } from "@/features/hospitals/components/OpportunityForm"

export default async function EditOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const opportunity = id === "new" ? null : await getOpportunityDetail(id)
  if (id !== "new" && !opportunity) notFound()

  const hospitals = await getHospitalsForSelect()

  return (
    <PageContainer>
      <PageHeader
        title={opportunity ? "Edit Opportunity" : "Create Opportunity"}
        description={opportunity ? "Update role details and status." : "Open a new vacancy for a hospital."}
        breadcrumbs={[
          { label: "Admin",     href: "/admin" },
          { label: "Opportunities", href: "/admin/opportunities" },
          ...(opportunity ? [{ label: opportunity.title, href: `/admin/opportunities/${id}` }] : []),
          { label: opportunity ? "Edit" : "New" },
        ]}
      />
      <OpportunityForm opportunity={opportunity ?? undefined} hospitals={hospitals} />
    </PageContainer>
  )
}
