"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useAnimation } from "../../context/Animation/AnimationContext"
import { bannerSlides } from "../../Data/banner"

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slideInterval = useRef<number | null>(null)
  const { isReducedMotion } = useAnimation()

  const startSlideTimer = () => {
    stopSlideTimer()
    slideInterval.current = window.setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerSlides.length)
    }, 6000)
  }

  const stopSlideTimer = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current)
    }
  }

  useEffect(() => {
    startSlideTimer()
    return () => stopSlideTimer()
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    startSlideTimer()
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + bannerSlides.length) % bannerSlides.length)
    startSlideTimer()
  }

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerSlides.length)
    startSlideTimer()
  }

  const slideVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
      }
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
      }
    },
  }

  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.5 },
  }

  return (
    <div className="relative overflow-hidden bg-gray-100 h-[500px] md:h-[600px]">
      {bannerSlides.map((slide, index) => (
        <motion.div
          key={index}
          custom={index > currentSlide ? 1 : -1}
          variants={slideVariants}
          initial="enter"
          animate={index === currentSlide ? "center" : "exit"}
          exit="exit"
          transition={isReducedMotion ? { duration: 0 } : transition}
          className={`absolute inset-0 w-full h-full ${index === currentSlide ? "z-10" : "z-0"}`}
          style={{
            backgroundImage: `url(${slide.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-20">
            <div className="w-full md:w-1/2">
              <motion.h3
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
              >
                {slide.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-white text-lg mb-6 max-w-lg"
              >
                {slide.text}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <a
                  href={slide.buttonLink}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors transform hover:scale-105 duration-300"
                >
                  Learn More
                </a>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="hidden md:block absolute right-0 bottom-0"
            >
              <img src={slide.personImage || "/placeholder.svg"} alt="Person" className="max-h-[500px]" />
            </motion.div>
          </div>
        </motion.div>
      ))}

      {/* Navigation Arrows */}
      <div className="absolute bottom-5 right-5 z-20 flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToPrevSlide}
          className="bg-white/30 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/50 transition-colors"
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToNextSlide}
          className="bg-white/30 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/50 transition-colors"
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {bannerSlides.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            } transition-all duration-300`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Banner
