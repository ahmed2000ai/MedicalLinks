import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Award,
  Globe,
  UserCircle,
  BookOpen,
  Stethoscope,
  FlaskConical,
  MessageSquare,
  FileText,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DetailSection, KeyValueRow } from "@/components/ui/data-display"
import { SaveCandidateButton } from "@/features/hospitals/components/SaveCandidateButton"
import { MessageDoctorButton } from "@/features/hospitals/components/MessageDoctorButton"
import { InviteToInterviewButton } from "@/features/interviews/components/InviteToInterviewButton"
import { MarkAsHiredButton } from "@/features/placements/components/MarkAsHiredButton"
import { getHospitalSafeDoctorPreview } from "@/features/hospitals/candidate-view"
import { getHospitalSavedCandidateIds, getHospitalId } from "@/features/hospitals/save-actions"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profileId: string }>
}) {
  const { profileId } = await params
  try {
    const profile = await getHospitalSafeDoctorPreview(profileId)
    const name = `${profile.user?.firstName || ""} ${profile.user?.lastName || ""}`.trim()
    return {
      title: `${name || "Candidate Profile"} — MedicalLinks`,
      description: `View the hospital-safe profile of this candidate on MedicalLinks.`,
    }
  } catch {
    return { title: "Candidate Profile — MedicalLinks" }
  }
}

export default async function DoctorProfilePage({
  params,
}: {
  params: Promise<{ profileId: string }>
}) {
  const { profileId } = await params

  let profile: Awaited<ReturnType<typeof getHospitalSafeDoctorPreview>>
  try {
    profile = await getHospitalSafeDoctorPreview(profileId)
  } catch {
    notFound()
  }

  // Fetch hospital's saved-candidate set to hydrate the button state
  const [savedIds, hospitalId] = await Promise.all([
    getHospitalSavedCandidateIds(),
    getHospitalId()
  ])
  const isSaved = savedIds.has(profileId)

  const prefs = profile.preferences
  const isAnonymous = prefs?.visibility === "ANONYMOUS"
  const displayName = isAnonymous
    ? "Confidential Candidate"
    : `${profile.user?.firstName || ""} ${profile.user?.lastName || ""}`.trim() ||
      "Medical Professional"

  // Derive initials for avatar
  const initials = isAnonymous
    ? "CC"
    : displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()

  const currentExp = profile.workExperiences?.find((w: any) => w.isCurrent)
  const currentTitle = profile.currentJobTitle || currentExp?.title || "Medical Professional"
  const currentEmployer = profile.currentEmployer || currentExp?.hospitalName

  const readinessMap: Record<string, { label: string; color: string }> = {
    READY_NOW: { label: "Ready Now", color: "bg-green-100 text-green-800 border-green-200" },
    NEAR_READY: { label: "Near Ready", color: "bg-blue-100 text-blue-800 border-blue-200" },
    FUTURE_PIPELINE: { label: "Future Pipeline", color: "bg-slate-100 text-slate-700 border-slate-300" },
    NOT_A_FIT: { label: "Not a Fit", color: "bg-red-100 text-red-700 border-red-200" },
  }
  const readinessInfo = profile.readinessLabel
    ? readinessMap[profile.readinessLabel]
    : null

  return (
    <div className="max-w-5xl mx-auto pb-16">
      {/* Back navigation */}
      <div className="mb-6">
        <Link
          href="/hospitals/search"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Candidate Pool
        </Link>
      </div>

      {/* Profile Header Card */}
      <Card className="mb-8 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400" />
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="h-20 w-20 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-700 font-bold text-2xl shrink-0">
              {isAnonymous ? (
                <UserCircle className="h-10 w-10 text-blue-300" />
              ) : (
                initials
              )}
            </div>

            {/* Identity + Save action */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
                    {prefs?.openToOpportunities === "ACTIVE" && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none shadow-none">
                        Open to Roles
                      </Badge>
                    )}
                    {readinessInfo && (
                      <Badge
                        variant="outline"
                        className={readinessInfo.color}
                      >
                        {readinessInfo.label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-primary font-medium text-base">{currentTitle}</p>
                  {currentEmployer && (
                    <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" />
                      {currentEmployer}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-slate-600">
                    {profile.countryOfResidence && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {profile.currentCity
                          ? `${profile.currentCity}, ${profile.countryOfResidence}`
                          : profile.countryOfResidence}
                      </span>
                    )}
                    {profile.totalYearsExperience !== null &&
                      profile.totalYearsExperience !== undefined && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-slate-400" />
                          {profile.totalYearsExperience} yrs experience
                        </span>
                      )}
                  </div>
                </div>

                {/* Actions: Save, Message, Interview, Hire */}
                <div className="shrink-0 flex flex-col sm:flex-row gap-2">
                  <MessageDoctorButton applicantProfileId={profileId} variant="default" className="w-full sm:w-auto" />
                  <InviteToInterviewButton
                    applicantProfileId={profileId}
                    candidateName={displayName}
                    variant="outline"
                    className="w-full sm:w-auto"
                  />
                  <MarkAsHiredButton
                    applicantProfileId={profileId}
                    candidateName={displayName}
                    hospitalId={hospitalId}  
                    suggestedSource="DIRECT_DISCOVERY"
                    variant="outline"
                    className="w-full sm:w-auto"
                  />
                  <SaveCandidateButton
                    applicantProfileId={profileId}
                    initialSaved={isSaved}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Credential badges */}
          {((profile.medicalLicenses?.length ?? 0) > 0 ||
            (profile.boardCertifications?.length ?? 0) > 0 ||
            prefs?.relocationWilling) && (
            <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-100">
              {prefs?.relocationWilling && (
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600 font-normal shadow-none"
                >
                  Willing to Relocate
                </Badge>
              )}
              {profile.medicalLicenses?.map((lic: any) => (
                <Badge
                  key={lic.id}
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 border-blue-200 font-normal flex gap-1 items-center shadow-none"
                >
                  <ShieldCheck className="h-3 w-3" />
                  {lic.issuingAuthority} License
                </Badge>
              ))}
              {profile.boardCertifications?.map((board: any) => (
                <Badge
                  key={board.id}
                  variant="secondary"
                  className="bg-purple-50 text-purple-700 border-purple-200 font-normal flex gap-1 items-center shadow-none"
                >
                  <Award className="h-3 w-3" />
                  {board.boardName}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two-column body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — main profile sections */}
        <div className="lg:col-span-2 space-y-8">

          {/* Professional Summary */}
          {profile.professionalSummary && (
            <DetailSection title="Professional Summary">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {profile.professionalSummary}
              </p>
            </DetailSection>
          )}

          {/* Work Experience */}
          {profile.workExperiences?.length > 0 && (
            <DetailSection title="Work Experience">
              <div className="space-y-5">
                {profile.workExperiences.map((exp: any) => (
                  <div key={exp.id} className="flex gap-4">
                    <div className="mt-0.5 p-2 rounded-lg bg-blue-50 border border-blue-100 shrink-0 h-fit">
                      <Stethoscope className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-semibold text-slate-900 text-sm">{exp.title}</h4>
                        {exp.isCurrent && (
                          <Badge className="bg-green-100 text-green-700 border-none shadow-none text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-primary font-medium mt-0.5">{exp.hospitalName}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                        {exp.department && <span>{exp.department}</span>}
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {exp.city ? `${exp.city}, ` : ""}
                          {exp.country}
                        </span>
                        <span>
                          {exp.startDate
                            ? new Date(exp.startDate).getFullYear()
                            : "?"}{" "}
                          —{" "}
                          {exp.isCurrent
                            ? "Present"
                            : exp.endDate
                            ? new Date(exp.endDate).getFullYear()
                            : "?"}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </DetailSection>
          )}

          {/* Education */}
          {profile.educations?.length > 0 && (
            <DetailSection title="Education">
              <div className="space-y-4">
                {profile.educations.map((edu: any) => (
                  <div key={edu.id} className="flex gap-4">
                    <div className="mt-0.5 p-2 rounded-lg bg-violet-50 border border-violet-100 shrink-0 h-fit">
                      <GraduationCap className="h-4 w-4 text-violet-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {edu.country}
                        </span>
                        {edu.graduationDate && (
                          <span>{new Date(edu.graduationDate).getFullYear()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DetailSection>
          )}

          {/* Residency Trainings */}
          {profile.residencyTrainings?.length > 0 && (
            <DetailSection title="Residency Training">
              <div className="space-y-4">
                {profile.residencyTrainings.map((r: any) => (
                  <div key={r.id} className="flex gap-4">
                    <div className="mt-0.5 p-2 rounded-lg bg-cyan-50 border border-cyan-100 shrink-0 h-fit">
                      <BookOpen className="h-4 w-4 text-cyan-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{r.programName}</h4>
                      <p className="text-sm text-muted-foreground">{r.institution}</p>
                      <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground mt-1">
                        <span>{r.specialty}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {r.country}
                        </span>
                        {(r.startDate || r.endDate) && (
                          <span>
                            {r.startDate ? new Date(r.startDate).getFullYear() : "?"} —{" "}
                            {r.endDate ? new Date(r.endDate).getFullYear() : "Present"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DetailSection>
          )}

          {/* Fellowship Trainings */}
          {profile.fellowshipTrainings?.length > 0 && (
            <DetailSection title="Fellowship Training">
              <div className="space-y-4">
                {profile.fellowshipTrainings.map((f: any) => (
                  <div key={f.id} className="flex gap-4">
                    <div className="mt-0.5 p-2 rounded-lg bg-amber-50 border border-amber-100 shrink-0 h-fit">
                      <FlaskConical className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{f.programName}</h4>
                      <p className="text-sm text-muted-foreground">{f.institution}</p>
                      <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground mt-1">
                        <span>{f.subspecialty}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {f.country}
                        </span>
                        {(f.startDate || f.endDate) && (
                          <span>
                            {f.startDate ? new Date(f.startDate).getFullYear() : "?"} —{" "}
                            {f.endDate ? new Date(f.endDate).getFullYear() : "Present"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DetailSection>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">

          {/* Quick stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Quick Facts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-0">
                <KeyValueRow
                  label="Experience"
                  value={
                    profile.totalYearsExperience != null
                      ? `${profile.totalYearsExperience} years`
                      : undefined
                  }
                />
                {profile.postSpecialtyExp != null && (
                  <KeyValueRow
                    label="Post-Specialty Exp."
                    value={`${profile.postSpecialtyExp} years`}
                  />
                )}
                <KeyValueRow
                  label="Nationality"
                  value={profile.nationality}
                />
                <KeyValueRow
                  label="Location"
                  value={
                    profile.currentCity
                      ? `${profile.currentCity}, ${profile.countryOfResidence}`
                      : profile.countryOfResidence
                  }
                />
                {profile.noticePeriodDays != null && (
                  <KeyValueRow
                    label="Notice Period"
                    value={
                      profile.noticePeriodDays === 0
                        ? "Immediate"
                        : `${profile.noticePeriodDays} days`
                    }
                  />
                )}
                <KeyValueRow
                  label="Relocation"
                  value={prefs?.relocationWilling ? "Willing" : "Not willing"}
                />
                {prefs?.preferredCountries?.length > 0 && (
                  <KeyValueRow
                    label="Preferred Countries"
                    value={prefs.preferredCountries.join(", ")}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact info — shown only when not hidden by privacy settings */}
          {(!prefs?.hideContactDetails && !isAnonymous) && (
            profile.user?.email || profile.user?.phone
          ) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {profile.user?.email && (
                  <p className="text-sm text-slate-700 break-all">{profile.user.email}</p>
                )}
                {profile.user?.phone && (
                  <p className="text-sm text-slate-700">{profile.user.phone}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Languages */}
          {profile.languages?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang: any) => (
                    <Badge
                      key={lang.id}
                      variant="outline"
                      className="text-xs font-normal"
                    >
                      {lang.language} · {lang.proficiency.charAt(0) + lang.proficiency.slice(1).toLowerCase()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medical Licenses */}
          {profile.medicalLicenses?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Medical Licenses
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {profile.medicalLicenses.map((lic: any) => (
                  <div key={lic.id} className="text-sm">
                    <p className="font-medium text-slate-800">
                      {lic.issuingAuthority}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lic.country}
                      {lic.status ? ` · ${lic.status}` : ""}
                      {lic.expiryDate
                        ? ` · Exp. ${new Date(lic.expiryDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })}`
                        : ""}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Board Certifications */}
          {profile.boardCertifications?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Board Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {profile.boardCertifications.map((board: any) => (
                  <div key={board.id} className="text-sm">
                    <p className="font-medium text-slate-800">{board.boardName}</p>
                    <p className="text-xs text-muted-foreground">
                      {board.specialty} · {board.country}
                      {board.expiryDate
                        ? ` · Exp. ${new Date(board.expiryDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })}`
                        : ""}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Professional Certifications */}
          {profile.certifications?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Additional Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {profile.certifications.map((cert: any) => (
                  <div key={cert.id} className="text-sm">
                    <p className="font-medium text-slate-800">{cert.certificationName}</p>
                    <p className="text-xs text-muted-foreground">
                      {cert.issuingBody}
                      {cert.expiryDate
                        ? ` · Exp. ${new Date(cert.expiryDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })}`
                        : ""}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Document Completeness Summary */}
          {profile.documents?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Document Readiness
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {profile.documents.map((doc: any) => (
                  <div key={doc.id} className="flex items-start justify-between gap-2 text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-slate-800">
                        {doc.title || doc.type.replace(/_/g, " ")}
                      </p>
                      {doc.issuingAuthority && (
                        <p className="text-xs text-muted-foreground">{doc.issuingAuthority}</p>
                      )}
                    </div>
                    {doc.isVerified ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] uppercase font-semibold tracking-wider">
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[10px] uppercase font-semibold tracking-wider">
                        Uploaded
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
