import { requireRole } from "@/lib/auth-guards"
import { AppShell } from "@/components/layout/app-shell"
import { PrismaClient } from "@prisma/client"
import { EmptyState } from "@/components/ui/empty-state"
import { Building2 } from "lucide-react"

const prisma = new PrismaClient()

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireRole(["APPLICANT", "ADMIN", "HOSPITAL_CONTACT"])

  if (user.role === "HOSPITAL_CONTACT") {
    const contact = await prisma.hospitalContact.findUnique({
      where: { userId: user.id },
      include: { hospital: true }
    })

    if (!contact || contact.hospital.status !== "ACTIVE") {
      let message = "Your hospital account is currently pending review by our administration team."
      if (contact?.hospital.status === "SUSPENDED") message = "Your hospital account has been suspended."
      if (contact?.hospital.status === "EXPIRED") message = "Your hospital agreement has expired."
      if (contact?.hospital.status === "REJECTED") message = "Your hospital account request was rejected."

      return (
        <AppShell>
          <div className="flex items-center justify-center min-h-[70vh]">
            <EmptyState
              title="Account Not Active"
              description={message}
              icon={<Building2 className="h-12 w-12 text-muted-foreground" />}
            />
          </div>
        </AppShell>
      )
    }
  }

  return <AppShell>{children}</AppShell>
}
