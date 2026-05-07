import { Badge } from "@/components/ui/badge";
import { CommercialRecordStatus } from "@prisma/client";

const STATUS_CONFIG: Record<
  CommercialRecordStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Draft",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  ISSUED: {
    label: "Issued",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  PAID: {
    label: "Paid",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  OVERDUE: {
    label: "Overdue",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  WAIVED: {
    label: "Waived",
    className: "bg-slate-100 text-slate-500 border-slate-200",
  },
  DISPUTED: {
    label: "Disputed",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-400 border-slate-200 line-through",
  },
};

export function CommercialStatusBadge({
  status,
}: {
  status: CommercialRecordStatus;
}) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: "" };
  return (
    <Badge variant="outline" className={`${config.className} font-medium`}>
      {config.label}
    </Badge>
  );
}
