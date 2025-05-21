"use client"

import { motion } from "framer-motion"

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <div className="absolute top-0 left-0 w-full h-full border-4 border-teal-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-teal-600 rounded-full"></div>
      </motion.div>
      <p className="mt-4 text-gray-600">Loading medicines...</p>
    </div>
  )
}

export default LoadingSpinner
