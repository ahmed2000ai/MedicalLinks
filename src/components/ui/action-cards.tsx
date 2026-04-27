import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: string
    positive?: boolean
  }
  className?: string
}

export function MetricCard({ title, value, description, icon: Icon, trend, className }: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden border-none shadow-sm bg-white hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-primary" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trend && (
              <span className={cn("font-medium", trend.positive ? "text-green-600" : "text-red-600")}>
                {trend.value}
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface ActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  actionLabel: string
  onClick?: () => void
  variant?: "default" | "primary" | "outline"
  className?: string
}

export function ActionCard({ title, description, icon: Icon, actionLabel, onClick, variant = "default", className }: ActionCardProps) {
  return (
    <Card className={cn("flex flex-col h-full bg-white border-none shadow-sm hover:shadow-md transition-all cursor-pointer group", className)} onClick={onClick}>
      <CardHeader className="flex-1">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors">{title}</CardTitle>
        <CardDescription className="mt-2 leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-6">
        <div className={cn(
          "text-sm font-semibold flex items-center gap-1",
          variant === "primary" ? "text-primary" : "text-foreground"
        )}>
          {actionLabel}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </CardContent>
    </Card>
  )
}
