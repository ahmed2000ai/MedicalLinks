import { requireRole } from "@/lib/auth-guards"
import { AppShell } from "@/components/layout/app-shell"

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole(["RECRUITER", "ADMIN"])
  return <AppShell>{children}</AppShell>
}
