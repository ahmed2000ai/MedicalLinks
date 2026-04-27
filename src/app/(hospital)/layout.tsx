import { requireRole } from "@/lib/auth-guards"
import { AppShell } from "@/components/layout/app-shell"

export default async function HospitalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole(["HOSPITAL_CONTACT"])
  return <AppShell>{children}</AppShell>
}
