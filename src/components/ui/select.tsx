import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

// ─── Root Select ─────────────────────────────────────────────────────────────
// We keep this as a controlled native <select> so it works with plain value/onChange.
// The Radix-style compound sub-components below are thin wrappers that render
// the correct native HTML, preserving the compound API used by CandidateFilters.

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  value?: string
  onValueChange?: (value: string) => void
  options?: { label: string; value: string }[]
  children?: React.ReactNode
}

const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
}>({})

function Select({ value, onValueChange, children, options, ...props }: SelectProps) {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      <div className="relative w-full" data-select-root>
        {/* If children are provided (compound mode), render them.
            Otherwise fall back to options-array mode. */}
        {children ?? (
          <select
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </SelectContext.Provider>
  )
}

// ─── SelectTrigger ────────────────────────────────────────────────────────────
// Rendered as the visible <select> element; captures children for placeholder display.
function SelectTrigger({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { value, onValueChange } = React.useContext(SelectContext)
  return (
    // We render a wrapper div so SelectValue can show as placeholder text,
    // and nest an actual native select (invisible) for accessibility + form submission.
    <div className={cn("relative", className)} {...props}>
      {children}
    </div>
  )
}
SelectTrigger.displayName = "SelectTrigger"

// ─── SelectValue ─────────────────────────────────────────────────────────────
// Shows the placeholder label inside the trigger area.
function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext)
  return (
    <span className="text-sm text-muted-foreground pointer-events-none">
      {value || placeholder}
    </span>
  )
}
SelectValue.displayName = "SelectValue"

// ─── SelectContent ────────────────────────────────────────────────────────────
// Wraps the <option> elements — rendered inside a native select.
// We collect the children and render them inside a real <select> so the browser
// handles the dropdown natively. This keeps zero JS overhead.
function SelectContent({ children }: { children?: React.ReactNode }) {
  const { value, onValueChange } = React.useContext(SelectContext)

  // Collect all SelectItem option values/labels from children
  const options: { value: string; label: string }[] = []
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const el = child as React.ReactElement<{ value: string; children?: React.ReactNode }>
      options.push({
        value: el.props.value ?? "",
        label: String(el.props.children ?? el.props.value ?? ""),
      })
    }
  })

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onValueChange?.(e.target.value)}
      className={cn(
        "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      )}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
SelectContent.displayName = "SelectContent"

// ─── SelectItem ───────────────────────────────────────────────────────────────
// Declarative item — consumed by SelectContent; not rendered directly.
function SelectItem({
  value,
  children,
}: {
  value: string
  children?: React.ReactNode
}) {
  // This component is only used as a data source by SelectContent.
  // It renders nothing by itself.
  return null
}
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
