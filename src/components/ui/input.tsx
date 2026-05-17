"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { FormFieldContext } from "@/components/ui/form-section"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  const { hasError } = React.useContext(FormFieldContext)
  return (
    <input
      type={type}
      aria-invalid={hasError || undefined}
      className={cn(
        "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        hasError
          ? "border-destructive focus-visible:ring-destructive text-destructive"
          : "border-input focus-visible:ring-ring",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
