import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MetricCard } from "@/components/ui/action-cards"
import { PageContainer, ContentSection } from "@/components/ui/layout-system"
import { FeedbackAlert } from "@/components/ui/feedback"
import { ShieldCheck, Users, Briefcase, Building, LayoutDashboard, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getAdminMetrics } from "@/features/dashboard/admin-metrics"

export default async function AdminPage() {
  const metrics = await getAdminMetrics()

  return (
    <PageContainer>
      <PageHeader
        title="Admin Console"
        description="System-wide administration, user management, and platform configuration."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admin" }]}
      />

      <FeedbackAlert
        type="info"
        title="Development Mode"
        message="Admin tools are under active development. More configuration panels will be available in upcoming releases."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Users"       value={metrics.totalUsers.toString()}  description="All active accounts"   icon={Users}     />
        <MetricCard title="Open Roles"        value={metrics.openOpportunities.toString()}  description="Active opportunities"  icon={Briefcase} />
        <MetricCard title="Hospital Partners" value={metrics.hospitalPartners.toString()}   description="Active hospital accounts" icon={Building} />
        <MetricCard title="System Status"     value={metrics.systemStatus}  description="All services nominal"  icon={ShieldCheck} />
      </div>

      <ContentSection title="Admin Tools">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Design System", description: "Browse all shared components and UI patterns.", href: "/admin/components", icon: LayoutDashboard },
            { title: "Job Applications", description: "Manage the applicant pipeline.", href: "/admin/applications", icon: Users },
            { title: "Hospital Partners", description: "View and manage connected hospital organizations.", href: "/admin/hospitals", icon: Building },
            { title: "Opportunities", description: "Review and manage all active job opportunities.", href: "/admin/opportunities", icon: Briefcase },
            { title: "Placements", description: "Review and confirm successful hires.", href: "/admin/placements", icon: Users },
            { title: "Commercial", description: "Track invoicing and payment statuses.", href: "/admin/commercial", icon: LayoutDashboard },
          ].map(({ title, description, href, icon: Icon }) => (
            <Card key={title} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">{description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={href}>
                  <Button variant="ghost" size="sm" className="gap-1 text-primary">
                    Open <ArrowRight size={14} />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>
    </PageContainer>
  )
}
