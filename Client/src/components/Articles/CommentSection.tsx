"use client"

import { motion } from "framer-motion"
import type { ArticleCommentResponseDTO } from "../../types/article"
import { formatDate } from "../../utils/dateUtils"


interface CommentSectionProps {
  comments: ArticleCommentResponseDTO[]
}

const CommentSection = ({ comments }: CommentSectionProps) => {
  return (
    <div className="mb-10">
      <motion.h3
        className="text-2xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Comments ({comments.length})
      </motion.h3>

      {comments.length === 0 ? (
        <motion.div
          className="text-center py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              className="flex gap-4 bg-white p-6 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="flex-shrink-0">
                <motion.div
                  className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500"
                  whileHover={{ scale: 1.1 }}
                >
                  <img
                    src={comment.userResponseDto.imageUrl || "/placeholder.svg?height=100&width=100"}
                    alt={`${comment.userResponseDto.firstName} ${comment.userResponseDto.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">
                    {comment.userResponseDto.firstName} {comment.userResponseDto.lastName}
                  </h4>
                  <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-gray-600">{comment.comment}</p>

                <motion.button
                  className="mt-3 text-blue-600 text-sm font-medium flex items-center"
                  whileHover={{ x: 5 }}
                >
                  Reply
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSection
