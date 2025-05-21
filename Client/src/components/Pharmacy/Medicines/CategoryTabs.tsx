"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"

interface CategoryTabsProps {
  categories: string[]
  activeCategory: string | null
  onCategorySelect: (category: string | null) => void
}

const CategoryTabs = ({ categories, activeCategory, onCategorySelect }: CategoryTabsProps) => {
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)

  // Check if scroll buttons are needed
  useEffect(() => {
    const checkScroll = () => {
      if (tabsRef.current) {
        const { scrollWidth, clientWidth } = tabsRef.current
        setShowScrollButtons(scrollWidth > clientWidth)
      }
    }

    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [categories])

  // Scroll tabs left or right
  const scrollTabs = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 200
      const currentScroll = tabsRef.current.scrollLeft
      tabsRef.current.scrollTo({
        left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative">
      {/* Left scroll button */}
      {showScrollButtons && (
        <motion.button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 text-gray-600 hover:text-teal-600"
          onClick={() => scrollTabs("left")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      )}

      {/* Categories */}
      <div
        ref={tabsRef}
        className="flex overflow-x-auto py-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex space-x-2 px-2">
          {/* All category tab */}
          <motion.button
            onClick={() => onCategorySelect(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors snap-start ${
              activeCategory === null ? "bg-teal-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Categories
          </motion.button>

          {/* Category tabs */}
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => onCategorySelect(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors snap-start ${
                activeCategory === category
                  ? "bg-teal-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Right scroll button */}
      {showScrollButtons && (
        <motion.button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 text-gray-600 hover:text-teal-600"
          onClick={() => scrollTabs("right")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      )}
    </div>
  )
}

export default CategoryTabs
