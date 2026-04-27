"use client"

import { useTransition } from "react"
import { Building, MapPin, Calendar, Clock, Video, Map, ChevronRight, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContentSection } from "@/components/ui/layout-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS, INTERVIEW_TYPE_LABELS } from "../types"
import { withdrawApplication } from "../actions"

export function ApplicantApplicationDetail({ application }: { application: any }) {
  const [isPending, startTransition] = useTransition()

  const handleWithdraw = () => {
    if (!confirm("Are you sure you want to withdraw your application? This action cannot be undone.")) return
    startTransition(async () => {
      await withdrawApplication(application.id)
    })
  }

  const currentStatusStyle = APPLICATION_STATUS_COLORS[application.status as keyof typeof APPLICATION_STATUS_COLORS] || { text: "text-gray-700", bg: "bg-gray-100" }
  const upcomingInterviews = application.interviews?.filter((i: any) => new Date(i.scheduledAt) > new Date()) || []
  const pastInterviews = application.interviews?.filter((i: any) => new Date(i.scheduledAt) <= new Date()) || []

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-card p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-2xl font-bold">{application.opportunity.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {application.opportunity.hospital.name} · {application.opportunity.city ? `${application.opportunity.city}, ` : ""}{application.opportunity.country}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 shrink-0">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${currentStatusStyle.bg} ${currentStatusStyle.text}`}>
            {APPLICATION_STATUS_LABELS[application.status as keyof typeof APPLICATION_STATUS_LABELS]}
          </span>
          {application.status !== "WITHDRAWN" && application.status !== "REJECTED" && application.status !== "HIRED" && (
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleWithdraw} disabled={isPending}>
              Withdraw Application
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Status Timeline */}
          <ContentSection title="Application Timeline" description="Track the progress of your application.">
            <div className="relative border-l-2 border-muted ml-3 space-y-6">
              {application.statusHistory.map((history: any, index: number) => {
                const isLatest = index === 0
                const statusLabel = APPLICATION_STATUS_LABELS[history.status as keyof typeof APPLICATION_STATUS_LABELS]
                return (
                  <div key={history.id} className="relative pl-6">
                    <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-background ${isLatest ? "border-primary" : "border-muted"}`}></div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${isLatest ? "text-foreground" : "text-muted-foreground"}`}>{statusLabel}</span>
                      <span className="text-xs text-muted-foreground">{new Date(history.createdAt).toLocaleString()}</span>
                      {history.reason && history.status === "WITHDRAWN" && (
                        <p className="text-sm text-muted-foreground mt-1">{history.reason}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </ContentSection>

          {/* Interviews Section */}
          {(upcomingInterviews.length > 0 || pastInterviews.length > 0) && (
            <ContentSection title="Interviews" description="Your scheduled discussions with the hospital.">
              <div className="space-y-4">
                {upcomingInterviews.map((interview: any) => (
                  <Card key={interview.id} className="border-primary/30 shadow-sm bg-primary/5">
                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded uppercase tracking-wider">Upcoming</span>
                          <span className="text-sm font-medium text-foreground">Round {interview.round} Interview</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                          <div className="flex items-center gap-1"><Calendar size={14} /> {new Date(interview.scheduledAt).toLocaleDateString()}</div>
                          <div className="flex items-center gap-1"><Clock size={14} /> {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({interview.timezone})</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0 md:items-end">
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                          {interview.type === "VIRTUAL" ? <Video size={16} /> : <Map size={16} />}
                          {INTERVIEW_TYPE_LABELS[interview.type as keyof typeof INTERVIEW_TYPE_LABELS]}
                        </div>
                        {interview.type === "VIRTUAL" && interview.meetingLink ? (
                          <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">Join Meeting</a>
                        ) : interview.type === "IN_PERSON" && interview.location ? (
                          <span className="text-sm text-muted-foreground">{interview.location}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Details to be provided</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {pastInterviews.map((interview: any) => (
                  <Card key={interview.id} className="opacity-75 bg-muted/20">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-foreground">Round {interview.round} Interview</div>
                        <div className="text-xs text-muted-foreground mt-1">Completed on {new Date(interview.scheduledAt).toLocaleDateString()}</div>
                      </div>
                      <CheckCircle2 size={20} className="text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ContentSection>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">What happens next?</CardTitle>
            </CardHeader>
            <CardContent>
              {application.status === "NEW" && (
                <p className="text-sm text-muted-foreground">Your profile is currently under review by our recruitment team. We will contact you shortly if your qualifications match the role requirements.</p>
              )}
              {application.status === "SCREENING" && (
                <p className="text-sm text-muted-foreground">A recruiter is actively reviewing your application. You may be asked to provide additional documents or clarification.</p>
              )}
              {application.status === "SHORTLIST_SENT" && (
                <p className="text-sm text-muted-foreground">Your profile has been shared with {application.opportunity.hospital.name}. We are waiting for their feedback to schedule an interview.</p>
              )}
              {application.status === "INTERVIEWING" && (
                <p className="text-sm text-muted-foreground">You are currently in the interview stage. Please ensure you attend any scheduled meetings promptly.</p>
              )}
              {application.status === "OFFER_STAGE" && (
                <p className="text-sm text-muted-foreground">Congratulations! The hospital is preparing an offer. We will guide you through the negotiation and signing process.</p>
              )}
              {(application.status === "REJECTED" || application.status === "WITHDRAWN") && (
                <p className="text-sm text-muted-foreground">This application is no longer active. You can still apply for other opportunities matching your profile.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
