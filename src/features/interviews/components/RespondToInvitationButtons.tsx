"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { respondToInvitation } from "@/features/interviews/actions";
import { useRouter } from "next/navigation";

interface RespondToInvitationButtonsProps {
  invitationId: string;
  currentStatus: string;
}

export function RespondToInvitationButtons({
  invitationId,
  currentStatus,
}: RespondToInvitationButtonsProps) {
  const router = useRouter();
  const [activeAction, setActiveAction] = useState<
    "ACCEPTED" | "DECLINED" | "RESCHEDULE_REQUESTED" | null
  >(null);
  const [note, setNote] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canRespond = ["INVITED", "RESCHEDULE_REQUESTED"].includes(currentStatus);
  if (!canRespond) return null;

  const handleSubmit = async () => {
    if (!activeAction) return;
    if (
      activeAction === "DECLINED" ||
      activeAction === "RESCHEDULE_REQUESTED"
    ) {
      if (!note.trim()) {
        setError(
          activeAction === "DECLINED"
            ? "Please briefly explain why you are declining."
            : "Please indicate your preferred alternative time or dates."
        );
        return;
      }
    }

    setIsPending(true);
    setError(null);

    const res = await respondToInvitation(invitationId, activeAction, note);

    if (res.success) {
      setActiveAction(null);
      setNote("");
      router.refresh();
    } else {
      setError(res.error ?? "An error occurred. Please try again.");
    }

    setIsPending(false);
  };

  const dialogTitles: Record<string, string> = {
    ACCEPTED: "Confirm Acceptance",
    DECLINED: "Decline Invitation",
    RESCHEDULE_REQUESTED: "Request Reschedule",
  };

  const dialogDescriptions: Record<string, string> = {
    ACCEPTED:
      "By accepting, you confirm your availability for this interview. The hospital will be notified.",
    DECLINED:
      "Please briefly explain why you are unable to attend. This helps the hospital plan next steps.",
    RESCHEDULE_REQUESTED:
      "Please suggest alternative dates or times. The hospital will review and follow up.",
  };

  const notePlaceholders: Record<string, string> = {
    ACCEPTED: "Optional: any preparation notes or questions for the panel.",
    DECLINED: "e.g. Prior commitment, not available on this date.",
    RESCHEDULE_REQUESTED:
      "e.g. I am available on weekday mornings (GST). Alternative dates: 12 June or 15 June.",
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => setActiveAction("ACCEPTED")}
          className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="h-4 w-4" />
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setActiveAction("RESCHEDULE_REQUESTED")}
          className="gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50"
        >
          <Clock className="h-4 w-4" />
          Request Reschedule
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setActiveAction("DECLINED")}
          className="gap-1.5 border-red-300 text-red-600 hover:bg-red-50"
        >
          <XCircle className="h-4 w-4" />
          Decline
        </Button>
      </div>

      <Dialog
        open={activeAction !== null}
        onOpenChange={(o) => {
          if (!o) { setActiveAction(null); setNote(""); setError(null); }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {activeAction ? dialogTitles[activeAction] : ""}
            </DialogTitle>
            {activeAction && (
              <DialogDescription>
                {dialogDescriptions[activeAction]}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-3 py-2">
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="response-note">
                {activeAction === "ACCEPTED"
                  ? "Note (optional)"
                  : "Note (required)"}
              </Label>
              <Textarea
                id="response-note"
                value={note}
                onChange={(e) => { setNote(e.target.value); setError(null); }}
                placeholder={activeAction ? notePlaceholders[activeAction] : ""}
                className="min-h-[90px] resize-none"
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setActiveAction(null); setNote(""); setError(null); }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className={
                activeAction === "ACCEPTED"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : activeAction === "DECLINED"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : ""
              }
            >
              {isPending ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : null}
              {activeAction === "ACCEPTED"
                ? "Confirm Acceptance"
                : activeAction === "DECLINED"
                ? "Decline Invitation"
                : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
