import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Settings" description="Manage your account preferences." />
      <EmptyState 
        title="Settings Offline" 
        description="Configuration options are not available yet." 
        icon={<Settings className="h-10 w-10 text-muted-foreground" />}
      />
    </div>
  )
}
