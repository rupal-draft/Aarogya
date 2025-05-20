"use client"

import { motion } from "framer-motion"

const BlogDetailSkeleton = () => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 md:p-8">
        {/* Title Skeleton */}
        <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-6 animate-pulse"></div>

        {/* Author and Date Skeleton */}
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse mr-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        {/* Featured Image Skeleton */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <div className="w-full h-80 bg-gray-200 animate-pulse"></div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4 mb-8">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>

        {/* Tags Skeleton */}
        <div className="flex flex-wrap gap-2 mt-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>

        {/* Navigation Skeleton */}
        <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Share Section Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
          <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex gap-2">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section Skeleton */}
      <div className="bg-gray-50 p-6 md:p-8 border-t border-gray-100">
        {/* Comments Title Skeleton */}
        <div className="h-8 bg-gray-200 rounded w-40 mb-6 animate-pulse"></div>

        {/* Comments List Skeleton */}
        <div className="space-y-6 mb-10">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="flex gap-4 bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="flex-grow space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse mt-3"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Comment Form Skeleton */}
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="h-32 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="h-12 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  )
}

export default BlogDetailSkeleton
