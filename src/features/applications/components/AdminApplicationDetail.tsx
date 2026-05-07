"use client"

import { useTransition } from "react"
import { Building, Calendar, Video, Map, ExternalLink, MessageSquare, Plus, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContentSection } from "@/components/ui/layout-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS, INTERVIEW_TYPE_LABELS } from "../types"
import { updateApplicationStatus, addRecruiterNote, scheduleInterview } from "../actions"
import { MatchIndicator } from "@/features/matching/components/MatchIndicator"
import { MatchResult } from "@/features/matching/types"
import Link from "next/link"
import { MessageApplicantButton } from "./MessageApplicantButton"

export function AdminApplicationDetail({ 
  application, 
  match, 
  currentUserId 
}: { 
  application: any; 
  match?: MatchResult;
  currentUserId: string;
}) {
  const [isPending, startTransition] = useTransition()

  const currentStatusStyle = APPLICATION_STATUS_COLORS[application.status as keyof typeof APPLICATION_STATUS_COLORS] || { text: "text-gray-700", bg: "bg-gray-100" }

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-card p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-2xl font-bold">{application.applicantProfile.user.firstName} {application.applicantProfile.user.lastName}</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStatusStyle.bg} ${currentStatusStyle.text}`}>
              {APPLICATION_STATUS_LABELS[application.status as keyof typeof APPLICATION_STATUS_LABELS]}
            </span>
            <span className="text-sm text-muted-foreground">Applying for</span>
            <Link href={`/admin/opportunities/${application.opportunity.id}`} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              {application.opportunity.title} <ExternalLink size={14} />
            </Link>
            <span className="text-sm text-muted-foreground">at {application.opportunity.hospital.name}</span>
          </div>
        </div>
        <div className="shrink-0 flex gap-2 items-center">
          <MessageApplicantButton 
            applicationId={application.id}
            applicantUserId={application.applicantProfile.userId}
            recruiterUserId={currentUserId}
            opportunityTitle={application.opportunity.title}
          />
          <select 
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={application.status}
            onChange={(e) => {
              if (confirm("Change application status?")) {
                startTransition(() => updateApplicationStatus(application.id, e.target.value as any, "Status updated by recruiter"))
              }
            }}
            disabled={isPending}
          >
            {Object.entries(APPLICATION_STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {match && (
            <ContentSection title="Candidate Fit Analysis">
              <MatchIndicator match={match} showReasons={true} />
            </ContentSection>
          )}

          <ContentSection title="Status Workflow">
            <div className="relative border-l-2 border-muted ml-3 space-y-6">
              {application.statusHistory.map((history: any, index: number) => {
                const isLatest = index === 0
                const statusLabel = APPLICATION_STATUS_LABELS[history.status as keyof typeof APPLICATION_STATUS_LABELS]
                return (
                  <div key={history.id} className="relative pl-6">
                    <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-background ${isLatest ? "border-primary" : "border-muted"}`}></div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-semibold ${isLatest ? "text-foreground" : "text-muted-foreground"}`}>{statusLabel}</span>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span>{new Date(history.createdAt).toLocaleString()}</span>
                        {history.changedById && <span>· Updated manually</span>}
                      </div>
                      {history.reason && <p className="text-sm text-muted-foreground mt-1.5">{history.reason}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </ContentSection>

          <ContentSection title="Interviews">
            <div className="space-y-4">
              {application.interviews.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 text-center border rounded-lg border-dashed">No interviews scheduled.</p>
              ) : (
                application.interviews.map((interview: any) => {
                  const isPast = new Date(interview.scheduledAt) < new Date()
                  return (
                    <Card key={interview.id} className={isPast ? "opacity-75 bg-muted/20" : "border-primary/30 bg-primary/5"}>
                      <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {isPast ? <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Completed</span> : <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded uppercase tracking-wider">Upcoming</span>}
                            <span className="text-sm font-medium text-foreground">Round {interview.round}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-2">
                            {new Date(interview.scheduledAt).toLocaleString()} ({interview.timezone})
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 md:items-end shrink-0">
                          <div className="flex items-center gap-1.5 text-sm font-medium">
                            {interview.type === "VIRTUAL" ? <Video size={16} /> : <Map size={16} />}
                            {INTERVIEW_TYPE_LABELS[interview.type as keyof typeof INTERVIEW_TYPE_LABELS]}
                          </div>
                          <span className="text-xs text-muted-foreground">{interview.meetingLink || interview.location || "No details provided"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
              
              <div className="border border-border rounded-lg p-4 bg-card">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Plus size={16} /> Schedule Interview</h4>
                <form action={(data) => startTransition(() => scheduleInterview(application.id, data))} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input name="scheduledAt" type="datetime-local" required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    <select name="type" required className="h-9 rounded-md border border-input bg-transparent px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                      <option value="VIRTUAL">Virtual</option>
                      <option value="IN_PERSON">In Person</option>
                    </select>
                  </div>
                  <input name="meetingLink" placeholder="Meeting Link or Location..." className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                  <div className="flex justify-end">
                    <Button size="sm" type="submit" disabled={isPending}>Schedule</Button>
                  </div>
                </form>
              </div>
            </div>
          </ContentSection>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MessageSquare size={16} /> Internal Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {application.notes.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No notes added yet.</p>
                ) : (
                  application.notes.map((note: any) => (
                    <div key={note.id} className="bg-amber-50/50 border border-amber-100 rounded-lg p-3">
                      <p className="text-sm text-amber-900/80 whitespace-pre-wrap">{note.content}</p>
                      <p className="text-[10px] text-amber-700/60 mt-2 text-right">{new Date(note.createdAt).toLocaleString()}</p>
                    </div>
                  ))
                )}
                
                <form action={(data) => {
                  startTransition(() => addRecruiterNote(application.id, data.get("content") as string))
                  const form = document.getElementById("note-form") as HTMLFormElement
                  if (form) form.reset()
                }} id="note-form" className="pt-2 border-t border-border mt-4">
                  <Textarea name="content" placeholder="Add a private note..." className="min-h-[80px] text-sm mb-2" required />
                  <Button size="sm" type="submit" className="w-full" disabled={isPending}>Add Note</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
