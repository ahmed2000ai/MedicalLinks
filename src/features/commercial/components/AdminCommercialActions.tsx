"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Save } from "lucide-react";
import { updateCommercialRecordStatus } from "@/features/commercial/actions";
import { CommercialRecordStatus } from "@prisma/client";

interface AdminCommercialActionsProps {
  recordId: string;
  currentStatus: CommercialRecordStatus;
  issueDate?: Date | null;
  dueDate?: Date | null;
  paymentDate?: Date | null;
  initialNotes?: string | null;
}

export function AdminCommercialActions({
  recordId,
  currentStatus,
  issueDate,
  dueDate,
  paymentDate,
  initialNotes,
}: AdminCommercialActionsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    status: currentStatus,
    issueDate: issueDate ? issueDate.toISOString().split("T")[0] : "",
    dueDate: dueDate ? dueDate.toISOString().split("T")[0] : "",
    paymentDate: paymentDate ? paymentDate.toISOString().split("T")[0] : "",
    notes: initialNotes || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleStatusChange = (val: string) => {
    setForm({ ...form, status: val as CommercialRecordStatus });
    setError(null);
  };

  const handleSave = async () => {
    setIsPending(true);
    setError(null);

    const res = await updateCommercialRecordStatus(recordId, {
      status: form.status,
      issueDate: form.issueDate || null,
      dueDate: form.dueDate || null,
      paymentDate: form.paymentDate || null,
      notes: form.notes,
    });

    if (res.success) {
      router.refresh();
    } else {
      setError(res.error ?? "An error occurred");
    }

    setIsPending(false);
  };

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        Update Commercial State
      </h3>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Status */}
        <div className="space-y-1.5">
          <Label>Invoice Status</Label>
          <Select value={form.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ISSUED">Issued</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
              <SelectItem value="WAIVED">Waived</SelectItem>
              <SelectItem value="DISPUTED">Disputed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dates */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="issueDate" className="text-xs">
              Issue Date
            </Label>
            <Input
              id="issueDate"
              name="issueDate"
              type="date"
              value={form.issueDate}
              onChange={handleChange}
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dueDate" className="text-xs">
              Due Date
            </Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              className="bg-white"
            />
          </div>
        </div>

        {/* Payment Date */}
        <div className="space-y-1.5">
          <Label htmlFor="paymentDate" className="text-xs">
            Payment Received Date
          </Label>
          <Input
            id="paymentDate"
            name="paymentDate"
            type="date"
            value={form.paymentDate}
            onChange={handleChange}
            className="bg-white"
          />
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label htmlFor="notes" className="text-xs text-muted-foreground">
            Internal Notes
          </Label>
          <Textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Record transaction IDs, follow-up context, or reasons for dispute/waiver."
            className="min-h-[80px] resize-none bg-white text-sm"
          />
        </div>

        <Button onClick={handleSave} disabled={isPending} className="w-full">
          {isPending ? (
            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
