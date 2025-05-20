"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import type { ArticleResponseDTO } from "../../types/article"
import { formatDate } from "../../utils/dateUtils"


interface SidebarPostCardProps {
  article: ArticleResponseDTO
  index: number
}

const SidebarPostCard = ({ article, index }: SidebarPostCardProps) => {
  const formattedDate = formatDate(article.createdAt)

  return (
    <motion.div
      className="flex space-x-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ x: 5 }}
    >
      <motion.div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0" whileHover={{ scale: 1.05 }}>
        <img
          src={article.imageUrl || "/placeholder.svg?height=100&width=100"}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="flex-1">
        <span className="text-xs text-gray-500">{formattedDate}</span>
        <h4 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
          <Link to={`/blogs/${article.id}`}>{article.title}</Link>
        </h4>
      </div>
    </motion.div>
  )
}

export default SidebarPostCard
