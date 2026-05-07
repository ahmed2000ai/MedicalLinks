import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Building2, Mail, User, Shield } from "lucide-react"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function HospitalSettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const contact = await prisma.hospitalContact.findUnique({
    where: { userId: session.user.id },
    include: {
      user: {
        select: { firstName: true, lastName: true, email: true },
      },
      hospital: {
        select: {
          name: true,
          type: true,
          country: true,
          city: true,
          website: true,
          status: true,
          agreementStartDate: true,
          agreementEndDate: true,
        },
      },
    },
  })

  if (!contact) redirect("/hospitals")

  const { user, hospital } = contact

  return (
    <div className="max-w-3xl mx-auto pb-12 space-y-6">
      <PageHeader
        title="Account Settings"
        description="Your hospital contact profile and agreement information."
      />

      {/* Contact Info */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b bg-muted/30 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Contact Profile</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Full Name</p>
              <p className="font-medium">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Job Title</p>
              <p className="font-medium">{contact.jobTitle ?? "—"}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Email Address</p>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground pt-2">
            To update your contact details or password, please contact the MedicalLinks administration team.
          </p>
        </div>
      </div>

      {/* Hospital Info */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b bg-muted/30 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Hospital Organisation</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Hospital Name</p>
              <p className="font-medium">{hospital.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Type</p>
              <p className="font-medium">{hospital.type ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Country</p>
              <p className="font-medium">{hospital.country ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">City</p>
              <p className="font-medium">{hospital.city ?? "—"}</p>
            </div>
          </div>
          {hospital.website && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Website</p>
              <a href={hospital.website} target="_blank" rel="noopener noreferrer"
                className="text-primary hover:underline text-sm">{hospital.website}</a>
            </div>
          )}
        </div>
      </div>

      {/* Agreement Info */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b bg-muted/30 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Platform Agreement</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Status</p>
              <span className={`inline-block text-sm font-semibold px-2.5 py-0.5 rounded-full ${
                hospital.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : hospital.status === "SUSPENDED"
                  ? "bg-red-100 text-red-700"
                  : hospital.status === "EXPIRED"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-muted text-muted-foreground"
              }`}>
                {hospital.status}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Agreement Start</p>
              <p className="font-medium">
                {hospital.agreementStartDate
                  ? new Date(hospital.agreementStartDate).toLocaleDateString()
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Agreement End</p>
              <p className="font-medium">
                {hospital.agreementEndDate
                  ? new Date(hospital.agreementEndDate).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground pt-2">
            For agreement renewal or updates, contact your MedicalLinks account manager.
          </p>
        </div>
      </div>
    </div>
  )
}
