"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Building, MapPin, DollarSign, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContentSection } from "@/components/ui/layout-system"
import { Card, CardContent } from "@/components/ui/card"
import { EMPLOYMENT_TYPE_LABELS } from "@/features/hospitals/types"
import { applyToOpportunity, toggleSavedOpportunity } from "../actions"

export function LiveOpportunityList({ opportunities, savedOpportunityIds }: { opportunities: any[], savedOpportunityIds: string[] }) {
  const router = useRouter()

  if (opportunities.length === 0) {
    return (
      <div className="p-12 text-center border rounded-lg border-dashed">
        <h3 className="text-lg font-semibold mb-2">No Active Opportunities</h3>
        <p className="text-muted-foreground">Check back soon for new roles matching your profile.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {opportunities.map(opp => {
        const isSaved = savedOpportunityIds.includes(opp.id)
        return (
          <Card key={opp.id} className="hover:border-primary/50 transition-colors flex flex-col h-full cursor-pointer" onClick={() => router.push(`/opportunities/${opp.id}`)}>
            <CardContent className="p-5 flex flex-col h-full">
              <div className="mb-4">
                <h3 className="font-semibold text-lg line-clamp-1">{opp.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-1">{opp.specialty}</p>
              </div>

              <div className="space-y-2 text-sm mt-auto">
                <div className="flex items-center gap-2">
                  <Building size={14} className="text-muted-foreground shrink-0" />
                  <span className="truncate">{opp.hospital.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-muted-foreground shrink-0" />
                  <span className="truncate">{opp.city ? `${opp.city}, ` : ""}{opp.country}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <span className="text-xs font-medium bg-muted px-2 py-1 rounded">
                  {EMPLOYMENT_TYPE_LABELS[opp.employmentType as keyof typeof EMPLOYMENT_TYPE_LABELS] || opp.employmentType}
                </span>
                {isSaved && <span className="text-xs text-primary font-medium">Saved</span>}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
