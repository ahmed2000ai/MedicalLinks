import { PageHeader } from "@/components/ui/page-header"
import { MetricCard, ActionCard } from "@/components/ui/action-cards"
import { getHospitalDashboardSummary } from "@/features/hospitals/dashboard-actions"
import { Users, Bookmark, Briefcase, Calendar, Bell, ArrowRight, MessageSquare, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function HospitalDashboardPage() {
  const summary = await getHospitalDashboardSummary()
  
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <PageHeader 
        title={`Welcome, ${summary.hospitalName}`} 
        description="Here is what's happening across your candidate pipeline today." 
      />

      {/* KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Candidate Pool" 
          value={summary.stats.discoverableDoctors} 
          description="Available doctors" 
          icon={Users} 
        />
        <MetricCard 
          title="Saved Candidates" 
          value={summary.stats.savedCandidatesCount} 
          description="In your shortlists" 
          icon={Bookmark} 
        />
        <MetricCard 
          title="Active Roles" 
          value={summary.stats.activeOpportunitiesCount} 
          description="Open opportunities" 
          icon={Briefcase} 
        />
        <MetricCard 
          title="Interviews" 
          value={summary.stats.upcomingInterviewsCount} 
          description="Upcoming sessions" 
          icon={Calendar} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Actions) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Actions Grid */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/hospitals/search" className="block h-full">
                <ActionCard 
                  title="Browse Candidates" 
                  description="Search the verified doctor pool for your open roles."
                  icon={Search}
                  actionLabel="Search Pool"
                  className="bg-blue-50/50 hover:bg-blue-50/80"
                />
              </Link>
              <Link href="/hospitals/shortlist" className="block h-full">
                <ActionCard 
                  title="Saved Candidates" 
                  description="Review doctors you have shortlisted."
                  icon={Bookmark}
                  actionLabel="View Shortlist"
                />
              </Link>
              <Link href="#" className="block h-full">
                <ActionCard 
                  title="Opportunities" 
                  description="Manage your open roles and requirements."
                  icon={Briefcase}
                  actionLabel="Manage Roles"
                />
              </Link>
              <Link href="/messages" className="block h-full">
                <ActionCard 
                  title="Messages" 
                  description={summary.stats.unreadMessagesCount > 0 ? `You have ${summary.stats.unreadMessagesCount} unread message(s).` : "Send and receive messages with candidates."}
                  icon={MessageSquare}
                  actionLabel="Open Inbox"
                />
              </Link>
            </div>
          </section>

          {/* Active Opportunities */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Opportunities</h2>
              <Link href="/hospitals/opportunities" className="text-sm text-primary hover:underline font-medium">
                View all
              </Link>
            </div>
            <Card>
              <CardContent className="p-0 divide-y">
                {summary.recentOpportunities.length > 0 ? (
                  summary.recentOpportunities.map((opp) => (
                    <div key={opp.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                        <h3 className="font-medium text-slate-900">{opp.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>{opp.specialty}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span>{opp.city}, {opp.country}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Briefcase className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    <p>No active opportunities found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-8">
          
          {/* Upcoming Interviews — from InterviewInvitation */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Upcoming Interviews</h2>
              <Link href="/hospitals/interviews" className="text-sm text-primary hover:underline font-medium">
                View all
              </Link>
            </div>
            <Card>
              <CardContent className="p-0 divide-y">
                {summary.upcomingInterviews.length > 0 ? (
                  summary.upcomingInterviews.map((inv: any) => {
                    const prefs = inv.applicantProfile?.preferences
                    const isAnonymous = prefs?.visibility === "ANONYMOUS"
                    const name = isAnonymous
                      ? "Confidential Candidate"
                      : `${inv.applicantProfile?.user?.firstName || ""} ${inv.applicantProfile?.user?.lastName || ""}`.trim() || "Candidate"

                    return (
                      <div key={inv.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-primary">
                            {new Date(inv.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h3 className="font-medium text-slate-900">{name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                          {inv.title}{inv.opportunity ? ` — ${inv.opportunity.title}` : ""}
                        </p>
                      </div>
                    )
                  })
                ) : (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    No upcoming interviews scheduled.
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Recent Activity */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="p-0 divide-y">
                {summary.recentActivity.length > 0 ? (
                  summary.recentActivity.map((note) => (
                    <div key={note.id} className="p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                      <div className="mt-0.5">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">{note.title}</h4>
                        {note.message && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{note.message}</p>}
                        <span className="text-xs text-muted-foreground mt-2 block">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    No recent activity to show.
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

        </div>
      </div>
    </div>
  )
}
