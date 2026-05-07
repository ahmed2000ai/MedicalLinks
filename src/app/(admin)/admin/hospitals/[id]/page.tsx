import { PageHeader } from "@/components/ui/page-header"
import { PageContainer, ContentSection } from "@/components/ui/layout-system"
import { Card, CardContent } from "@/components/ui/card"
import { getHospitalAgreement } from "@/features/admin/hospital-actions"
import { HospitalAgreementForm } from "@/features/admin/components/HospitalAgreementForm"
import { Badge } from "@/components/ui/badge"

export default async function AdminHospitalDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const hospital = await getHospitalAgreement(params.id)

  return (
    <PageContainer>
      <PageHeader
        title={hospital.name}
        description="Manage commercial terms and platform access."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: "Hospitals", href: "/admin/hospitals" },
          { label: hospital.name }
        ]}
      />

      <div className="grid gap-6">
        <ContentSection title="Platform Access & Agreement">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-6 flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Current Status</p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        hospital.status === "ACTIVE" ? "default" :
                        hospital.status === "SUSPENDED" || hospital.status === "REJECTED" ? "destructive" : 
                        "secondary"
                      }
                      className="text-sm px-3 py-1"
                    >
                      {hospital.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Joined</p>
                  <p className="text-sm font-medium">{new Date(hospital.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <HospitalAgreementForm hospitalId={hospital.id} initialData={hospital} />
            </CardContent>
          </Card>
        </ContentSection>
        
        {/* Additional sections for Contacts or Opportunities could go here later */}
      </div>
    </PageContainer>
  )
}
