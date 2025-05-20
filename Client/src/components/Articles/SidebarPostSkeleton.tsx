"use client"

const SidebarPostSkeleton = () => {
  return (
    <div className="flex space-x-3 mb-4">
      <div className="w-20 h-20 rounded-lg bg-gray-200 animate-pulse flex-shrink-0"></div>
      <div className="flex-1">
        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    </div>
  )
}

export default SidebarPostSkeleton
