import { Badge } from "@/components/ui/badge";
import { PlacementStatus } from "@prisma/client";

const STATUS_CONFIG: Record<PlacementStatus, { label: string; className: string }> = {
  DRAFT: {
    label: "Draft",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  REPORTED: {
    label: "Reported",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  DISPUTED: {
    label: "Disputed",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-600 border-red-200 line-through",
  },
};

export function PlacementStatusBadge({ status }: { status: PlacementStatus }) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: "" };
  return (
    <Badge variant="outline" className={`${config.className} font-medium`}>
      {config.label}
    </Badge>
  );
}
