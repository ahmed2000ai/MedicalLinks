import { notFound } from "next/navigation"
import { getHospitalDetail } from "@/features/hospitals/services"
import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { Button } from "@/components/ui/button"
import { HospitalDetailClient } from "@/features/hospitals/components/HospitalDetailClient"
import { Pencil } from "lucide-react"
import Link from "next/link"

export default async function HospitalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const hospital = await getHospitalDetail(id)
  if (!hospital) notFound()

  return (
    <PageContainer>
      <PageHeader
        title={hospital.name}
        description={hospital.type ? `${hospital.type} · ${hospital.country ?? ""}` : hospital.country ?? ""}
        breadcrumbs={[
          { label: "Recruiter", href: "/recruiter" },
          { label: "Hospitals",  href: "/recruiter/hospitals" },
          { label: hospital.name },
        ]}
        actions={
          <Link href={`/recruiter/hospitals/${id}/edit`}>
            <Button variant="outline" className="gap-2"><Pencil size={14} /> Edit Hospital</Button>
          </Link>
        }
      />
      <HospitalDetailClient hospital={hospital} />
    </PageContainer>
  )
}
