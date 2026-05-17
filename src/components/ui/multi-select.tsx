"use client"

import React, { useState, useRef, useEffect, useId } from "react"
import { Check, ChevronDown, X } from "lucide-react"

export interface SelectOption {
  label: string
  value: string
}

interface MultiSelectProps {
  id?: string
  options: SelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  error?: string
}

export function MultiSelect({
  id,
  options,
  value,
  onChange,
  placeholder = "Select…",
  disabled = false,
  error,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoId = useId()
  const triggerId = id ?? autoId

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val))
    } else {
      onChange([...value, val])
    }
  }

  const remove = (val: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== val))
  }

  const selectedLabels = value
    .map((v) => options.find((o) => o.value === v)?.label ?? v)

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger — div so inner pill <button> elements are valid HTML */}
      <div
        id={triggerId}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault()
            setOpen((o) => !o)
          }
          if (e.key === "Escape") setOpen(false)
        }}
        className={[
          "flex min-h-10 w-full items-center gap-1.5 flex-wrap rounded-md border bg-background px-3 py-1.5 text-sm text-left transition-colors select-none",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
          error ? "border-destructive" : "border-input",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50",
        ].join(" ")}
      >
        {selectedLabels.length === 0 ? (
          <span className="text-muted-foreground flex-1 py-0.5">{placeholder}</span>
        ) : (
          <>
            {selectedLabels.map((label, i) => (
              <span
                key={value[i]}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full"
              >
                {label}
                {!disabled && (
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={(e) => remove(value[i], e)}
                    className="hover:text-destructive transition-colors ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            <span className="flex-1" />
          </>
        )}
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-white shadow-lg overflow-hidden">
          <div className="max-h-56 overflow-y-auto p-1">
            {options.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">No options available</p>
            ) : (
              options.map((opt) => {
                const isSelected = value.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggle(opt.value)}
                    className={[
                      "flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-md transition-colors text-left",
                      isSelected
                        ? "bg-primary/8 text-primary font-medium"
                        : "text-foreground hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex items-center justify-center w-4 h-4 rounded border shrink-0 transition-colors",
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-input bg-background",
                      ].join(" ")}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </span>
                    {opt.label}
                  </button>
                )
              })
            )}
          </div>
          {value.length > 0 && (
            <div className="border-t border-border px-3 py-1.5">
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
