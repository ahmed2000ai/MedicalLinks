import { listCommercialRecordsForAdmin } from "@/features/commercial/actions";
import { CommercialStatusBadge } from "@/features/commercial/components/CommercialStatusBadge";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, User, FileText, Calendar } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Commercial Records — Admin — MedicalLinks",
  description: "Track and manage invoices and placement fees.",
};

export default async function AdminCommercialListPage() {
  const res = await listCommercialRecordsForAdmin();
  const records = res.records ?? [];
  const totalOutstanding = res.totalOutstanding ?? 0;
  const totalPaid = res.totalPaid ?? 0;

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-8">
      <PageHeader
        title="Commercial Records"
        description="Manage the financial and invoicing state for all confirmed placements."
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Total Records
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {records.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">
              Outstanding (Issued & Overdue)
            </p>
            <p className="text-2xl font-bold text-amber-800 mt-1">
              ${totalOutstanding.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-green-700 uppercase tracking-wide">
              Total Paid
            </p>
            <p className="text-2xl font-bold text-green-800 mt-1">
              ${totalPaid.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {records.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center space-y-3">
            <FileText className="h-10 w-10 mx-auto text-slate-300" />
            <p className="text-slate-500 font-medium">
              No commercial records yet
            </p>
            <p className="text-sm text-muted-foreground">
              Records are automatically generated when a placement is confirmed.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {records.map((r) => {
            const prefs = r.applicantProfile.preferences;
            const doctorName =
              prefs?.visibility === "ANONYMOUS"
                ? "Confidential Candidate"
                : `${r.applicantProfile.user?.firstName ?? ""} ${
                    r.applicantProfile.user?.lastName ?? ""
                  }`.trim() || "Doctor";

            return (
              <Link key={r.id} href={`/admin/commercial/${r.id}`}>
                <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer border-slate-200">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">
                            {r.placement.jobTitle}
                          </span>
                          <CommercialStatusBadge status={r.status} />
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            {r.hospital.name}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            {doctorName}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            Hire:{" "}
                            {new Date(r.placement.hireDate).toLocaleDateString(
                              "en-GB",
                              { month: "short", year: "numeric" }
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right space-y-0.5">
                        <p className="text-lg font-bold text-slate-900">
                          {r.currency} {r.feeAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {r.dueDate &&
                          ["ISSUED", "OVERDUE"].includes(r.status)
                            ? `Due: ${new Date(r.dueDate).toLocaleDateString()}`
                            : r.paymentDate && r.status === "PAID"
                            ? `Paid: ${new Date(
                                r.paymentDate
                              ).toLocaleDateString()}`
                            : `Created: ${new Date(
                                r.createdAt
                              ).toLocaleDateString()}`}
                        </p>
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
