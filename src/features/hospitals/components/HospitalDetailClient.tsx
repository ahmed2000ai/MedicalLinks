"use client"

import { ContentSection } from "@/components/ui/layout-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusChip } from "@/components/ui/status-chip"
import { Button } from "@/components/ui/button"
import { ApplicationStageBadge } from "@/components/ui/domain-badges"
import { MapPin, Globe, Building, Plus, Briefcase, Trash2 } from "lucide-react"
import Link from "next/link"
import { useTransition, useState } from "react"
import { createLocation, deleteLocation, createDepartment, deleteDepartment } from "../actions"

export function HospitalDetailClient({ hospital }: { hospital: any }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status & Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <StatusChip label={hospital.isActive ? "Active" : "Inactive"} status={hospital.isActive ? "success" : "default"} />
              <span className="text-sm font-medium">{hospital.type || "Unspecified Type"}</span>
            </div>
            {hospital.website && (
              <a href={hospital.website} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1.5">
                <Globe size={14} /> Website
              </a>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">About / Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground line-clamp-2">{hospital.description || "No public description provided."}</p>
            {hospital.internalNotes && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Internal Notes</p>
                <p className="text-sm text-muted-foreground">{hospital.internalNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Locations & Departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContentSection title="Locations" description="Physical hospital facilities.">
          <div className="space-y-3">
            {hospital.locations.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center border rounded-lg border-dashed">No locations added.</p>
            ) : (
              hospital.locations.map((loc: any) => (
                <div key={loc.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-muted-foreground" size={18} />
                    <div>
                      <div className="font-medium text-sm">
                        {loc.city}, {loc.country}
                        {loc.isPrimary && <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Primary</span>}
                      </div>
                      {loc.address && <div className="text-xs text-muted-foreground">{loc.address}</div>}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => startTransition(() => deleteLocation(loc.id, hospital.id))}
                    disabled={isPending}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))
            )}
            <form action={(data) => startTransition(() => createLocation(hospital.id, data))} className="flex items-center gap-2 mt-2">
              <input name="city" placeholder="City" required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
              <input name="country" placeholder="Country" defaultValue={hospital.country || ""} required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
              <Button size="sm" type="submit" disabled={isPending}>Add</Button>
            </form>
          </div>
        </ContentSection>

        <ContentSection title="Departments" description="Clinical departments for role grouping.">
          <div className="space-y-3">
            {hospital.departments.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center border rounded-lg border-dashed">No departments added.</p>
            ) : (
              hospital.departments.map((dept: any) => (
                <div key={dept.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                    <Building className="text-muted-foreground" size={18} />
                    <div>
                      <div className="font-medium text-sm">{dept.name}</div>
                      <div className="text-xs text-muted-foreground">{dept._count.opportunities} opportunities</div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => startTransition(() => deleteDepartment(dept.id, hospital.id))}
                    disabled={isPending || dept._count.opportunities > 0}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))
            )}
            <form action={(data) => startTransition(() => createDepartment(hospital.id, data))} className="flex items-center gap-2 mt-2">
              <input name="name" placeholder="Department Name" required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
              <Button size="sm" type="submit" disabled={isPending}>Add</Button>
            </form>
          </div>
        </ContentSection>
      </div>

      {/* Recent Opportunities */}
      <ContentSection 
        title="Opportunities" 
        description="Roles managed at this hospital."
        actions={
          <Link href={`/admin/opportunities/new?hospitalId=${hospital.id}`}>
            <Button size="sm" className="gap-2"><Plus size={14} /> New Opportunity</Button>
          </Link>
        }
      >
        {hospital.opportunities.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm border rounded-lg border-dashed">No opportunities listed yet.</div>
        ) : (
          <div className="space-y-3">
            {hospital.opportunities.map((opp: any) => (
              <Link key={opp.id} href={`/admin/opportunities/${opp.id}`}>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors bg-card group">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-lg shrink-0">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{opp.title}</h4>
                      <p className="text-sm text-muted-foreground">{opp.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium">{opp._count.applications} apps</p>
                      <p className="text-xs text-muted-foreground">{new Date(opp.createdAt).toLocaleDateString()}</p>
                    </div>
                    <ApplicationStageBadge status={opp.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </ContentSection>
    </div>
  )
}
