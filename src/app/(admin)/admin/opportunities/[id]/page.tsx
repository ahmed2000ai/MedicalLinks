import { getOpportunityDetail } from "@/features/hospitals/services"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { Button } from "@/components/ui/button"
import { OpportunityDetailClient } from "@/features/hospitals/components/OpportunityDetailClient"
import { Pencil } from "lucide-react"
import Link from "next/link"

export default async function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const opportunity = await getOpportunityDetail(id)
  if (!opportunity) notFound()

  return (
    <PageContainer>
      <PageHeader
        title={opportunity.title}
        description={`${opportunity.hospital.name} · ${opportunity.city ? `${opportunity.city}, ` : ""}${opportunity.country}`}
        breadcrumbs={[
          { label: "Admin",     href: "/admin" },
          { label: "Opportunities", href: "/admin/opportunities" },
          { label: "Detail" },
        ]}
        actions={
          <Link href={`/admin/opportunities/${id}/edit`}>
            <Button variant="outline" className="gap-2"><Pencil size={14} /> Edit</Button>
          </Link>
        }
      />
      <OpportunityDetailClient opportunity={opportunity} />
    </PageContainer>
  )
}
