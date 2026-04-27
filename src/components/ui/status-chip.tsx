import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusChipVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      status: {
        success: "border-transparent bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
        warning: "border-transparent bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20",
        error: "border-transparent bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
        info: "border-transparent bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10",
        default: "border-transparent bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

export interface StatusChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusChipVariants> {
  label: string
  icon?: React.ReactNode
}

function StatusChip({ className, status, label, icon, ...props }: StatusChipProps) {
  return (
    <div className={cn(statusChipVariants({ status }), className)} {...props}>
      {icon && <span className="mr-1.5 flex items-center">{icon}</span>}
      {label}
    </div>
  )
}

export { StatusChip, statusChipVariants }
