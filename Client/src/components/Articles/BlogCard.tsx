"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import type { ArticleResponseDTO } from "../../types/article"
import { formatDate } from "../../utils/dateUtils"


interface BlogCardProps {
  article: ArticleResponseDTO
  index: number
}

const BlogCard = ({ article, index }: BlogCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  // Format the date
  const formattedDate = formatDate(article.createdAt)

  // Truncate content for preview
  const truncatedContent = article.content.length > 200 ? article.content.substring(0, 200) + "..." : article.content

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-2/5 relative overflow-hidden">
          <motion.div animate={{ scale: isHovered ? 1.05 : 1 }} transition={{ duration: 0.5 }} className="h-full">
            <img
              src={article.imageUrl || "/placeholder.svg?height=400&width=600"}
              alt={article.title}
              className="w-full h-full object-cover object-center"
              style={{ aspectRatio: "4/3" }}
            />
          </motion.div>

          {/* Hover overlay with link icon */}
          <motion.div
            className="absolute inset-0 bg-blue-600/70 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to={`/blogs/${article.id}`} className="text-white">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-full p-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="md:w-3/5 p-6 md:p-8">
          {/* Category Tag */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-4"
          >
            {article.category}
          </motion.div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
            <Link to={`/blogs/${article.id}`}>{article.title}</Link>
          </h3>

          {/* Date */}
          <div className="flex items-center text-gray-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{formattedDate}</span>
          </div>

          {/* Author */}
          {article.doctor && (
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-blue-500">
                <img
                  src={article.doctor.imageUrl || "/placeholder.svg?height=100&width=100"}
                  alt={`${article.doctor.firstName} ${article.doctor.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-gray-700 font-medium">
                Dr. {article.doctor.firstName} {article.doctor.lastName}
              </span>
            </div>
          )}

          {/* Content */}
          <p className="text-gray-600 mb-6">{truncatedContent}</p>

          {/* Read More Button */}
          <Link to={`/blogs/${article.id}`}>
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              Read More
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </motion.svg>
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default BlogCard
