"use client"

const BlogCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="flex flex-col md:flex-row">
        {/* Image Skeleton */}
        <div className="md:w-2/5 relative">
          <div className="bg-gray-200 h-64 md:h-full animate-pulse" style={{ aspectRatio: "4/3" }}></div>
        </div>

        {/* Content Skeleton */}
        <div className="md:w-3/5 p-6 md:p-8">
          {/* Category Tag Skeleton */}
          <div className="w-24 h-6 bg-gray-200 rounded-full mb-4 animate-pulse"></div>

          {/* Title Skeleton */}
          <div className="h-8 bg-gray-200 rounded mb-3 animate-pulse"></div>

          {/* Date Skeleton */}
          <div className="flex items-center mb-4">
            <div className="w-5 h-5 rounded-full bg-gray-200 mr-2 animate-pulse"></div>
            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Author Skeleton */}
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 animate-pulse"></div>
            <div className="w-40 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>

          {/* Button Skeleton */}
          <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default BlogCardSkeleton
