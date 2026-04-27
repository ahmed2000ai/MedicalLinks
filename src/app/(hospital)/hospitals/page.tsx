import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { Hospital } from "lucide-react"

export default function HospitalsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Hospitals" description="Manage hospital partners and their specific requirements." />
      <EmptyState 
        title="No Hospitals Configured" 
        description="Hospital entities will be managed here." 
        icon={<Hospital className="h-10 w-10 text-muted-foreground" />}
      />
    </div>
  )
}
