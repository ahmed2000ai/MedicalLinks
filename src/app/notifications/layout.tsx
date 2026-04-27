import { requireRole } from "@/lib/auth-guards"
import { AppShell } from "@/components/layout/app-shell"

export default async function NotificationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Broadly accessible for authenticated users
  await requireRole(["APPLICANT", "RECRUITER", "ADMIN", "HOSPITAL_CONTACT"])
  return <AppShell>{children}</AppShell>
}
