"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import AnimatedSection from "../Animation/AnimatedSection"
import { features } from "../../Data/features"

const FeatureSection = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  const handleVideoPlay = () => {
    setIsPlaying(true)
    // In a real implementation, you would trigger a video modal or player here
    window.open("https://www.youtube.com/watch?v=g632EG9s1Mc", "_blank")
  }

  return (
    <section className="relative">
      <div className="flex flex-col lg:flex-row">
        {/* Video Section - 39% width on large screens */}
        <div className="lg:w-[39%] relative">
          <div className="relative h-80 lg:h-full overflow-hidden">
            <motion.img
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
              src="https://assets.clevelandclinic.org/transform/3e9f2415-20c9-45a8-a0ef-4f415008a18a/healthcare-workers-ai-1359494953"
              alt="Video Thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleVideoPlay}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center hover:bg-blue-700 transition-colors"
              aria-label="Play video"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </motion.svg>
            </motion.button>
          </div>
        </div>

        {/* Content Section - 61% width on large screens */}
        <div className="lg:w-[61%] bg-blue-600 text-white p-8 lg:p-12">
          <div className="max-w-3xl">
            <AnimatedSection direction="right">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Our Speciality</h2>
                <p className="text-blue-100">
                  Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the
                  digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the
                  information highway will close
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <AnimatedSection key={index} delay={0.2 + index * 0.1} direction="up">
                  <motion.div whileHover={{ y: -5, x: 5 }} className="flex">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="text-4xl mr-4 text-blue-300"
                    >
                      {feature.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        <a href={feature.url} className="hover:text-blue-200 transition-colors">
                          {feature.title}
                        </a>
                      </h3>
                      <p className="text-blue-100">{feature.description}</p>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureSection
