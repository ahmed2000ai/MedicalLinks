import { listOpportunities } from "@/features/hospitals/services"
import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { Button } from "@/components/ui/button"
import { OpportunityListClient } from "@/features/hospitals/components/OpportunityListClient"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata = { title: "Opportunities — MedicalLinks" }

export default async function OpportunitiesPage() {
  const opportunities = await listOpportunities()

  return (
    <PageContainer>
      <PageHeader
        title="Opportunities"
        description="Manage active vacancies, draft roles, and closed positions."
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Opportunities" }]}
        actions={
          <Link href="/admin/opportunities/new">
            <Button className="gap-2"><Plus size={16} /> Add Opportunity</Button>
          </Link>
        }
      />
      <OpportunityListClient opportunities={opportunities} />
    </PageContainer>
  )
}
