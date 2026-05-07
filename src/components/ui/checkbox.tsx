import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn(
          "relative flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center",
          "rounded border border-input bg-background",
          "transition-colors",
          checked ? "border-primary bg-primary" : "hover:border-primary/60",
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only"
          {...props}
        />
        {checked && <Check className="h-3 w-3 text-primary-foreground stroke-[3]" />}
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
