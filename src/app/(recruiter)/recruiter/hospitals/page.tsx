import { listHospitals } from "@/features/hospitals/services"
import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { Button } from "@/components/ui/button"
import { HospitalListClient } from "@/features/hospitals/components/HospitalListClient"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata = { title: "Hospitals — MedicalLinks" }

export default async function HospitalsPage() {
  const hospitals = await listHospitals()

  return (
    <PageContainer>
      <PageHeader
        title="Hospital Partners"
        description="Manage hospital organizations, locations, and departments."
        breadcrumbs={[{ label: "Recruiter", href: "/recruiter" }, { label: "Hospitals" }]}
        actions={
          <Link href="/recruiter/hospitals/new">
            <Button className="gap-2"><Plus size={16} /> Add Hospital</Button>
          </Link>
        }
      />
      <HospitalListClient hospitals={hospitals} />
    </PageContainer>
  )
}
