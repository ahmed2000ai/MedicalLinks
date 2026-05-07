import { Metadata } from "next"
import Link from "next/link"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { getHospitalShortlist } from "@/features/hospitals/shortlist-actions"
import { ShortlistBoard } from "@/features/hospitals/components/ShortlistBoard"

export const metadata: Metadata = {
  title: "Shortlist Pipeline — MedicalLinks",
  description: "Manage your saved candidates and hiring pipeline.",
}

export default async function ShortlistPage() {
  const candidates = await getHospitalShortlist()

  return (
    <div className="max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <PageHeader
          title="Shortlist Pipeline"
          description="Manage your saved candidates and track them through your internal review stages."
        />
        
        <div className="flex gap-3">
          <Button asChild variant="default" className="gap-2">
            <Link href="/hospitals/search">
              <Search className="h-4 w-4" />
              Discover Candidates
            </Link>
          </Button>
        </div>
      </div>

      <ShortlistBoard candidates={candidates} />
    </div>
  )
}
