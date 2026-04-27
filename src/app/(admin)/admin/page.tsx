import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MetricCard } from "@/components/ui/action-cards"
import { PageContainer, ContentSection } from "@/components/ui/layout-system"
import { FeedbackAlert } from "@/components/ui/feedback"
import { ShieldCheck, Users, Briefcase, Building, LayoutDashboard, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
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
        <MetricCard title="Total Users"       value="34"  description="All active accounts"   icon={Users}     />
        <MetricCard title="Open Roles"        value="12"  description="Active opportunities"  icon={Briefcase} />
        <MetricCard title="Hospital Partners" value="5"   description="Active hospital accounts" icon={Building} />
        <MetricCard title="System Status"     value="OK"  description="All services nominal"  icon={ShieldCheck} />
      </div>

      <ContentSection title="Admin Tools">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Design System", description: "Browse all shared components and UI patterns.", href: "/admin/components", icon: LayoutDashboard },
            { title: "User Management", description: "Manage recruiter, applicant, and hospital accounts.", href: "#", icon: Users },
            { title: "Hospital Partners", description: "View and manage connected hospital organizations.", href: "/hospitals", icon: Building },
            { title: "Opportunities", description: "Review and manage all active job opportunities.", href: "#", icon: Briefcase },
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
