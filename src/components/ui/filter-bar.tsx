"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// -------------------------------------------------------------------------
// FilterBar — search + optional filter chip row
// -------------------------------------------------------------------------

interface FilterBarProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  filters?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function FilterBar({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters,
  actions,
  className,
}: FilterBarProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-3 items-start sm:items-center", className)}>
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      {/* Inline filters */}
      {filters && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters}
        </div>
      )}

      {/* Right-side actions */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------------------------
// FilterChip — selectable filter pill
// -------------------------------------------------------------------------

interface FilterChipProps {
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export function FilterChip({ label, active, onClick, className }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-white text-slate-600 border-border hover:border-primary/50 hover:text-primary",
        className
      )}
    >
      {label}
    </button>
  )
}

// -------------------------------------------------------------------------
// SortButton — a small icon-button for triggering sort/filter drawers
// -------------------------------------------------------------------------

export function FilterButton({ onClick, label = "Filters", className }: { onClick?: () => void; label?: string; className?: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn("gap-2 bg-white", className)}
    >
      <SlidersHorizontal size={15} />
      {label}
    </Button>
  )
}
