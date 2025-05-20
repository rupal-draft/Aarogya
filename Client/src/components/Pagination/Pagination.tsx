"use client"

import { motion } from "framer-motion"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  // Generate page numbers
  const getPageNumbers = () => {
    const pages = []

    // Always show first page
    if (currentPage > 3) {
      pages.push(1)
      if (currentPage > 4) {
        pages.push("...")
      }
    }

    // Show pages around current page
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pages.push(i)
    }

    // Always show last page
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        pages.push("...")
      }
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <motion.div
      className="flex justify-center items-center space-x-1 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Previous Button */}
      <motion.button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-10 h-10 rounded-full ${
          currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
        }`}
        whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
        whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) =>
        typeof page === "number" ? (
          <motion.button
            key={index}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentPage === page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {page}
          </motion.button>
        ) : (
          <span key={index} className="text-gray-500">
            {page}
          </span>
        ),
      )}

      {/* Next Button */}
      <motion.button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-10 h-10 rounded-full ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
        }`}
        whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
        whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </motion.div>
  )
}

export default Pagination
