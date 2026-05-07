import { notFound } from "next/navigation";
import Link from "next/link";
import { getCommercialRecordById } from "@/features/commercial/actions";
import { CommercialStatusBadge } from "@/features/commercial/components/CommercialStatusBadge";
import { AdminCommercialActions } from "@/features/commercial/components/AdminCommercialActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  User,
  Briefcase,
  DollarSign,
  FileText,
  CalendarDays,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  return { title: "Commercial Detail — Admin — MedicalLinks" };
}

export default async function AdminCommercialDetailPage({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const { recordId } = await params;
  const res = await getCommercialRecordById(recordId);

  if (!res.success || !res.record) notFound();

  const r = res.record;
  const p = r.placement;
  const prefs = r.applicantProfile.preferences;
  const doctorName =
    prefs?.visibility === "ANONYMOUS"
      ? "Confidential Candidate"
      : `${r.applicantProfile.user?.firstName ?? ""} ${
          r.applicantProfile.user?.lastName ?? ""
        }`.trim() || "Doctor";

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-6">
        <Link
          href="/admin/commercial"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Commercial Records
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Commercial Record
            </h1>
            <CommercialStatusBadge status={r.status} />
          </div>
          <p className="text-muted-foreground text-sm">
            Record ID: <code className="text-xs font-mono">{r.id}</code>
          </p>
          <p className="text-xs text-muted-foreground">
            Linked to Placement ID:{" "}
            <Link
              href={`/admin/placements/${p.id}`}
              className="font-mono text-primary hover:underline"
            >
              {p.id}
            </Link>
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Context */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Hospital
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-semibold text-slate-900">{r.hospital.name}</p>
                <p className="text-sm text-muted-foreground">
                  {[r.hospital.city, r.hospital.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Candidate
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-semibold text-slate-900">{doctorName}</p>
                {r.applicantProfile.user?.email && (
                  <p className="text-sm text-muted-foreground">
                    {r.applicantProfile.user.email}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Placement Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <p className="text-sm text-slate-700">
                <span className="font-medium">Job Title:</span> {p.jobTitle}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-medium">Hire Date:</span>{" "}
                {new Date(p.hireDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-medium">Admin Confirmed:</span>{" "}
                {p.confirmedAt
                  ? new Date(p.confirmedAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </CardContent>
          </Card>

          {/* Dates Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Invoice Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-4 text-center divide-x">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">
                    Issued
                  </p>
                  <p className="font-medium text-slate-900 text-sm">
                    {r.issueDate ? new Date(r.issueDate).toLocaleDateString() : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">
                    Due
                  </p>
                  <p className="font-medium text-slate-900 text-sm">
                    {r.dueDate ? new Date(r.dueDate).toLocaleDateString() : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">
                    Paid
                  </p>
                  <p className="font-medium text-slate-900 text-sm">
                    {r.paymentDate
                      ? new Date(r.paymentDate).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {r.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {r.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Financials & Actions */}
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Fee Basis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Monthly Salary</p>
                <p className="font-medium text-slate-900">
                  {r.currency} {r.monthlySalary.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Commission Rate</p>
                <p className="font-medium text-slate-900">{r.commissionRate}%</p>
              </div>
              <div className="pt-2 border-t border-primary/20">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Placement Fee
                </p>
                <p className="text-2xl font-bold text-primary">
                  {r.currency} {r.feeAmount.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <AdminCommercialActions
            recordId={r.id}
            currentStatus={r.status}
            issueDate={r.issueDate}
            dueDate={r.dueDate}
            paymentDate={r.paymentDate}
            initialNotes={r.notes}
          />
        </div>
      </div>
    </div>
  );
}
