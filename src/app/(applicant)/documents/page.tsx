import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { PageHeader } from "@/components/ui/page-header"
import { DocumentManager } from "@/features/documents/components/DocumentManager"

const prisma = new PrismaClient()

export default async function DocumentsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      documents: {
        orderBy: { uploadedAt: "desc" },
      },
    },
  })

  const documents = profile?.documents ?? []

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Credential Documents"
        description="Manage your professional documents and track your GCC credential readiness."
      />
      <div className="mt-6">
        <DocumentManager documents={documents} />
      </div>
    </div>
  )
}
