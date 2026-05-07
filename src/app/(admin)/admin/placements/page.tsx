import { listPlacementsForAdmin } from "@/features/placements/actions";
import { PlacementStatusBadge } from "@/features/placements/components/PlacementStatusBadge";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, User, Calendar, Building2, Briefcase } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Placements — Admin — MedicalLinks",
  description: "Review and manage all placement records across hospitals.",
};

export default async function AdminPlacementsPage() {
  const res = await listPlacementsForAdmin();
  const placements = res.placements ?? [];
  const confirmedFees = res.confirmedFees ?? 0;
  const pendingFees = res.pendingFees ?? 0;

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-8">
      <PageHeader
        title="Placements"
        description="All hire records reported by hospital partners. Confirm, dispute, or cancel placements to update their commercial status."
      />

      {/* Summary metrics */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: "Total Placements", value: placements.length },
          { label: "Reported (Pending)", value: placements.filter((p) => p.status === "REPORTED").length },
          { label: "Confirmed", value: placements.filter((p) => p.status === "CONFIRMED").length },
          { label: "Disputed / Cancelled", value: placements.filter((p) => ["DISPUTED", "CANCELLED"].includes(p.status)).length },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fee Summary */}
      {(confirmedFees > 0 || pendingFees > 0) && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Confirmed Fee Revenue</p>
              <p className="text-2xl font-bold text-green-800 mt-1">${confirmedFees.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-0.5">Commercially validated</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Pending Review</p>
              <p className="text-2xl font-bold text-blue-800 mt-1">${pendingFees.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-0.5">Awaiting confirmation</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Placement list */}
      {placements.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 mx-auto text-slate-300" />
            <p className="text-slate-500 font-medium">No placements reported yet</p>
            <p className="text-sm text-muted-foreground">
              Hospitals will submit placement records when they hire a candidate through the platform.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {placements.map((p) => {
            const prefs = p.applicantProfile.preferences;
            const isAnon = prefs?.visibility === "ANONYMOUS";
            const doctorName = isAnon
              ? "Confidential Candidate"
              : `${p.applicantProfile.user?.firstName ?? ""} ${p.applicantProfile.user?.lastName ?? ""}`.trim() || "Doctor";

            return (
              <Link key={p.id} href={`/admin/placements/${p.id}`}>
                <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer border-slate-200">
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
                            {doctorName}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            {p.hospital.name}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {new Date(p.hireDate).toLocaleDateString("en-GB", {
                              day: "numeric", month: "short", year: "numeric",
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
                      <div className="shrink-0 text-right space-y-0.5">
                        <p className="text-lg font-bold text-slate-900">
                          {p.currency} {p.feeAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p.currency} {p.monthlySalary.toLocaleString()} × {p.commissionRate}%
                        </p>
                        {p.recordedBy && (
                          <p className="text-xs text-muted-foreground">
                            by {p.recordedBy.firstName} {p.recordedBy.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
