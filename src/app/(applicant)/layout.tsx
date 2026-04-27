import { requireRole } from "@/lib/auth-guards"
import { AppShell } from "@/components/layout/app-shell"

export default async function ApplicantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole(["APPLICANT"])
  return <AppShell>{children}</AppShell>
}
