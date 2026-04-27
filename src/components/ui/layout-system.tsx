import * as React from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <div className={cn("max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8", className)} {...props}>
      {children}
    </div>
  )
}

interface ContentSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  actions?: React.ReactNode
}

export function ContentSection({ title, description, actions, children, className, ...props }: ContentSectionProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4">
          <div>
            {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

export function Typography({ children, variant = "body", className }: { children: React.ReactNode, variant?: "h1" | "h2" | "h3" | "h4" | "label" | "body" | "hint", className?: string }) {
  const variants = {
    h1: "text-3xl font-bold tracking-tight text-foreground",
    h2: "text-2xl font-semibold tracking-tight text-foreground",
    h3: "text-xl font-semibold text-foreground",
    h4: "text-lg font-medium text-foreground",
    label: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
    body: "text-base text-foreground",
    hint: "text-sm text-muted-foreground"
  }

  return <div className={cn(variants[variant], className)}>{children}</div>
}
