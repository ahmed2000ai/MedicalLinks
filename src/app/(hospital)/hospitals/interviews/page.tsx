import { listInvitationsForHospital } from "@/features/interviews/actions";
import { InterviewStatusBadge } from "@/features/interviews/components/InterviewStatusBadge";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Video, MapPin, User, Building2, Clock } from "lucide-react";
import Link from "next/link";

function formatDateTime(date: Date, timezone: string) {
  return new Date(date).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) + ` (${timezone})`;
}

export const metadata = {
  title: "Interviews — MedicalLinks",
  description: "Manage interview invitations sent to candidates.",
};

export default async function HospitalInterviewsPage() {
  const res = await listInvitationsForHospital();
  const invitations = res.invitations ?? [];

  const now = new Date();
  const upcoming = invitations.filter(
    (i) => new Date(i.scheduledAt) >= now && i.status !== "CANCELLED" && i.status !== "DECLINED"
  );
  const past = invitations.filter(
    (i) => new Date(i.scheduledAt) < now || i.status === "CANCELLED" || i.status === "DECLINED"
  );

  function CandidateName({ inv }: { inv: typeof invitations[0] }) {
    const prefs = inv.applicantProfile.preferences;
    if (prefs?.visibility === "ANONYMOUS") return <>Confidential Candidate</>;
    const u = inv.applicantProfile.user;
    return <>{u?.firstName} {u?.lastName}</>;
  }

  function InvCard({ inv }: { inv: typeof invitations[0] }) {
    return (
      <Card className="hover:shadow-md transition-shadow border-slate-200">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Date block */}
            <div className="shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary font-bold">
              <span className="text-xl leading-none">
                {new Date(inv.scheduledAt).getDate()}
              </span>
              <span className="text-xs uppercase tracking-wide mt-0.5">
                {new Date(inv.scheduledAt).toLocaleString("en", { month: "short" })}
              </span>
            </div>

            {/* Main info */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-900">{inv.title}</h3>
                <InterviewStatusBadge status={inv.status} />
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <CandidateName inv={inv} />
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {formatDateTime(inv.scheduledAt, inv.timezone)}
                </span>
                <span className="flex items-center gap-1.5">
                  {inv.type === "VIRTUAL" ? (
                    <Video className="h-3.5 w-3.5 text-slate-400" />
                  ) : (
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  )}
                  {inv.type === "VIRTUAL" ? "Virtual" : "In-Person"}
                </span>
                {inv.opportunity && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    {inv.opportunity.title}
                  </span>
                )}
              </div>

              {inv.doctorResponseNote && (
                <div className="mt-2 p-2.5 rounded-md bg-amber-50 border border-amber-200 text-sm text-amber-800">
                  <span className="font-medium">Candidate note: </span>
                  {inv.doctorResponseNote}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">
      <PageHeader
        title="Interviews"
        description="Track interview invitations you have sent to candidates."
      />

      {invitations.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center space-y-3">
            <Calendar className="h-10 w-10 mx-auto text-slate-300" />
            <p className="text-slate-500 font-medium">No interview invitations yet</p>
            <p className="text-sm text-muted-foreground">
              Use the <strong>Invite to Interview</strong> button from the{" "}
              <Link href="/hospitals/shortlist" className="text-primary underline">
                Shortlist
              </Link>{" "}
              or a candidate profile to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Upcoming ({upcoming.length})
              </h2>
              <div className="space-y-3">
                {upcoming.map((inv) => (
                  <InvCard key={inv.id} inv={inv} />
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-slate-400 mb-3">
                Past &amp; Closed ({past.length})
              </h2>
              <div className="space-y-3 opacity-70">
                {past.map((inv) => (
                  <InvCard key={inv.id} inv={inv} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
