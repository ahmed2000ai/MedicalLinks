import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon | React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center bg-muted/20 border border-dashed rounded-lg",
        className
      )} 
      {...props}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4 text-muted-foreground">
          {React.isValidElement(icon) ? (
            icon
          ) : (typeof icon === "function" || (typeof icon === "object" && icon !== null && "$$typeof" in icon)) ? (
            React.createElement(icon as React.ElementType, { className: "h-6 w-6 text-muted-foreground" })
          ) : (
            icon as React.ReactNode
          )}
        </div>
      )}
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
