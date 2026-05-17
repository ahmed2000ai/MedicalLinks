"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, HelpCircle, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Context that lets child inputs know whether their parent FormField has an error
export const FormFieldContext = React.createContext<{ hasError: boolean }>({ hasError: false })

// -------------------------------------------------------------------------
// FormSection — groups logically related fields in a card
// -------------------------------------------------------------------------

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

// -------------------------------------------------------------------------
// FormField — wraps a single label + input + optional hint + error
// -------------------------------------------------------------------------

interface FormFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
  className?: string
}

export function FormField({ label, htmlFor, required, hint, error, children, className }: FormFieldProps) {
  return (
    <FormFieldContext.Provider value={{ hasError: !!error }}>
      <div className={cn("space-y-1.5", className)}>
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-foreground leading-none"
        >
          {label}
          {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
        </label>
        {children}
        {hint && !error && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <HelpCircle size={12} className="shrink-0" />
            {hint}
          </p>
        )}
        {error && (
          <p className="text-xs text-destructive flex items-center gap-1" role="alert">
            <AlertCircle size={12} className="shrink-0" />
            {error}
          </p>
        )}
      </div>
    </FormFieldContext.Provider>
  )
}

// -------------------------------------------------------------------------
// RepeatableEntry — for multi-item lists (education, work history, licenses)
// -------------------------------------------------------------------------

interface RepeatableEntryProps {
  title: string
  description?: string
  items: React.ReactNode[]
  onAdd: () => void
  onRemove: (index: number) => void
  addLabel?: string
  emptyLabel?: string
  className?: string
}

export function RepeatableEntry({
  title,
  description,
  items,
  onAdd,
  onRemove,
  addLabel = "Add Entry",
  emptyLabel = "No entries added yet.",
  className
}: RepeatableEntryProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAdd} className="gap-1.5">
          <Plus size={14} /> {addLabel}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="relative border border-border rounded-lg p-4 bg-white">
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-destructive transition-colors rounded"
                aria-label="Remove entry"
              >
                <Trash2 size={14} />
              </button>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------------------------
// HelperText / FieldError — standalone helpers for use outside FormField
// -------------------------------------------------------------------------

export function HelperText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-xs text-muted-foreground flex items-center gap-1", className)}>
      <HelpCircle size={12} className="shrink-0" />
      {children}
    </p>
  )
}

export function FieldError({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-xs text-destructive flex items-center gap-1", className)} role="alert">
      <AlertCircle size={12} className="shrink-0" />
      {children}
    </p>
  )
}
