"use client"

import { motion } from "framer-motion"

const Preloader = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke="#3b82f6"
              strokeWidth="8"
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <motion.path
              d="M 50,30 L 50,70 M 30,50 L 70,50"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
          </svg>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-blue-600 font-medium text-lg"
        >
          Loading Healthcare Services...
        </motion.p>
      </div>
    </div>
  )
}

export default Preloader
