import { PageHeader } from "@/components/ui/page-header"
import { PageContainer } from "@/components/ui/layout-system"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building, Settings, MapPin } from "lucide-react"
import Link from "next/link"
import { listHospitalsForAdmin } from "@/features/admin/hospital-actions"

export default async function AdminHospitalsPage() {
  const hospitals = await listHospitalsForAdmin()

  return (
    <PageContainer>
      <PageHeader
        title="Hospital Partners"
        description="Manage hospital accounts, review access requests, and update commercial agreements."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: "Hospitals" }
        ]}
      />

      <div className="grid grid-cols-1 gap-4">
        {hospitals.map((hospital) => {
          let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
          if (hospital.status === "ACTIVE") variant = "default"
          if (hospital.status === "PENDING") variant = "secondary"
          if (hospital.status === "SUSPENDED" || hospital.status === "REJECTED") variant = "destructive"
          if (hospital.status === "EXPIRED") variant = "secondary"

          return (
            <Card key={hospital.id}>
              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg text-foreground leading-none">{hospital.name}</h3>
                      <Badge variant={variant}>{hospital.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {(hospital.city || hospital.country) && (
                        <div className="flex items-center gap-1">
                          <MapPin size={14} /> {hospital.city}{hospital.city && hospital.country ? ", " : ""}{hospital.country}
                        </div>
                      )}
                      <div>
                        {hospital.contacts.length} Contact{hospital.contacts.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <Link href={`/admin/hospitals/${hospital.id}`}>
                    <Button variant="outline" className="gap-2">
                      <Settings size={16} /> Manage Access
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {hospitals.length === 0 && (
          <div className="text-center p-12 bg-white rounded-lg border border-dashed">
            <Building className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No Hospitals Found</h3>
            <p className="text-muted-foreground text-sm mt-1">There are no hospital organizations registered yet.</p>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
