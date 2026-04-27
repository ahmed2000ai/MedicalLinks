import { requireRole } from "@/lib/auth-guards"
import { AppShell } from "@/components/layout/app-shell"

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole(["APPLICANT", "RECRUITER", "ADMIN"])
  return <AppShell>{children}</AppShell>
}
