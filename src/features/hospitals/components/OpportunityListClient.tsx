"use client"

import { useState } from "react"
import type { OpportunityListItem } from "../types"
import { OPPORTUNITY_STATUS_LABELS, OPPORTUNITY_STATUS_COLORS } from "../types"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FilterBar, FilterChip } from "@/components/ui/filter-bar"
import { ContentSection } from "@/components/ui/layout-system"
import { Building, MapPin, Users } from "lucide-react"

export function OpportunityListClient({ opportunities }: { opportunities: OpportunityListItem[] }) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [search, setSearch] = useState("")

  const filtered = opportunities.filter(o => {
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !o.title.toLowerCase().includes(q) &&
        !o.specialty.toLowerCase().includes(q) &&
        !o.hospitalName.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  return (
    <ContentSection
      title="All Vacancies"
      description="Active roles across all hospital partners."
      actions={
        <FilterBar
          searchPlaceholder="Search roles, specialties, or hospitals..."
          searchValue={search}
          onSearchChange={setSearch}
          filters={
            <>
              <FilterChip label="All" active={statusFilter === "ALL"} onClick={() => setStatusFilter("ALL")} />
              <FilterChip label="Intake" active={statusFilter === "INTAKE"} onClick={() => setStatusFilter("INTAKE")} />
              <FilterChip label="Published" active={statusFilter === "ACTIVE"} onClick={() => setStatusFilter("ACTIVE")} />
              <FilterChip label="Closed" active={statusFilter === "CLOSED"} onClick={() => setStatusFilter("CLOSED")} />
            </>
          }
        />
      }
    >
      {filtered.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground text-sm border rounded-lg border-dashed">No opportunities found matching criteria.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Title</TableHead>
              <TableHead>Hospital</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Apps</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(o => {
              const statusStyle = OPPORTUNITY_STATUS_COLORS[o.status] || { text: "text-gray-700", bg: "bg-gray-100" }
              
              return (
                <TableRow 
                  key={o.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/admin/opportunities/${o.id}`)}
                >
                  <TableCell>
                    <div className="font-semibold">{o.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{o.seniority ? `${o.seniority} · ${o.specialty}` : o.specialty}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Building size={14} className="text-muted-foreground shrink-0" />
                      <span className="truncate max-w-[200px]">{o.hospitalName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin size={14} />
                      {o.city ? `${o.city}, ${o.country}` : o.country}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text}`}>
                      {OPPORTUNITY_STATUS_LABELS[o.status]}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md text-sm font-medium">
                      <Users size={14} className="text-muted-foreground" />
                      {o.applicationCount}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </ContentSection>
  )
}
