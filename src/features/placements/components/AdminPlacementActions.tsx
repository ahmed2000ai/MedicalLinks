"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { updatePlacementStatus } from "@/features/placements/actions";
import { PlacementStatus } from "@prisma/client";

interface AdminPlacementActionsProps {
  placementId: string;
  currentStatus: PlacementStatus;
}

export function AdminPlacementActions({
  placementId,
  currentStatus,
}: AdminPlacementActionsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [activeAction, setActiveAction] = useState<PlacementStatus | null>(null);

  if (["CONFIRMED", "CANCELLED"].includes(currentStatus)) return null;

  const handleAction = async (status: PlacementStatus) => {
    setIsPending(true);
    setError(null);
    const res = await updatePlacementStatus(placementId, status, adminNote || undefined);
    if (res.success) {
      setActiveAction(null);
      setAdminNote("");
      router.refresh();
    } else {
      setError(res.error ?? "An error occurred");
    }
    setIsPending(false);
  };

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        Admin Actions
      </h3>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Admin note field */}
      <div className="space-y-1.5">
        <Label htmlFor="admin-note" className="text-xs text-muted-foreground">
          Admin Note (optional)
        </Label>
        <Textarea
          id="admin-note"
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          placeholder="Add a note to record reason for this status change."
          className="min-h-[60px] resize-none text-sm"
          disabled={isPending}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {currentStatus !== "CONFIRMED" && (
          <Button
            size="sm"
            className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => handleAction("CONFIRMED")}
            disabled={isPending}
          >
            <CheckCircle className="h-4 w-4" />
            Confirm Placement
          </Button>
        )}
        {currentStatus !== "DISPUTED" && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50"
            onClick={() => handleAction("DISPUTED")}
            disabled={isPending}
          >
            <AlertTriangle className="h-4 w-4" />
            Mark as Disputed
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 border-red-300 text-red-600 hover:bg-red-50"
          onClick={() => handleAction("CANCELLED")}
          disabled={isPending}
        >
          <XCircle className="h-4 w-4" />
          Cancel Placement
        </Button>
      </div>

      {isPending && (
        <p className="text-xs text-muted-foreground">Updating status…</p>
      )}
    </div>
  );
}
