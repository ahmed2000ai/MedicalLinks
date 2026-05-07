import { Badge } from "@/components/ui/badge";
import { InterviewInvitationStatus } from "@prisma/client";

const STATUS_CONFIG: Record<
  InterviewInvitationStatus,
  { label: string; className: string }
> = {
  INVITED: {
    label: "Invitation Sent",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  ACCEPTED: {
    label: "Accepted",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  DECLINED: {
    label: "Declined",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  RESCHEDULE_REQUESTED: {
    label: "Reschedule Requested",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-teal-50 text-teal-700 border-teal-200",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-500 border-slate-200 line-through",
  },
};

export function InterviewStatusBadge({
  status,
}: {
  status: InterviewInvitationStatus;
}) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-600",
  };

  return (
    <Badge variant="outline" className={`${config.className} font-medium`}>
      {config.label}
    </Badge>
  );
}
