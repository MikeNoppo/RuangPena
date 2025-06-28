import { Card, CardContent } from "@/components/ui/card"

interface SkeletonLoaderProps {
  count?: number
  className?: string
}

export function SkeletonLoader({ count = 4, className = "" }: SkeletonLoaderProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}

function SkeletonCard() {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Icon Skeleton */}
          <div className="flex-shrink-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
            {/* Title and Date Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              {/* Title Skeleton */}
              <div className="h-5 sm:h-6 bg-gray-200 rounded animate-pulse w-3/4 sm:w-2/3"></div>
              {/* Date Skeleton */}
              <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-20 sm:w-24"></div>
            </div>

            {/* Journal Type Tag Skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-24 sm:w-28"></div>
            </div>

            {/* Content Preview Lines Skeleton */}
            <div className="space-y-2">
              {/* First line - full width */}
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              {/* Second line - 90% width */}
              <div className="h-4 bg-gray-200 rounded animate-pulse w-[90%]"></div>
              {/* Third line - 75% width */}
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Alternative compact version for smaller loading states
export function SkeletonLoaderCompact({ count = 3, className = "" }: SkeletonLoaderProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          {/* Icon */}
          <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
          {/* Date */}
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>
      ))}
    </div>
  )
}
