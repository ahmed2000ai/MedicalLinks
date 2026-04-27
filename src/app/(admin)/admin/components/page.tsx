"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusChip } from "@/components/ui/status-chip"
import { ProgressStepper } from "@/components/ui/progress-stepper"
import { Timeline } from "@/components/ui/timeline"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FeedbackAlert, CardSkeleton } from "@/components/ui/feedback"
import { MetricCard } from "@/components/ui/action-cards"
import { PageContainer, ContentSection } from "@/components/ui/layout-system"
import { FilterBar, FilterChip, FilterButton } from "@/components/ui/filter-bar"
import { FormSection, FormField } from "@/components/ui/form-section"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, ConfirmDialog } from "@/components/ui/dialog"
import { ApplicationStageBadge, CredentialBadge, ReadinessBadge, OpportunityStatusBadge } from "@/components/ui/domain-badges"
import { KeyValueRow, DetailSection, OpportunityPreviewCard, ProfileSummaryCard } from "@/components/ui/data-display"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  FileText, Plus, ShieldCheck, Mail, Calendar, Briefcase,
  User, Bell, Building, Users
} from "lucide-react"

export default function ComponentsPlayground() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [activeFilter, setActiveFilter] = useState("ALL")

  return (
    <PageContainer>
      <PageHeader
        title="Design System"
        description="Shared UI component library for MedicalLinks GCC. All components are available for use across the platform."
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Design System" }]}
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus size={16} className="mr-2" /> Open Dialog Example
          </Button>
        }
      />

      {/* ================================================================
          1. DOMAIN BADGES — medical recruitment specific
      ================================================================ */}
      <ContentSection title="Domain Badges" description="Medical recruitment domain-specific status indicators.">
        <Card>
          <CardHeader>
            <CardTitle>Application Stage Badges</CardTitle>
            <CardDescription>Maps to the ApplicationStatus enum. Used throughout the recruiter pipeline.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(["NEW", "SCREENING", "QUALIFIED", "NEEDS_DOCUMENTS", "SHORTLIST_SENT", "INTERVIEWING", "OFFER_STAGE", "ONBOARDING", "HIRED", "REJECTED", "ON_HOLD", "DRAFT", "ARCHIVED"] as const).map(s => (
              <ApplicationStageBadge key={s} status={s} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credential & License Badges</CardTitle>
            <CardDescription>For GCC and international medical licensing authorities.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <CredentialBadge authority="SCFHS" status="ACTIVE" />
            <CredentialBadge authority="DHA" status="ACTIVE" />
            <CredentialBadge authority="DOH" status="PENDING" />
            <CredentialBadge authority="MOH Kuwait" status="NOT_HELD" />
            <CredentialBadge authority="GMC" status="ACTIVE" />
            <CredentialBadge authority="QCHP" status="EXPIRED" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Readiness & Opportunity Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <ReadinessBadge readiness="READY_NOW" />
            <ReadinessBadge readiness="NEAR_READY" />
            <ReadinessBadge readiness="FUTURE_PIPELINE" />
            <ReadinessBadge readiness="NOT_A_FIT" />
            <div className="w-px bg-border mx-1" />
            <OpportunityStatusBadge status="ACTIVE" />
            <OpportunityStatusBadge status="PAUSED" />
            <OpportunityStatusBadge status="CLOSED" />
            <OpportunityStatusBadge status="FILLED" />
          </CardContent>
        </Card>
      </ContentSection>

      {/* ================================================================
          2. METRIC / STAT CARDS
      ================================================================ */}
      <ContentSection title="Metric Cards" description="Used on dashboards to surface key indicators.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Active Applications" value="12" description="vs 9 last month" icon={FileText} trend={{ value: "+33%", positive: true }} />
          <MetricCard title="Interviews Scheduled" value="3" description="2 virtual, 1 in-person" icon={Calendar} />
          <MetricCard title="Open Opportunities" value="47" description="Matching your specialty" icon={Briefcase} trend={{ value: "+12%", positive: true }} />
          <MetricCard title="Profile Completeness" value="82%" description="2 sections remaining" icon={User} trend={{ value: "+5%", positive: true }} />
        </div>
      </ContentSection>

      {/* ================================================================
          3. PROFILE SUMMARY CARD
      ================================================================ */}
      <ContentSection title="Profile Summary Card" description="Used to display a doctor's compact profile preview.">
        <div className="grid md:grid-cols-2 gap-4">
          <ProfileSummaryCard
            name="Dr. Ahmed Hassan"
            specialty="Consultant Cardiologist"
            location="London, United Kingdom"
            experience={8}
            readiness="READY_NOW"
            completeness={82}
          />
          <ProfileSummaryCard
            name="Dr. Fatima Al-Nasser"
            specialty="Specialist Pediatrician"
            location="Riyadh, Saudi Arabia"
            experience={5}
            readiness="NEAR_READY"
            completeness={61}
          />
        </div>
      </ContentSection>

      {/* ================================================================
          4. OPPORTUNITY PREVIEW CARDS
      ================================================================ */}
      <ContentSection title="Opportunity Preview Card" description="Used in opportunity browsing views.">
        <div className="grid md:grid-cols-2 gap-4">
          <OpportunityPreviewCard
            title="Consultant Anesthesiologist"
            hospitalName="Al Noor Medical City"
            location="Abu Dhabi, UAE"
            specialty="Anesthesiology"
            employmentType="FULL_TIME"
            salaryRange="AED 60K – 85K/mo"
            status="ACTIVE"
            postedDate="3 days ago"
            matchScore={91}
          />
          <OpportunityPreviewCard
            title="Senior Resident Physician – Internal Medicine"
            hospitalName="King Faisal Specialist Hospital"
            location="Riyadh, Saudi Arabia"
            specialty="Internal Medicine"
            employmentType="FULL_TIME"
            salaryRange="SAR 45K – 65K/mo"
            status="URGENT"
            postedDate="1 week ago"
            matchScore={76}
          />
        </div>
      </ContentSection>

      {/* ================================================================
          5. TABLE
      ================================================================ */}
      <ContentSection title="Table Component" description="Used for dense data lists in recruiter and admin views.">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Readiness</TableHead>
              <TableHead>Application Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: "Dr. Ahmed Hassan", specialty: "Cardiology", license: "SCFHS", readiness: "READY_NOW" as const, status: "INTERVIEWING" as const },
              { name: "Dr. Layla Mansoor", specialty: "Pediatrics", license: "DHA", readiness: "NEAR_READY" as const, status: "SHORTLIST_SENT" as const },
              { name: "Dr. Omar Khalid", specialty: "Anesthesiology", license: "GMC", readiness: "READY_NOW" as const, status: "OFFER_STAGE" as const },
              { name: "Dr. Sara Al-Rawi", specialty: "Oncology", license: "DOH", readiness: "FUTURE_PIPELINE" as const, status: "SCREENING" as const },
            ].map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.specialty}</TableCell>
                <TableCell><CredentialBadge authority={row.license} status="ACTIVE" /></TableCell>
                <TableCell><ReadinessBadge readiness={row.readiness} /></TableCell>
                <TableCell><ApplicationStageBadge status={row.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ContentSection>

      {/* ================================================================
          6. FILTER BAR
      ================================================================ */}
      <ContentSection title="Filter Bar" description="Search and filter UI for opportunity and applicant listing pages.">
        <FilterBar
          searchPlaceholder="Search opportunities, doctors, or hospitals..."
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={
            <>
              {["ALL", "Cardiology", "Anesthesiology", "Pediatrics", "Oncology"].map(f => (
                <FilterChip key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
              ))}
            </>
          }
          actions={<FilterButton label="More Filters" />}
        />
      </ContentSection>

      {/* ================================================================
          7. DETAIL SECTION + KEY-VALUE ROWS
      ================================================================ */}
      <ContentSection title="Detail Section & Key-Value Rows" description="For structured medical profile display pages.">
        <div className="grid md:grid-cols-2 gap-6">
          <DetailSection title="Professional Overview">
            <KeyValueRow label="Full Name" value="Dr. Ahmed Hassan" />
            <KeyValueRow label="Specialty" value="Cardiology" />
            <KeyValueRow label="Total Experience" value="8 years" />
            <KeyValueRow label="Country of Residence" value="United Kingdom" />
            <KeyValueRow label="Nationality" value="Egyptian" />
            <KeyValueRow label="Notice Period" value="3 months" />
          </DetailSection>
          <DetailSection title="License & Credentials">
            <KeyValueRow label="GMC (UK)" value={<CredentialBadge authority="Active" status="ACTIVE" />} />
            <KeyValueRow label="SCFHS Eligibility" value={<CredentialBadge authority="Pending" status="PENDING" />} />
            <KeyValueRow label="DHA" value={<CredentialBadge authority="Not Held" status="NOT_HELD" />} />
            <KeyValueRow label="DataFlow Status" value={<StatusChip status="warning" label="In Progress" />} />
          </DetailSection>
        </div>
      </ContentSection>

      {/* ================================================================
          8. BUTTONS AND INTERACTIVE
      ================================================================ */}
      <ContentSection title="Buttons & Actions">
        <Card>
          <CardContent className="pt-6 flex flex-wrap gap-3">
            <Button>Primary Action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button>
              <Plus size={16} className="mr-2" /> With Icon
            </Button>
          </CardContent>
        </Card>
      </ContentSection>

      {/* ================================================================
          9. FORM SECTION
      ================================================================ */}
      <ContentSection title="Form Section Pattern" description="Structured form input grouping for the profile builder.">
        <Card>
          <CardContent className="pt-6">
            <FormSection
              title="Medical Qualifications"
              description="Enter your primary medical degree and training information."
            >
              <div className="grid md:grid-cols-2 gap-5">
                <FormField label="Degree" htmlFor="degree" required hint="e.g., MBBS, MD, MBChB">
                  <Input id="degree" placeholder="MBBS" />
                </FormField>
                <FormField label="Graduating Institution" htmlFor="institution" required>
                  <Input id="institution" placeholder="Cairo University" />
                </FormField>
                <FormField label="Country of Study" htmlFor="study-country" required>
                  <Input id="study-country" placeholder="Egypt" />
                </FormField>
                <FormField label="Graduation Year" htmlFor="grad-year" hint="Use the format YYYY">
                  <Input id="grad-year" type="number" placeholder="2015" />
                </FormField>
              </div>
              <FormField label="Additional Notes" htmlFor="notes">
                <Textarea id="notes" placeholder="Any additional context about your qualification..." />
              </FormField>
            </FormSection>
          </CardContent>
        </Card>
      </ContentSection>

      {/* ================================================================
          10. WORKFLOW COMPONENTS
      ================================================================ */}
      <ContentSection title="Workflow & Progress">
        <Card>
          <CardHeader>
            <CardTitle>Profile Builder Stepper</CardTitle>
            <CardDescription>Multi-step progress for doctor profile completion.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressStepper
              currentStep={2}
              steps={[
                { id: "1", title: "Personal Info", description: "Basic identity" },
                { id: "2", title: "Qualifications", description: "Degrees & training" },
                { id: "3", title: "Licenses", description: "GCC licensing" },
                { id: "4", title: "Experience", description: "Work history" },
                { id: "5", title: "Preferences", description: "Location & salary" },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline
              items={[
                { id: "1", title: "Application Submitted", timestamp: "Oct 20, 2026", status: "success" },
                { id: "2", title: "Recruiter Screening", description: "Call completed with Sarah Jenkins.", timestamp: "Oct 22, 2026", status: "success" },
                { id: "3", title: "Hospital Interview", description: "Scheduled with Dept. Head, Al Noor Medical City.", timestamp: "Nov 01, 2026", status: "warning" },
                { id: "4", title: "Offer Decision", status: "default" },
              ]}
            />
          </CardContent>
        </Card>
      </ContentSection>

      {/* ================================================================
          11. FEEDBACK STATES
      ================================================================ */}
      <ContentSection title="Feedback Alerts & Empty States">
        <div className="space-y-3">
          <FeedbackAlert type="info" title="Profile Under Review" message="Your credentials are currently being verified by the MedicalLinks team. This typically takes 2–3 business days." />
          <FeedbackAlert type="success" title="Application Submitted" message="Your application to Al Noor Medical City has been received. You will be contacted by your recruiter within 48 hours." />
          <FeedbackAlert type="warning" title="Documents Required" message="You need to upload a valid DataFlow report to proceed with your UAE applications." />
          <FeedbackAlert type="error" title="License Expired" message="Your QCHP license has expired. Please renew it before applying to Qatar-based positions." />
        </div>

        <Card>
          <CardHeader><CardTitle>Empty States</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <EmptyState
              icon={<FileText className="h-6 w-6 text-muted-foreground" />}
              title="No Applications Yet"
              description="You haven't applied to any opportunities. Browse open roles to get started."
              action={<Button>Browse Opportunities</Button>}
            />
            <EmptyState
              icon={<Building className="h-6 w-6 text-muted-foreground" />}
              title="No Hospitals Found"
              description="No hospital records match your current search filters."
              action={<Button variant="outline">Clear Filters</Button>}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Loading Skeletons</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </CardContent>
        </Card>
      </ContentSection>

      {/* ================================================================
          12. DIALOG EXAMPLE
      ================================================================ */}
      <ContentSection title="Dialog / Modal">
        <Card>
          <CardContent className="pt-6 flex gap-3">
            <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>Confirm Dialog</Button>
          </CardContent>
        </Card>
      </ContentSection>

      {/* Modals */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent onClose={() => setDialogOpen(false)} size="md">
          <DialogHeader>
            <DialogTitle>Add License Authority</DialogTitle>
            <DialogDescription>
              Enter details for a GCC medical license or international qualification.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <FormField label="Issuing Authority" htmlFor="authority" required hint="e.g., SCFHS, DHA, DOH, GMC">
              <Input id="authority" placeholder="SCFHS" />
            </FormField>
            <FormField label="License Number" htmlFor="license-num">
              <Input id="license-num" placeholder="SA-20241234" />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Issue Date" htmlFor="issue-date">
                <Input id="issue-date" type="date" />
              </FormField>
              <FormField label="Expiry Date" htmlFor="expiry-date">
                <Input id="expiry-date" type="date" />
              </FormField>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setDialogOpen(false)}>Save License</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Withdraw Application?"
        description="Are you sure you want to withdraw your application to King Faisal Specialist Hospital? This action cannot be undone."
        confirmLabel="Withdraw Application"
        destructive
        onConfirm={() => setConfirmOpen(false)}
      />
    </PageContainer>
  )
}
