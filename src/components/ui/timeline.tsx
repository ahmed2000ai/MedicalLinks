import * as React from "react"
import { cn } from "@/lib/utils"

export interface TimelineItem {
  id: string
  title: string
  description?: React.ReactNode
  timestamp?: string
  status?: "default" | "success" | "warning" | "error"
  icon?: React.ReactNode
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[]
}

export function Timeline({ items, className, ...props }: TimelineProps) {
  return (
    <div className={cn("space-y-6 relative border-l-2 border-muted ml-3", className)} {...props}>
      {items.map((item, index) => {
        
        let dotColor = "bg-muted"
        if (item.status === "success") dotColor = "bg-green-500"
        else if (item.status === "warning") dotColor = "bg-yellow-500"
        else if (item.status === "error") dotColor = "bg-red-500"
        else if (item.status === "default" || index === 0) dotColor = "bg-primary"

        return (
          <div key={item.id} className="relative pl-6">
            <span className={cn(
              "absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-background",
              dotColor
            )}>
              {item.icon && <span className="text-white scale-75">{item.icon}</span>}
            </span>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
              <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
              {item.timestamp && (
                <time className="text-xs text-muted-foreground mt-1 sm:mt-0">{item.timestamp}</time>
              )}
            </div>
            {item.description && (
              <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
