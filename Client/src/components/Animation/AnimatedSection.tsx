"use client"

import React from "react"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useScrollAnimation } from "../../hooks/Animation/useScrollAnimation"
import { useAnimation } from "../../context/Animation/AnimationContext"


type AnimatedSectionProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  duration?: number
  staggerChildren?: boolean
  staggerDelay?: number
  distance?: number
}

const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.6,
  staggerChildren = false,
  staggerDelay = 0.1,
  distance = 50,
}: AnimatedSectionProps) => {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()
  const { isReducedMotion } = useAnimation()

  // Define animation variants based on direction
  const getInitialPosition = () => {
    if (isReducedMotion) return { opacity: 1 }

    switch (direction) {
      case "up":
        return { opacity: 0, y: distance }
      case "down":
        return { opacity: 0, y: -distance }
      case "left":
        return { opacity: 0, x: distance }
      case "right":
        return { opacity: 0, x: -distance }
      case "none":
        return { opacity: 0 }
      default:
        return { opacity: 0, y: distance }
    }
  }

  const containerVariants = {
    hidden: getInitialPosition(),
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: staggerChildren ? staggerDelay : 0,
      },
    },
  }

  const childVariants = staggerChildren
    ? {
        hidden: getInitialPosition(),
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: {
            duration,
            ease: "easeOut",
          },
        },
      }
    : {}

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {staggerChildren
        ? React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child
            return (
              <motion.div variants={childVariants} className="stagger-item">
                {child}
              </motion.div>
            )
          })
        : children}
    </motion.div>
  )
}

export default AnimatedSection
