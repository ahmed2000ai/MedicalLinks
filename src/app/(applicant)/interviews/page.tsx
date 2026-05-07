import { listInvitationsForDoctor } from "@/features/interviews/actions";
import { InterviewStatusBadge } from "@/features/interviews/components/InterviewStatusBadge";
import { RespondToInvitationButtons } from "@/features/interviews/components/RespondToInvitationButtons";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Video,
  MapPin,
  Building2,
  Clock,
  LinkIcon,
  FileText,
} from "lucide-react";

export const metadata = {
  title: "Interview Invitations — MedicalLinks",
  description: "View and respond to your interview invitations.",
};

function formatDateTime(date: Date, timezone: string) {
  return (
    new Date(date).toLocaleString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + ` (${timezone})`
  );
}

export default async function DoctorInterviewsPage() {
  const res = await listInvitationsForDoctor();
  const invitations = res.invitations ?? [];

  const now = new Date();

  const actionNeeded = invitations.filter((i) =>
    ["INVITED", "RESCHEDULE_REQUESTED"].includes(i.status)
  );
  const upcoming = invitations.filter(
    (i) =>
      ["ACCEPTED", "CONFIRMED"].includes(i.status) &&
      new Date(i.scheduledAt) >= now
  );
  const past = invitations.filter(
    (i) =>
      ["DECLINED", "CANCELLED", "COMPLETED"].includes(i.status) ||
      (["ACCEPTED", "CONFIRMED"].includes(i.status) && new Date(i.scheduledAt) < now)
  );

  function InvitationCard({ inv }: { inv: typeof invitations[0] }) {
    const needsAction = ["INVITED", "RESCHEDULE_REQUESTED"].includes(inv.status);

    return (
      <Card
        className={`border transition-shadow ${
          needsAction
            ? "border-primary/30 bg-primary/5 shadow-sm"
            : "border-slate-200"
        }`}
      >
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            {/* Header row */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{inv.title}</h3>
                  <InterviewStatusBadge status={inv.status} />
                  {needsAction && (
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200 font-medium border animate-pulse">
                      Action Required
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-primary font-medium flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  {inv.hospital.name}
                  {inv.opportunity && (
                    <span className="text-muted-foreground font-normal">
                      {" "}— {inv.opportunity.title}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Schedule details */}
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2 text-slate-700">
                <Clock className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>{formatDateTime(inv.scheduledAt, inv.timezone)}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-700">
                {inv.type === "VIRTUAL" ? (
                  <Video className="h-4 w-4 text-slate-400 shrink-0" />
                ) : (
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                )}
                <span>
                  {inv.type === "VIRTUAL" ? "Virtual Interview" : "In-Person Interview"}
                </span>
              </div>

              {inv.type === "VIRTUAL" && inv.meetingLink && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <LinkIcon className="h-4 w-4 text-slate-400 shrink-0" />
                  <a
                    href={inv.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline text-sm truncate max-w-xs"
                  >
                    {inv.meetingLink}
                  </a>
                </div>
              )}

              {inv.type === "IN_PERSON" && inv.location && (
                <div className="flex items-start gap-2 sm:col-span-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-700">{inv.location}</span>
                </div>
              )}
            </div>

            {/* Notes */}
            {inv.notes && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-slate-50 border border-slate-200 text-sm text-slate-700">
                <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-xs text-slate-500 uppercase tracking-wide mb-1">
                    Notes from Hospital
                  </p>
                  <p className="whitespace-pre-wrap">{inv.notes}</p>
                </div>
              </div>
            )}

            {/* Doctor's own response note (if already responded) */}
            {inv.doctorResponseNote && !needsAction && (
              <div className="text-sm text-muted-foreground italic">
                Your note: &ldquo;{inv.doctorResponseNote}&rdquo;
              </div>
            )}

            {/* Response actions */}
            {needsAction && (
              <div className="pt-2 border-t border-primary/20">
                <p className="text-xs text-muted-foreground mb-3">
                  Please respond to this invitation at your earliest convenience.
                </p>
                <RespondToInvitationButtons
                  invitationId={inv.id}
                  currentStatus={inv.status}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12 space-y-8">
      <PageHeader
        title="Interview Invitations"
        description="Review interview invitations from hospitals and manage your responses."
      />

      {invitations.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center space-y-3">
            <Calendar className="h-10 w-10 mx-auto text-slate-300" />
            <p className="text-slate-500 font-medium">No interview invitations yet</p>
            <p className="text-sm text-muted-foreground">
              Invitations from hospitals will appear here.
            </p>
          </CardContent>
        </Card>
      )}

      {actionNeeded.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-orange-700 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Action Required ({actionNeeded.length})
          </h2>
          <div className="space-y-4">
            {actionNeeded.map((inv) => (
              <InvitationCard key={inv.id} inv={inv} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Upcoming Confirmed ({upcoming.length})
          </h2>
          <div className="space-y-4">
            {upcoming.map((inv) => (
              <InvitationCard key={inv.id} inv={inv} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-slate-400 mb-3">
            Past &amp; Closed
          </h2>
          <div className="space-y-3 opacity-70">
            {past.map((inv) => (
              <InvitationCard key={inv.id} inv={inv} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
