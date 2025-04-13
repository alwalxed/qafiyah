import type { ReactNode } from "react"

type LoadingSkeletonProps = {
  count?: number
  height?: string
  className?: string
  children?: ReactNode
}

export function LoadingSkeleton({ count = 5, height = "h-16", className = "mb-2", children }: LoadingSkeletonProps) {
  if (children) {
    return <div className="animate-pulse">{children}</div>
  }

  return (
    <div className="animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`${height} bg-gray-200 rounded-md ${className}`}></div>
      ))}
    </div>
  )
}
