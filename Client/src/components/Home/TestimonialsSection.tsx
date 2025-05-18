"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import AnimatedSection from "../Animation/AnimatedSection"
import { testimonials } from "../../Data/testimonials"

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slideInterval = useRef<number | null>(null)
  const maxVisibleSlides = 3

  const startSlideTimer = () => {
    stopSlideTimer()
    slideInterval.current = window.setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % testimonials.length)
    }, 5000)
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

  return (
    <section className="py-16 bg-blue-600 text-white relative overflow-hidden">
      <motion.div
        animate={{
          backgroundPositionX: ["0%", "100%"],
          backgroundPositionY: ["0%", "100%"],
        }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url(https://www.paperflite.com/sites/default/files/2020-08/testimonials.jpg)" }}
      ></motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              width: Math.random() * 20 + 5,
              height: Math.random() * 20 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Patients Say About Us</h2>
          <p className="max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt uttom labore et
            dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
          </p>
        </AnimatedSection>

        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex transition-all duration-500 ease-in-out"
              animate={{ x: `-${currentSlide * (100 / maxVisibleSlides)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    className="bg-white rounded-lg shadow-lg p-6 text-gray-800 h-full"
                  >
                    <div className="flex items-center mb-4">
                      <div className="relative">
                        <motion.div
                          className="absolute -top-2 -left-2"
                          animate={{ rotate: [0, 10, 0, -10, 0] }}
                          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <img src="https://img.freepik.com/free-vector/red-gradient-heart-with-nursing-cap-stethoscope_1308-85839.jpg?semt=ais_hybrid&w=740" alt="Quote" className="w-8 h-8" />
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-600"
                        >
                          <img
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-lg">{testimonial.name}</h3>
                        <span className="text-blue-600 text-sm">{testimonial.department}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{testimonial.text}</p>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.slice(0, testimonials.length - maxVisibleSlides + 1).map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to testimonial slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
