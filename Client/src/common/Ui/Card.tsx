"use client"

import type React from "react"
import { motion } from "framer-motion"

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: boolean
  glass?: boolean
  hover?: boolean
  gradient?: boolean
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = true,
  glass = false,
  hover = true,
  gradient = false,
}) => {
  const baseClasses = glass
    ? "glass-card"
    : gradient
      ? "animated-gradient text-white"
      : "bg-white shadow-lg border border-gray-100"

  const paddingClasses = padding ? "p-6" : ""
  const hoverClasses = hover ? "hover:shadow-xl hover:-translate-y-1" : ""

  return (
    <motion.div
      className={`${baseClasses} ${paddingClasses} ${hoverClasses} rounded-2xl transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -4 } : {}}
    >
      {children}
    </motion.div>
  )
}

export default Card
