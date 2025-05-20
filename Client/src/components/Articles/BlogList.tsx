"use client"

import { motion, AnimatePresence } from "framer-motion"
import BlogCard from "./BlogCard"
import BlogCardSkeleton from "./BlogCardSkeleton"
import type { ArticleResponseDTO } from "../../types/article"
import Pagination from "../Pagination/Pagination"

interface BlogListProps {
  articles: ArticleResponseDTO[]
  loading: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const BlogList = ({ articles, loading, currentPage, totalPages, onPageChange }: BlogListProps) => {
  // Animation variants for staggered list
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {[...Array(3)].map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </motion.div>
        ) : articles.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 rounded-lg p-8 text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-blue-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Articles Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter to find what you're looking for.</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {articles.map((article, index) => (
              <BlogCard key={article.id} article={article} index={index} />
            ))}

            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BlogList
