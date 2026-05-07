"use client"

import { useState } from "react"
import type { HospitalListItem } from "../types"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FilterBar, FilterChip } from "@/components/ui/filter-bar"
import { ContentSection } from "@/components/ui/layout-system"
import { StatusChip } from "@/components/ui/status-chip"
import { Building2, MapPin } from "lucide-react"

export function HospitalListClient({ hospitals }: { hospitals: HospitalListItem[] }) {
  const router = useRouter()
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL")
  const [search, setSearch] = useState("")

  const filtered = hospitals.filter(h => {
    if (filter === "ACTIVE" && !h.isActive) return false
    if (filter === "INACTIVE" && h.isActive) return false
    if (search) {
      const q = search.toLowerCase()
      if (!h.name.toLowerCase().includes(q) && !(h.country || "").toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <ContentSection
      title="All Hospitals"
      description={`${hospitals.length} organizations registered in the system.`}
      actions={
        <FilterBar
          searchPlaceholder="Search hospitals..."
          searchValue={search}
          onSearchChange={setSearch}
          filters={
            <>
              <FilterChip label="All" active={filter === "ALL"} onClick={() => setFilter("ALL")} />
              <FilterChip label="Active" active={filter === "ACTIVE"} onClick={() => setFilter("ACTIVE")} />
              <FilterChip label="Inactive" active={filter === "INACTIVE"} onClick={() => setFilter("INACTIVE")} />
            </>
          }
        />
      }
    >
      {filtered.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground text-sm">No hospitals found.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hospital Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Opportunities</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(h => (
              <TableRow 
                key={h.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/admin/hospitals/${h.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{h.name}</div>
                      {h.type && <div className="text-xs text-muted-foreground mt-0.5">{h.type}</div>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    {h.city ? `${h.city}, ${h.country}` : h.country || "Unknown"}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusChip 
                    label={h.isActive ? "Active" : "Inactive"} 
                    status={h.isActive ? "success" : "default"} 
                  />
                </TableCell>
                <TableCell className="text-right font-medium">
                  {h.opportunityCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </ContentSection>
  )
}
