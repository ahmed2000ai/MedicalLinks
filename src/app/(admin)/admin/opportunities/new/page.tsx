import { getHospitalsForSelect } from "@/features/hospitals/services"
import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { OpportunityForm } from "@/features/hospitals/components/OpportunityForm"

export default async function NewOpportunityPage({
  searchParams,
}: {
  searchParams: Promise<{ hospitalId?: string }>
}) {
  const { hospitalId } = await searchParams
  const hospitals = await getHospitalsForSelect()

  return (
    <PageContainer>
      <PageHeader
        title="Create Opportunity"
        description="Open a new vacancy for a hospital."
        breadcrumbs={[
          { label: "Admin",     href: "/admin" },
          { label: "Opportunities", href: "/admin/opportunities" },
          { label: "New" },
        ]}
      />
      <OpportunityForm hospitals={hospitals} initialHospitalId={hospitalId} />
    </PageContainer>
  )
}
