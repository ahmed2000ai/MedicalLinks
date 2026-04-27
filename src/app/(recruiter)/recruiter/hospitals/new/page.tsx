import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { HospitalForm } from "@/features/hospitals/components/HospitalForm"

export default function NewHospitalPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Add Hospital"
        description="Create a new hospital partner record."
        breadcrumbs={[
          { label: "Recruiter", href: "/recruiter" },
          { label: "Hospitals", href: "/recruiter/hospitals" },
          { label: "New" },
        ]}
      />
      <HospitalForm />
    </PageContainer>
  )
}
