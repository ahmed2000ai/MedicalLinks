"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  createPlacementRecord,
  getDefaultCommissionForHospital,
} from "@/features/placements/actions";
import { PlacementSource } from "@prisma/client";

const SOURCE_LABELS: Record<PlacementSource, string> = {
  DIRECT_DISCOVERY: "Direct Discovery (Candidate Pool)",
  SHORTLIST_BASED: "Shortlist Progression",
  INTERVIEW_BASED: "Interview Outcome",
  OPPORTUNITY_BASED: "Opportunity Application",
};

const CURRENCIES = ["USD", "AED", "SAR", "QAR", "KWD", "BHD", "OMR"];

interface MarkAsHiredButtonProps {
  applicantProfileId: string;
  candidateName: string;
  hospitalId: string;
  defaultCommissionRate?: number | null;
  interviewInvitationId?: string;
  opportunityId?: string;
  suggestedSource?: PlacementSource;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function MarkAsHiredButton({
  applicantProfileId,
  candidateName,
  hospitalId,
  defaultCommissionRate,
  interviewInvitationId,
  opportunityId,
  suggestedSource = "DIRECT_DISCOVERY",
  variant = "outline",
  size = "sm",
  className,
}: MarkAsHiredButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    jobTitle: "",
    hireDate: today,
    monthlySalary: "",
    currency: "USD",
    commissionRate: defaultCommissionRate?.toString() ?? "",
    source: suggestedSource,
    notes: "",
    submitNow: true,
  });

  const monthlySalaryNum = parseFloat(form.monthlySalary) || 0;
  const commissionRateNum = parseFloat(form.commissionRate) || 0;
  const feeAmount =
    monthlySalaryNum > 0 && commissionRateNum > 0
      ? (monthlySalaryNum * (commissionRateNum / 100)).toFixed(2)
      : null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    setError(null);
  };

  const handleOpen = async () => {
    // Try to load default commission if not passed as prop
    if (!defaultCommissionRate && !form.commissionRate) {
      const result = await getDefaultCommissionForHospital(hospitalId);
      if (result) {
        setForm((prev) => ({ ...prev, commissionRate: result.toString() }));
      }
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.jobTitle.trim()) {
      setError("Job title is required.");
      return;
    }
    if (!form.hireDate) {
      setError("Hire date is required.");
      return;
    }
    if (!form.monthlySalary || parseFloat(form.monthlySalary) <= 0) {
      setError("Monthly salary must be a positive amount.");
      return;
    }
    if (!form.commissionRate || parseFloat(form.commissionRate) <= 0) {
      setError("Commission rate is required.");
      return;
    }

    setIsPending(true);
    setError(null);

    const res = await createPlacementRecord({
      applicantProfileId,
      jobTitle: form.jobTitle,
      hireDate: form.hireDate,
      monthlySalary: parseFloat(form.monthlySalary),
      currency: form.currency,
      commissionRate: parseFloat(form.commissionRate),
      source: form.source as PlacementSource,
      opportunityId: opportunityId || undefined,
      interviewInvitationId: interviewInvitationId || undefined,
      notes: form.notes || undefined,
      submitNow: form.submitNow,
    });

    if (res.success) {
      setOpen(false);
      router.refresh();
    } else {
      setError(res.error ?? "An error occurred. Please try again.");
    }

    setIsPending(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleOpen}
      >
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Mark as Hired
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Placement — {candidateName}</DialogTitle>
            <DialogDescription>
              Create a placement record for this hire. The fee amount will be
              calculated automatically based on the salary and commission rate.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {/* Role/Job Title */}
            <div className="space-y-1.5">
              <Label htmlFor="p-jobTitle">Job Title / Role</Label>
              <Input
                id="p-jobTitle"
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Consultant Cardiologist"
              />
            </div>

            {/* Hire Date */}
            <div className="space-y-1.5">
              <Label htmlFor="p-hireDate">Hire / Start Date</Label>
              <Input
                id="p-hireDate"
                name="hireDate"
                type="date"
                value={form.hireDate}
                onChange={handleChange}
              />
            </div>

            {/* Salary + Currency */}
            <div className="space-y-1.5">
              <Label>Monthly Salary</Label>
              <div className="flex gap-2">
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="border border-input rounded-md px-3 py-2 text-sm bg-background w-24 shrink-0 focus:ring-2 focus:ring-ring focus:outline-none"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <Input
                  name="monthlySalary"
                  type="number"
                  min="0"
                  step="100"
                  value={form.monthlySalary}
                  onChange={handleChange}
                  placeholder="e.g. 25000"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Commission Rate */}
            <div className="space-y-1.5">
              <Label htmlFor="p-commissionRate">
                Commission Rate (%){" "}
                {defaultCommissionRate && (
                  <span className="text-xs text-muted-foreground font-normal">
                    — agreement default: {defaultCommissionRate}%
                  </span>
                )}
              </Label>
              <Input
                id="p-commissionRate"
                name="commissionRate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.commissionRate}
                onChange={handleChange}
                placeholder="e.g. 8.33"
              />
            </div>

            {/* Fee calculation preview */}
            {feeAmount && (
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm">
                <p className="text-green-700 font-medium">Calculated Placement Fee</p>
                <p className="text-2xl font-bold text-green-800 mt-1">
                  {form.currency} {Number(feeAmount).toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  {form.currency} {Number(form.monthlySalary).toLocaleString()} ×{" "}
                  {form.commissionRate}% = {form.currency}{" "}
                  {Number(feeAmount).toLocaleString()}
                </p>
              </div>
            )}

            {/* Attribution source */}
            <div className="space-y-1.5">
              <Label htmlFor="p-source">Placement Source</Label>
              <select
                id="p-source"
                name="source"
                value={form.source}
                onChange={handleChange}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-ring focus:outline-none"
              >
                {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="p-notes">
                Notes{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Textarea
                id="p-notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any additional context about this placement."
                className="min-h-[70px] resize-none"
              />
            </div>

            {/* Submit mode */}
            <div className="flex items-center gap-3 p-3 rounded-md border border-border bg-slate-50">
              <input
                type="checkbox"
                id="p-submitNow"
                name="submitNow"
                checked={form.submitNow}
                onChange={handleChange}
                className="h-4 w-4 rounded"
              />
              <div>
                <Label
                  htmlFor="p-submitNow"
                  className="text-sm font-medium cursor-pointer"
                >
                  Submit for admin review immediately
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Unchecked saves as Draft. You can submit later from Placements.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending && (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              {form.submitNow ? "Submit Placement" : "Save as Draft"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
