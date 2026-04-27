"use client"

import { MatchResult, MATCH_BAND_COLORS, MATCH_BAND_LABELS } from "../types"
import { ShieldCheck, ShieldAlert, Shield, AlertCircle } from "lucide-react"

export function MatchIndicator({ match, showReasons = false }: { match: MatchResult, showReasons?: boolean }) {
  const styles = MATCH_BAND_COLORS[match.band]
  const label = MATCH_BAND_LABELS[match.band]

  const Icon = match.band === "STRONG" ? ShieldCheck 
             : match.band === "GOOD" ? Shield 
             : match.band === "PARTIAL" ? AlertCircle 
             : ShieldAlert

  return (
    <div className={`p-4 rounded-xl border ${styles.bg} ${styles.border}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-background/50 ${styles.text}`}>
            <Icon size={20} />
          </div>
          <div>
            <h4 className={`font-bold text-sm ${styles.text}`}>{label}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Based on your profile</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-black tracking-tight ${styles.text}`}>{match.score}</span>
          <span className={`text-xs font-semibold ${styles.text}`}>/100</span>
        </div>
      </div>

      {showReasons && match.reasons.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <ul className="space-y-1.5">
            {match.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                {r.type === "POSITIVE" && <span className="text-emerald-600 font-bold shrink-0">+</span>}
                {r.type === "NEGATIVE" && <span className="text-red-600 font-bold shrink-0">-</span>}
                {r.type === "NEUTRAL" && <span className="text-amber-600 font-bold shrink-0">•</span>}
                <span className="text-muted-foreground">{r.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
