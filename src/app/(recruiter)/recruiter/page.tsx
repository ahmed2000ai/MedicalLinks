import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MetricCard } from "@/components/ui/action-cards"
import { ApplicationStageBadge, ReadinessBadge, CredentialBadge } from "@/components/ui/domain-badges"
import { PageContainer, ContentSection } from "@/components/ui/layout-system"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Briefcase, Calendar, FileText, Plus, ArrowRight, MessageSquare, Clock, MapPin, Building, Activity } from "lucide-react"
import Link from "next/link"
import { requireRole } from "@/lib/auth-guards"
import {
  getRecruiterMetrics,
  getApplicationPipelineSummary,
  getUpcomingInterviews,
  getPriorityApplicants,
  getActiveOpportunitiesSummary,
  getRecentActivity,
} from "@/features/dashboard/recruiter-services"

export default async function RecruiterDashboardPage() {
  await requireRole(["RECRUITER", "ADMIN"])

  const metrics = await getRecruiterMetrics()
  const pipeline = await getApplicationPipelineSummary()
  const interviews = await getUpcomingInterviews()
  const priorityApplicants = await getPriorityApplicants()
  const activeOpportunities = await getActiveOpportunitiesSummary()
  const recentActivity = await getRecentActivity()

  return (
    <PageContainer>
      <PageHeader
        title="Recruiter Dashboard"
        description="Active pipeline overview. Manage candidates, track applications, and coordinate placements."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Recruiter Dashboard" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/recruiter/opportunities/new"><Plus size={16} className="mr-2" /> New Opportunity</Link>
            </Button>
            <Button asChild>
              <Link href="/recruiter/applications"><Users size={16} className="mr-2" /> Review Applications</Link>
            </Button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Active Opportunities" value={metrics.activeOpportunities.toString()} description="Currently open roles" icon={Briefcase} />
        <MetricCard title="Total Applications"   value={metrics.totalApplications.toString()}   description="In active pipeline" icon={Users} />
        <MetricCard title="Upcoming Interviews"  value={metrics.upcomingInterviews.toString()}  description="Scheduled"          icon={Calendar}  />
        <MetricCard title="Pending Documents"    value={metrics.pendingDocuments.toString()}    description="Needs attention"    icon={FileText}  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pipeline Summary (Horizontal Bar Chart style) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Activity size={18} /> Pipeline Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                {pipeline.map(stage => (
                  <div key={stage.label} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium text-muted-foreground">{stage.label}</div>
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${stage.color} rounded-full transition-all`} 
                        style={{ width: `${Math.max(2, (stage.value / Math.max(1, metrics.totalApplications)) * 100)}%` }} 
                      />
                    </div>
                    <div className="w-8 text-right text-sm font-bold">{stage.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Priority Applicants */}
          <ContentSection title="Priority Applicants (Ready Now)" description="Candidates who are marked as READY_NOW and should be fast-tracked.">
            <div className="space-y-4">
              {priorityApplicants.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 text-center border rounded-lg border-dashed">No priority applicants found.</p>
              ) : (
                <div className="divide-y border rounded-lg overflow-hidden bg-card">
                  {priorityApplicants.map(applicant => {
                    const latestJob = applicant.workExperiences[0]
                    return (
                      <div key={applicant.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                        <div>
                          <h4 className="font-semibold">{applicant.user.firstName} {applicant.user.lastName}</h4>
                          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            {latestJob?.title || "Specialist"} 
                            {applicant.medicalLicenses.length > 0 && (
                              <>
                                <span>•</span>
                                <CredentialBadge authority={applicant.medicalLicenses[0].issuingAuthority} status="ACTIVE" />
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <ReadinessBadge readiness={applicant.readinessLabel as any} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </ContentSection>

          {/* Active Opportunities Summary */}
          <ContentSection title="Recent Active Opportunities" actions={<Link href="/recruiter/opportunities" className="text-sm font-medium text-primary hover:underline flex items-center">View All <ArrowRight size={14} className="ml-1" /></Link>}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Applications</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeOpportunities.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-6">No active opportunities.</TableCell></TableRow>
                ) : (
                  activeOpportunities.map(opp => (
                    <TableRow key={opp.id} className="group">
                      <TableCell className="font-medium">
                        <Link href={`/recruiter/opportunities/${opp.id}`} className="hover:underline">{opp.title}</Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground"><Building size={14} className="inline mr-1" /> {opp.hospital.name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                          {opp._count.applications} Applicants
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ContentSection>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Upcoming Interviews */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2"><Calendar size={18} /> Upcoming Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              {interviews.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming interviews.</p>
              ) : (
                <div className="space-y-4">
                  {interviews.map(interview => (
                    <div key={interview.id} className="border rounded-lg p-3 hover:border-primary/50 transition-colors">
                      <Link href={`/recruiter/applications/${interview.applicationId}`}>
                        <div className="font-semibold text-sm hover:underline">
                          {interview.application.applicantProfile.user.firstName} {interview.application.applicantProfile.user.lastName}
                        </div>
                      </Link>
                      <div className="text-xs text-muted-foreground mt-1">
                        {interview.application.opportunity.title} at {interview.application.opportunity.hospital.name}
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-xs font-medium bg-muted/50 p-2 rounded">
                        <span className="flex items-center gap-1 text-primary"><Clock size={12} /> {new Date(interview.scheduledAt).toLocaleString()}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {interview.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2"><Clock size={18} /> Recent Pipeline Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
              ) : (
                <div className="relative border-l-2 border-muted ml-2 space-y-4 py-2">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="relative pl-4">
                      <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 bg-background border-primary"></div>
                      <div className="text-sm">
                        <span className="font-semibold">{activity.application.applicantProfile.user.firstName} {activity.application.applicantProfile.user.lastName}</span> 
                        {' '}was moved to{' '}
                        <ApplicationStageBadge status={activity.status} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {activity.application.opportunity.title} • {new Date(activity.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </PageContainer>
  )
}
