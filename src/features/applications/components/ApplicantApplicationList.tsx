"use client"

import { useRouter } from "next/navigation"
import { Building, Calendar, FileText } from "lucide-react"
import { ContentSection } from "@/components/ui/layout-system"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from "../types"

export function ApplicantApplicationList({ applications }: { applications: any[] }) {
  const router = useRouter()

  if (applications.length === 0) {
    return (
      <div className="p-12 text-center border rounded-lg border-dashed">
        <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
        <p className="text-muted-foreground text-sm">Explore opportunities and submit your profile to apply.</p>
      </div>
    )
  }

  return (
    <ContentSection title="Your Applications" description="Track the status of your submitted profiles.">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Hospital</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Next Steps</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map(app => {
            const statusStyle = APPLICATION_STATUS_COLORS[app.status as keyof typeof APPLICATION_STATUS_COLORS] || { text: "text-gray-700", bg: "bg-gray-100" }
            const upcomingInterview = app.interviews?.find((i: any) => new Date(i.scheduledAt) > new Date())
            
            return (
              <TableRow 
                key={app.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/applications/${app.id}`)}
              >
                <TableCell>
                  <div className="font-semibold text-foreground">{app.opportunity.title}</div>
                  <div className="text-xs text-muted-foreground">{app.opportunity.specialty}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building size={14} className="shrink-0" />
                    <span>{app.opportunity.hospital.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text}`}>
                    {APPLICATION_STATUS_LABELS[app.status as keyof typeof APPLICATION_STATUS_LABELS] || app.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(app.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {upcomingInterview ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded w-fit">
                      <Calendar size={12} /> Interview Scheduled
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FileText size={12} /> Under Review
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </ContentSection>
  )
}
