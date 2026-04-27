"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Building, MapPin, Calendar, ExternalLink } from "lucide-react"
import { ContentSection } from "@/components/ui/layout-system"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FilterBar, FilterChip } from "@/components/ui/filter-bar"
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from "../types"

export function RecruiterApplicationList({ applications }: { applications: any[] }) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [search, setSearch] = useState("")

  const filtered = applications.filter(app => {
    if (statusFilter !== "ALL" && app.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !app.applicantProfile.user.firstName?.toLowerCase().includes(q) &&
        !app.applicantProfile.user.lastName?.toLowerCase().includes(q) &&
        !app.opportunity.title.toLowerCase().includes(q) &&
        !app.opportunity.hospital.name.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  return (
    <ContentSection
      title="Application Pipeline"
      description="Manage applicant flow through recruitment stages."
      actions={
        <FilterBar
          searchPlaceholder="Search candidates, roles, or hospitals..."
          searchValue={search}
          onSearchChange={setSearch}
          filters={
            <>
              <FilterChip label="All" active={statusFilter === "ALL"} onClick={() => setStatusFilter("ALL")} />
              <FilterChip label="New" active={statusFilter === "NEW"} onClick={() => setStatusFilter("NEW")} />
              <FilterChip label="In Review" active={statusFilter === "SCREENING"} onClick={() => setStatusFilter("SCREENING")} />
              <FilterChip label="Submitted" active={statusFilter === "SHORTLIST_SENT"} onClick={() => setStatusFilter("SHORTLIST_SENT")} />
              <FilterChip label="Interviewing" active={statusFilter === "INTERVIEWING"} onClick={() => setStatusFilter("INTERVIEWING")} />
            </>
          }
        />
      }
    >
      {filtered.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground text-sm border rounded-lg border-dashed">No applications found matching criteria.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Opportunity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(app => {
              const statusStyle = APPLICATION_STATUS_COLORS[app.status as keyof typeof APPLICATION_STATUS_COLORS] || { text: "text-gray-700", bg: "bg-gray-100" }
              
              return (
                <TableRow 
                  key={app.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/recruiter/applications/${app.id}`)}
                >
                  <TableCell>
                    <div className="font-semibold">{app.applicantProfile.user.firstName} {app.applicantProfile.user.lastName}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{app.applicantProfile.currentJobTitle || "General"} · {app.applicantProfile.countryOfResidence || "Intl."}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{app.opportunity.title}</div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <Building size={12} className="shrink-0" />
                      <span className="truncate max-w-[200px]">{app.opportunity.hospital.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text}`}>
                      {APPLICATION_STATUS_LABELS[app.status as keyof typeof APPLICATION_STATUS_LABELS]}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(app.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <ExternalLink size={16} className="inline-block text-muted-foreground hover:text-primary transition-colors" />
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
