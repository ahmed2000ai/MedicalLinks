import { CardSkeleton, Skeleton } from "@/components/ui/feedback"
import { PageContainer } from "@/components/ui/layout-system"

export default function DashboardLoading() {
  return (
    <PageContainer>
      {/* Welcome skeleton */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      {/* Quick Start skeleton */}
      <Skeleton className="h-44 w-full rounded-xl" />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <CardSkeleton />
        </div>
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </PageContainer>
  )
}
