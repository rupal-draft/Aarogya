"use client"

import type React from "react"
import { motion } from "framer-motion"

interface BadgeProps {
  children: React.ReactNode
  variant?: "low" | "moderate" | "high" | "default" | "success" | "warning"
  className?: string
  pulse?: boolean
}

const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "", pulse = false }) => {
  const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"

  const variantClasses = {
    low: "health-gradient text-white shadow-lg",
    moderate: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg",
    high: "danger-gradient text-white shadow-lg",
    success: "health-gradient text-white shadow-lg",
    warning: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg",
    default: "bg-gray-100 text-gray-800",
  }

  return (
    <motion.span
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${pulse ? "animate-pulse-slow" : ""}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </motion.span>
  )
}

export default Badge
