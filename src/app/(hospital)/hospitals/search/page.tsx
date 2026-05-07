import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { Users } from "lucide-react"
import { getHospitalCandidateDirectory, CandidateDirectoryFilterParams } from "@/features/hospitals/search-actions"
import { getHospitalSavedCandidateIds } from "@/features/hospitals/save-actions"
import { CandidateCard } from "@/features/hospitals/components/CandidateCard"
import { CandidateSearchInput } from "@/features/hospitals/components/CandidateSearchInput"
import { CandidateFilters } from "@/features/hospitals/components/CandidateFilters"

export default async function CandidateSearchPage(
  props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const searchParams = await props.searchParams

  const params: CandidateDirectoryFilterParams = {
    keyword: typeof searchParams.q === 'string' ? searchParams.q : undefined,
    country: typeof searchParams.country === 'string' ? searchParams.country : undefined,
    minExperience: searchParams.minExp ? Number(searchParams.minExp) : undefined,
    readiness: searchParams.readiness as CandidateDirectoryFilterParams["readiness"] ?? undefined,
    openToOpportunities: searchParams.availability as CandidateDirectoryFilterParams["openToOpportunities"] ?? undefined,
    relocation: searchParams.relocation === "true" ? true : undefined,
  }

  const [candidates, savedIds] = await Promise.all([
    getHospitalCandidateDirectory(params),
    getHospitalSavedCandidateIds()
  ])

  const hasActiveFilters = !!(params.country || params.minExperience || params.readiness || params.openToOpportunities || params.relocation)

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <PageHeader 
          title="Candidate Pool" 
          description="Search and discover verified doctors available for opportunities." 
        />
        <div className="flex flex-1 items-center justify-end gap-2 w-full md:w-auto">
          <CandidateSearchInput />
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filter Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <CandidateFilters />
        </div>

        {/* Main Feed Area */}
        <div className="flex-1 space-y-4">
          {/* Result count */}
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>
              {candidates.length} candidate{candidates.length !== 1 ? "s" : ""}
              {params.keyword ? ` matching "${params.keyword}"` : ""}
              {hasActiveFilters ? " with active filters" : ""}
            </span>
          </div>

          {candidates.length > 0 ? (
            candidates.map((candidate: any) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                initialSaved={savedIds.has(candidate.id)}
              />
            ))
          ) : (
            <div className="mt-4">
              <EmptyState
                title="No Candidates Found"
                description="Try adjusting your search term or filters to find matching candidates in the pool."
                icon={<Users className="h-10 w-10 text-muted-foreground" />}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
