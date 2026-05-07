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
import { CalendarPlus, AlertCircle } from "lucide-react";
import { createInterviewInvitation } from "@/features/interviews/actions";

const GCC_TIMEZONES = [
  { value: "GST", label: "Gulf Standard Time (GST, UTC+4) — UAE, Oman" },
  { value: "AST", label: "Arabia Standard Time (AST, UTC+3) — KSA, Kuwait, Bahrain, Qatar" },
];

interface InviteToInterviewButtonProps {
  applicantProfileId: string;
  candidateName: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function InviteToInterviewButton({
  applicantProfileId,
  candidateName,
  variant = "outline",
  size = "sm",
  className,
}: InviteToInterviewButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    timezone: "GST",
    type: "VIRTUAL" as "VIRTUAL" | "IN_PERSON",
    location: "",
    meetingLink: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError("Interview title is required.");
      return;
    }
    if (!form.date || !form.time) {
      setError("Date and time are required.");
      return;
    }
    if (
      form.type === "VIRTUAL" &&
      !form.meetingLink.trim()
    ) {
      setError("Please provide a meeting link for virtual interviews.");
      return;
    }

    setIsPending(true);
    setError(null);

    const scheduledAt = new Date(`${form.date}T${form.time}:00`).toISOString();

    const res = await createInterviewInvitation({
      applicantProfileId,
      title: form.title,
      scheduledAt,
      timezone: form.timezone,
      type: form.type,
      location: form.location || undefined,
      meetingLink: form.meetingLink || undefined,
      notes: form.notes || undefined,
    });

    if (res.success) {
      setOpen(false);
      setForm({
        title: "",
        date: "",
        time: "",
        timezone: "GST",
        type: "VIRTUAL",
        location: "",
        meetingLink: "",
        notes: "",
      });
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
        onClick={() => setOpen(true)}
      >
        <CalendarPlus className="h-4 w-4 mr-2" />
        Invite to Interview
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Invite to Interview</DialogTitle>
            <DialogDescription>
              Send a structured interview invitation to{" "}
              <span className="font-medium">{candidateName}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="invite-title">Interview Title</Label>
              <Input
                id="invite-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. First Stage Clinical Interview — Cardiology"
              />
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="invite-date">Date</Label>
                <Input
                  id="invite-date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="invite-time">Time</Label>
                <Input
                  id="invite-time"
                  name="time"
                  type="time"
                  value={form.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Timezone */}
            <div className="space-y-1.5">
              <Label htmlFor="invite-timezone">Timezone</Label>
              <select
                id="invite-timezone"
                name="timezone"
                value={form.timezone}
                onChange={handleChange}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-ring focus:outline-none"
              >
                {GCC_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Format */}
            <div className="space-y-1.5">
              <Label htmlFor="invite-type">Interview Format</Label>
              <select
                id="invite-type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-ring focus:outline-none"
              >
                <option value="VIRTUAL">Virtual (Video Call)</option>
                <option value="IN_PERSON">In-Person</option>
              </select>
            </div>

            {/* Conditional: Meeting link or Location */}
            {form.type === "VIRTUAL" ? (
              <div className="space-y-1.5">
                <Label htmlFor="invite-link">Meeting Link</Label>
                <Input
                  id="invite-link"
                  name="meetingLink"
                  value={form.meetingLink}
                  onChange={handleChange}
                  placeholder="https://zoom.us/j/..."
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="invite-location">Location</Label>
                <Input
                  id="invite-location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Building name, floor, address"
                />
              </div>
            )}

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="invite-notes">
                Notes / Agenda{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Textarea
                id="invite-notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Brief agenda, preparation instructions, or context for the candidate."
                className="min-h-[80px] resize-none"
              />
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
              {isPending ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <CalendarPlus className="h-4 w-4 mr-2" />
              )}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
