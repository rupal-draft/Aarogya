"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import type { HTMLMotionProps } from "framer-motion"

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "glass"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  children: React.ReactNode
  icon?: React.ReactNode
  glow?: boolean
}


const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  icon,
  glow = false,
  ...props
}) => {
  const baseClasses =
    "font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"

  const variantClasses = {
    primary: `medical-gradient text-white shadow-lg hover:shadow-xl focus:ring-medical-500 ${
      glow ? "shadow-glow hover:shadow-glow-lg" : ""
    }`,
    secondary: "glass-card text-gray-700 hover:bg-white/90 focus:ring-gray-500",
    danger: "danger-gradient text-white shadow-lg hover:shadow-xl focus:ring-danger-500",
    ghost: "bg-transparent hover:bg-white/10 text-gray-700 focus:ring-gray-500",
    glass: "glass-button text-gray-700 hover:text-gray-900",
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  return (
    <motion.button
      className={classes}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <motion.div
        className="flex items-center justify-center space-x-2"
        initial={false}
        animate={loading ? { opacity: 0.7 } : { opacity: 1 }}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon && <span>{icon}</span>}
        <span>{loading ? "Loading..." : children}</span>
      </motion.div>

      {/* Shimmer effect */}
      {!loading && (
        <motion.div
          className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  )
}

export default Button
