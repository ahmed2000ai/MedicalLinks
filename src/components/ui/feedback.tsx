import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react"

type FeedbackType = "info" | "success" | "warning" | "error"

interface FeedbackAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type: FeedbackType
  title?: string
  message: string
  dismissible?: boolean
}

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle
}

const variants = {
  info: "bg-blue-50 text-blue-700 border-blue-200",
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  error: "bg-red-50 text-red-700 border-red-200"
}

export function FeedbackAlert({ type, title, message, className, ...props }: FeedbackAlertProps) {
  const Icon = icons[type]
  
  return (
    <div className={cn("flex items-start gap-3 p-4 rounded-lg border text-sm", variants[type], className)} {...props}>
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="space-y-1">
        {title && <h5 className="font-semibold leading-none tracking-tight">{title}</h5>}
        <div className="leading-relaxed opacity-90">{message}</div>
      </div>
    </div>
  )
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/50", className)}
      {...props}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl bg-white p-6 shadow-sm border border-transparent">
      <Skeleton className="h-4 w-[150px]" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
