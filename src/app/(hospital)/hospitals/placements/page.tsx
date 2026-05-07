import { listPlacementsForHospital } from "@/features/placements/actions";
import { PlacementStatusBadge } from "@/features/placements/components/PlacementStatusBadge";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, DollarSign, User, Calendar, Briefcase, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Placements — MedicalLinks",
  description: "Track hires and placement records submitted by your hospital.",
};

export default async function HospitalPlacementsPage() {
  const res = await listPlacementsForHospital();
  const placements = res.placements ?? [];

  const totalFeeConfirmed = placements
    .filter((p) => p.status === "CONFIRMED")
    .reduce((s, p) => s + p.feeAmount, 0);
  const totalFeePending = placements
    .filter((p) => p.status === "REPORTED")
    .reduce((s, p) => s + p.feeAmount, 0);

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-8">
      <PageHeader
        title="Placements"
        description="Hires you have recorded through MedicalLinks. Submitted placements are reviewed by our team."
      />

      {/* Fee Summary */}
      {placements.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Total Placements", value: placements.length.toString(), sub: "all time" },
            {
              label: "Confirmed Fees",
              value: totalFeeConfirmed > 0 ? `$${totalFeeConfirmed.toLocaleString()}` : "—",
              sub: "commercially validated",
            },
            {
              label: "Pending Review",
              value: totalFeePending > 0 ? `$${totalFeePending.toLocaleString()}` : "—",
              sub: "awaiting admin confirmation",
            },
          ].map(({ label, value, sub }) => (
            <Card key={label}>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {placements.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 mx-auto text-slate-300" />
            <p className="text-slate-500 font-medium">No placements recorded yet</p>
            <p className="text-sm text-muted-foreground">
              Use the <strong>Mark as Hired</strong> action from the{" "}
              <Link href="/hospitals/shortlist" className="text-primary underline">
                Shortlist
              </Link>{" "}
              or a candidate profile to record a placement.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {placements.map((p) => {
            const prefs = p.applicantProfile.preferences;
            const isAnon = prefs?.visibility === "ANONYMOUS";
            const name = isAnon
              ? "Confidential Candidate"
              : `${p.applicantProfile.user?.firstName ?? ""} ${p.applicantProfile.user?.lastName ?? ""}`.trim() ||
                "Doctor";

            return (
              <Card key={p.id} className="hover:shadow-md transition-shadow border-slate-200">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{p.jobTitle}</h3>
                        <PlacementStatusBadge status={p.status} />
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          {name}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(p.hireDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {p.opportunity && (
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                            {p.opportunity.title}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Fee block */}
                    <div className="shrink-0 text-right space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                        Placement Fee
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {p.currency} {p.feeAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.currency} {p.monthlySalary.toLocaleString()} ×{" "}
                        {p.commissionRate}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
