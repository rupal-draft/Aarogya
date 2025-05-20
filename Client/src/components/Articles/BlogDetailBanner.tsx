"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Link } from "react-router-dom"

interface BlogDetailBannerProps {
  title: string
}

const BlogDetailBanner = ({ title }: BlogDetailBannerProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start start", "end start"],
  })

  // Parallax effect values
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacityTitle = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 1.1])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <motion.section
      ref={bannerRef}
      className="relative h-[300px] md:h-[400px] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background with parallax effect */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/placeholder.svg?height=1200&width=1920)",
          backgroundPosition: "center",
          y: backgroundY,
          scale,
        }}
      >
        {/* Multiple overlays for depth and visual interest */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-blue-700/70"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>

        {/* Animated pattern overlay */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
          }}
          animate={{
            backgroundPosition: ["0px 0px", "100px 100px"],
          }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 30, ease: "linear" }}
        />
      </motion.div>

      {/* Floating particles for visual interest */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5,
            }}
            animate={{
              y: [0, -100],
              x: [0, Math.random() * 50 - 25],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-center items-center text-center">
        <motion.div style={{ opacity: opacityTitle }} className="relative">
          {/* Decorative elements */}
          <motion.div
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-400"
            initial={{ width: 0 }}
            animate={{ width: isVisible ? 80 : 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          <motion.h1
            className="text-3xl md:text-5xl font-bold text-white mb-6 relative max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <span className="relative">
              {title}
              <motion.span
                className="absolute -bottom-2 left-0 h-1 bg-blue-400"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 1 }}
              />
            </span>
          </motion.h1>

          <motion.div
            className="flex items-center justify-center text-white/90 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <motion.span
              className="mx-3 text-blue-300"
              animate={{ rotate: [0, 45, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
            >
              /
            </motion.span>
            <Link to="/blogs" className="hover:text-white transition-colors">
              Blogs
            </Link>
            <motion.span
              className="mx-3 text-blue-300"
              animate={{ rotate: [0, 45, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
            >
              /
            </motion.span>
            <span className="text-white font-medium">Blog Details</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom wave effect */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <motion.path
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            fill="#f3f4f6"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></motion.path>
        </svg>
      </div>
    </motion.section>
  )
}

export default BlogDetailBanner
