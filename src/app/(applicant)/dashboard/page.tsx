import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { FeedbackAlert } from "@/components/ui/feedback"
import { PageContainer } from "@/components/ui/layout-system"
import {
  QuickStartCard,
  TopMatchCard,
  ApplicationStatusPanel,
  InterviewItem,
} from "@/components/dashboard/applicant-widgets"
import {
  getApplicantProfileSummary,
  getApplicationStatusGroups,
  getUpcomingInterviews,
  getLicenseReadiness,
  getTopOpportunityMatches,
  getDocumentReadiness,
} from "@/lib/dashboard-data"
import {
  Briefcase, CalendarDays, ArrowRight, Calendar
} from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  const userId = session.user.id

  // Fetch all dashboard data in parallel
  const [profile, appGroups, interviews, licenseData, topMatches, docReadiness] =
    await Promise.all([
      getApplicantProfileSummary(userId),
      getApplicationStatusGroups(userId),
      getUpcomingInterviews(userId),
      getLicenseReadiness(userId),
      getTopOpportunityMatches(userId, 3),
      getDocumentReadiness(userId),
    ])

  const firstName = profile?.firstName ?? session.user.name?.split(" ")[0] ?? "Doctor"
  const completionPct = profile?.completionPct ?? 0
  const hasNoApps = appGroups.total === 0
  const hasNoInterviews = interviews.length === 0

  // DataFlow status: derived from uploaded documents
  const dataFlowStatus = docReadiness.hasDataFlow ? "ok" : docReadiness.uploadedCount > 0 ? "warn" : "missing"
  const dataFlowLabel  = docReadiness.hasDataFlow ? "Submitted" : docReadiness.uploadedCount > 0 ? "In Progress" : "Not Submitted"

  // License readiness
  const licenseStatus = licenseData.hasActiveLicense ? "ok" : licenseData.pendingAuthorities.length > 0 ? "pending" : "missing"
  const licenseLabel  = licenseData.hasActiveLicense
    ? "High"
    : licenseData.pendingAuthorities.length > 0
      ? "Pending"
      : "Not Started"

  // Relocation: placeholder from preferences
  // TODO: wire from applicantProfile.preferences.relocationWilling once profile chunk is built
  const relocationStatus: "ok" | "warn" | "pending" | "missing" = "ok"
  const relocationLabel = "GCC Ready"

  const readinessItems = [
    { label: "DataFlow",          value: dataFlowLabel,   status: dataFlowStatus  as "ok" | "warn" | "pending" | "missing" },
    { label: "License Readiness", value: licenseLabel,    status: licenseStatus   as "ok" | "warn" | "pending" | "missing" },
    { label: "Relocation",        value: relocationLabel, status: relocationStatus },
  ]

  return (
    <PageContainer>
      {/* ── Welcome Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, Dr. {firstName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&rsquo;s what&rsquo;s happening with your applications today.
          </p>
        </div>
        <Link href="/opportunities">
          <Button className="gap-2 shrink-0">
            <Briefcase size={16} /> Browse Opportunities
          </Button>
        </Link>
      </div>

      {/* ── Alerts ───────────────────────────────────────────────────── */}
      {dataFlowStatus !== "ok" && (
        <FeedbackAlert
          type="warning"
          message="Your DataFlow report has not been submitted. Upload it to unlock applications to UAE and Qatar hospital roles."
        />
      )}

      {/* ── Quick Start + Main Layout ────────────────────────────────── */}
      <QuickStartCard completionPct={completionPct} readinessItems={readinessItems} />

      {/* ── Two-column body ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Top Matches + Applications ─────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Top Matches */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Your Top Matches</h2>
              <Link href="/opportunities" className="text-sm font-medium text-primary flex items-center gap-1 hover:underline">
                View all opportunities <ArrowRight size={14} />
              </Link>
            </div>

            {topMatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {topMatches.map((opp) => (
                  <TopMatchCard
                    key={opp.id}
                    title={opp.title}
                    hospitalName={opp.hospitalName}
                    country={opp.country}
                    city={opp.city}
                    specialty={opp.specialty}
                    matchScore={opp.matchScore}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Briefcase className="h-6 w-6 text-muted-foreground" />}
                title="No Matches Yet"
                description="Complete your profile to unlock personalised opportunity recommendations."
                action={
                  <Link href="/profile">
                    <Button variant="outline">Complete Profile</Button>
                  </Link>
                }
              />
            )}
          </div>

          {/* Application pipeline list */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Applications</CardTitle>
              <Link href="/applications">
                <Button variant="ghost" size="sm" className="gap-1 text-primary text-xs">
                  View All <ArrowRight size={14} />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {hasNoApps ? (
                <EmptyState
                  icon={<Briefcase className="h-6 w-6 text-muted-foreground" />}
                  title="No Applications Yet"
                  description="Browse open roles and submit your first application to get started."
                  action={
                    <Link href="/opportunities">
                      <Button size="sm">Browse Opportunities</Button>
                    </Link>
                  }
                />
              ) : (
                <ApplicationStatusPanel
                  applied={appGroups.applied}
                  interviewing={appGroups.interviewing}
                  offerStage={appGroups.offerStage}
                  total={appGroups.total}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Right: Application Status + Interviews ────────────────── */}
        <div className="space-y-6">

          {/* Application Status Summary (compact) */}
          {!hasNoApps && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Application Status</CardTitle>
                <Link href="/applications">
                  <Button variant="ghost" size="sm" className="h-auto p-1 text-muted-foreground hover:text-primary">
                    <ArrowRight size={14} />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <ApplicationStatusPanel
                  applied={appGroups.applied}
                  interviewing={appGroups.interviewing}
                  offerStage={appGroups.offerStage}
                  total={appGroups.total}
                />
              </CardContent>
            </Card>
          )}

          {/* Upcoming Interviews */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays size={18} className="text-primary" />
                Upcoming Interviews
              </CardTitle>
              <Link href="/applications">
                <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                  View all
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-0">
              {hasNoInterviews ? (
                <EmptyState
                  icon={<Calendar className="h-6 w-6 text-muted-foreground" />}
                  title="No Upcoming Interviews"
                  description="Interviews will appear here once scheduled by your recruiter."
                />
              ) : (
                <div className="divide-y divide-border -mx-1">
                  {interviews.map((iv) => (
                    <InterviewItem
                      key={iv.id}
                      hospitalName={iv.hospitalName}
                      roleTitle={iv.roleTitle}
                      scheduledAt={iv.scheduledAt}
                      timezone={iv.timezone}
                      type={iv.type}
                      daysUntil={iv.daysUntil}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick links */}
          <Card>
            <CardContent className="pt-5 space-y-1">
              {[
                { label: "Complete Your Profile", href: "/profile",       icon: "👤" },
                { label: "Browse Open Roles",     href: "/opportunities", icon: "💼" },
                { label: "My Applications",       href: "/applications",  icon: "📄" },
                { label: "Messages",              href: "/messages",      icon: "✉️" },
              ].map(({ label, href, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 py-2 px-3 rounded-md text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                >
                  <span className="text-base leading-none">{icon}</span>
                  {label}
                  <ArrowRight size={14} className="ml-auto text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
