import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Building2, Calendar, DollarSign, Briefcase, FileText } from "lucide-react";
import { getPlacementById } from "@/features/placements/actions";
import { PlacementStatusBadge } from "@/features/placements/components/PlacementStatusBadge";
import { AdminPlacementActions } from "@/features/placements/components/AdminPlacementActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ placementId: string }>;
}) {
  return { title: "Placement Detail — Admin — MedicalLinks" };
}

const SOURCE_LABELS: Record<string, string> = {
  DIRECT_DISCOVERY: "Direct Discovery",
  SHORTLIST_BASED: "Shortlist Progression",
  INTERVIEW_BASED: "Interview Outcome",
  OPPORTUNITY_BASED: "Opportunity Application",
};

export default async function AdminPlacementDetailPage({
  params,
}: {
  params: Promise<{ placementId: string }>;
}) {
  const { placementId } = await params;
  const res = await getPlacementById(placementId);

  if (!res.success || !res.placement) notFound();

  const p = res.placement;
  const prefs = p.applicantProfile.preferences;
  const isAnon = prefs?.visibility === "ANONYMOUS";
  const doctorName = isAnon
    ? "Confidential Candidate"
    : `${p.applicantProfile.user?.firstName ?? ""} ${p.applicantProfile.user?.lastName ?? ""}`.trim() || "Doctor";

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Back */}
      <div className="mb-6">
        <Link
          href="/admin/placements"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Placements
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{p.jobTitle}</h1>
            <PlacementStatusBadge status={p.status} />
          </div>
          <p className="text-muted-foreground text-sm">
            Placement ID: <code className="text-xs font-mono">{p.id}</code>
          </p>
          <p className="text-xs text-muted-foreground">
            Submitted{" "}
            {new Date(p.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Main details */}
        <div className="lg:col-span-2 space-y-6">

          {/* Doctor */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <User className="h-4 w-4" />
                Candidate
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              <p className="font-semibold text-slate-900">{doctorName}</p>
              {!isAnon && p.applicantProfile.user?.email && (
                <p className="text-sm text-muted-foreground">{p.applicantProfile.user.email}</p>
              )}
              {p.applicantProfile.workExperiences?.[0] && (
                <p className="text-sm text-slate-600">
                  {p.applicantProfile.workExperiences[0].title} at{" "}
                  {p.applicantProfile.workExperiences[0].hospitalName}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Hospital */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Hospital
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              <p className="font-semibold text-slate-900">{p.hospital.name}</p>
              {(p.hospital.city || p.hospital.country) && (
                <p className="text-sm text-muted-foreground">
                  {[p.hospital.city, p.hospital.country].filter(Boolean).join(", ")}
                </p>
              )}
              {p.hospital.commissionRate != null && (
                <p className="text-xs text-muted-foreground">
                  Agreement commission rate: {p.hospital.commissionRate}%
                </p>
              )}
              {p.recordedBy && (
                <p className="text-xs text-muted-foreground">
                  Recorded by: {p.recordedBy.firstName} {p.recordedBy.lastName}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Attribution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Attribution
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Source:</span>
                <Badge variant="secondary" className="text-xs font-normal">
                  {SOURCE_LABELS[p.source] ?? p.source}
                </Badge>
              </div>
              {p.opportunity && (
                <p className="text-sm text-slate-700">
                  <span className="text-muted-foreground">Opportunity: </span>
                  {p.opportunity.title}
                  {p.opportunity.specialty && ` — ${p.opportunity.specialty}`}
                </p>
              )}
              {p.interviewInvitation && (
                <p className="text-sm text-slate-700">
                  <span className="text-muted-foreground">Interview: </span>
                  {p.interviewInvitation.title} (
                  {new Date(p.interviewInvitation.scheduledAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  )
                </p>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {p.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{p.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right sidebar: Commercial + Admin actions */}
        <div className="space-y-6">
          {/* Fee card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Commercial Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Hire Date</p>
                <p className="font-medium text-slate-900">
                  {new Date(p.hireDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Monthly Salary</p>
                <p className="font-medium text-slate-900">
                  {p.currency} {p.monthlySalary.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Commission Rate</p>
                <p className="font-medium text-slate-900">{p.commissionRate}%</p>
              </div>
              <div className="pt-2 border-t border-primary/20">
                <p className="text-xs text-muted-foreground">Placement Fee</p>
                <p className="text-2xl font-bold text-primary">
                  {p.currency} {p.feeAmount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  = {p.currency} {p.monthlySalary.toLocaleString()} × {p.commissionRate}%
                </p>
              </div>
              {p.confirmedAt && (
                <div className="pt-1">
                  <p className="text-xs text-green-600 font-medium">
                    ✓ Confirmed{" "}
                    {new Date(p.confirmedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin action panel */}
          <AdminPlacementActions
            placementId={p.id}
            currentStatus={p.status}
          />
        </div>
      </div>
    </div>
  );
}
