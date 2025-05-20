"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { ArticleResponseDTO } from "../../types/article"
import SidebarPostCard from "./SidebarPostCard"
import SidebarPostSkeleton from "./SidebarPostSkeleton"


interface BlogSidebarProps {
  onSearch?: (query: string) => void
  searchQuery: string
  onCategorySelect?: (category: string) => void
  selectedCategory: string | null
  recentArticles: ArticleResponseDTO[]
  popularArticles: ArticleResponseDTO[]
  loading: boolean
}

const BlogSidebar = ({
  onSearch,
  searchQuery,
  onCategorySelect,
  selectedCategory,
  recentArticles,
  popularArticles,
  loading,
}: BlogSidebarProps) => {
  const [searchFocused, setSearchFocused] = useState(false)

  // Mock categories with counts
  const categories = [
    { name: "Cardiology", count: 1 },
    { name: "Mental Health", count: 1 },
    { name: "Pediatrics", count: 1 },
  ]

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {onSearch &&
      <motion.div
        className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 ${searchFocused ? "shadow-lg ring-2 ring-blue-300" : ""}`}
        whileHover={{ y: -5 }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Search Articles</h3>
        <div className="relative">

  <input
    type="text"
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => onSearch(e.target.value)}
    onFocus={() => setSearchFocused(true)}
    onBlur={() => setSearchFocused(false)}
    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />

          <motion.button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.button>
        </div>
      </motion.div>}

      {/* Categories */}
      {onCategorySelect && (
        <motion.div className="bg-white rounded-xl shadow-md p-6" whileHover={{ y: -5 }}>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Categories</h3>
        <ul className="space-y-3">
          {categories.map((category, index) => (
            <motion.li
              key={category.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <motion.button
                onClick={() => onCategorySelect(category.name)}
                className={`flex items-center justify-between w-full py-2 px-3 rounded-lg transition-colors ${
                  selectedCategory === category.name ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{category.name}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    selectedCategory === category.name ? "bg-blue-200 text-blue-700" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {category.count}
                </span>
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </motion.div>
      )}


      {/* Recent Posts */}
      <motion.div className="bg-white rounded-xl shadow-md p-6" whileHover={{ y: -5 }}>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Posts</h3>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading-recent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {[...Array(4)].map((_, index) => (
                <SidebarPostSkeleton key={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content-recent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {recentArticles.slice(0, 4).map((article, index) => (
                <SidebarPostCard key={article.id} article={article} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Popular Posts */}
      <motion.div className="bg-white rounded-xl shadow-md p-6" whileHover={{ y: -5 }}>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Posts</h3>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading-popular" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {[...Array(4)].map((_, index) => (
                <SidebarPostSkeleton key={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content-popular"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {popularArticles.slice(0, 4).map((article, index) => (
                <SidebarPostCard key={article.id} article={article} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default BlogSidebar
