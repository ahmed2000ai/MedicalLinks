import React from "react"
import { CheckCircle2, ChevronRight } from "lucide-react"

export interface TabConfig {
  id: string
  title: string
  description?: string
  hasErrors?: boolean
  isComplete?: boolean
}

interface ProfileSectionTabNavProps {
  tabs: TabConfig[]
  activeTab: string
  onTabChange: (id: string) => void
}

export function ProfileSectionTabNav({ tabs, activeTab, onTabChange }: ProfileSectionTabNavProps) {
  const activeIndex = tabs.findIndex((t) => t.id === activeTab)

  return (
    <nav className="flex flex-col gap-1 p-3">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id
        const isPast = index < activeIndex

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={[
              "group flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : tab.hasErrors
                ? "text-destructive hover:bg-destructive/8 hover:text-destructive"
                : isPast
                ? "text-slate-600 hover:bg-slate-100"
                : "text-muted-foreground hover:bg-slate-100 hover:text-slate-800",
            ].join(" ")}
          >
            {/* Step number / status icon */}
            <span
              className={[
                "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 transition-colors",
                isActive
                  ? "bg-white/20 text-white"
                  : tab.hasErrors
                  ? "bg-destructive/10 text-destructive"
                  : isPast
                  ? "bg-teal-100 text-teal-700"
                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200",
              ].join(" ")}
            >
              {isPast && !tab.hasErrors ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </span>

            {/* Label */}
            <span className="text-sm font-medium flex-1 leading-snug">{tab.title}</span>

            {/* Active indicator chevron */}
            {isActive && <ChevronRight className="w-4 h-4 shrink-0 opacity-70" />}

            {/* Error dot */}
            {tab.hasErrors && !isActive && (
              <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
