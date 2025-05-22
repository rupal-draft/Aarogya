"use client"

import type React from "react"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"

interface EmptyStateProps {
  title: string
  description: string
  icon: React.ReactNode
  actionText?: string
  actionLink?: string
  onAction?: () => void
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, actionText, actionLink, onAction }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
      >
        {icon}
      </motion.div>

      <motion.h2
        className="text-xl font-semibold text-gray-800 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.h2>

      <motion.p
        className="text-gray-600 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {description}
      </motion.p>

      {(actionText && actionLink) || onAction ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              {actionText}
            </button>
          )}
        </motion.div>
      ) : null}
    </motion.div>
  )
}

export default EmptyState
