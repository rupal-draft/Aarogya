"use client"

import { motion } from "framer-motion"
import AnimatedSection from "../Animation/AnimatedSection"

const AboutSection = () => {
  const features = ["Medical Quality", "Modern Technology", "Natural Environment", "Experienced Doctors"]

  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row">
          <AnimatedSection className="lg:w-1/2 p-6" direction="left">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">About US</h3>
            <p className="text-xl text-blue-600 mb-4">
              Better health care with efficient cost is the main focus of our hospital.
            </p>
            <p className="text-gray-600 mb-4">
              Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day,
              going forward, a new normal that has evolved from generation X is on the runway heading towards a
              streamlined cloud solution.
            </p>
            <p className="text-gray-600 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <AnimatedSection staggerChildren staggerDelay={0.1} direction="none">
                {features.slice(0, 2).map((feature, index) => (
                  <motion.div key={index} whileHover={{ x: 5 }} className="flex items-center mb-2">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="text-blue-600 mr-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </AnimatedSection>
              <AnimatedSection staggerChildren staggerDelay={0.1} direction="none" delay={0.2}>
                {features.slice(2).map((feature, index) => (
                  <motion.div key={index} whileHover={{ x: 5 }} className="flex items-center mb-2">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="text-blue-600 mr-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </AnimatedSection>
            </div>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/about"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Learn More
            </motion.a>
          </AnimatedSection>

          <AnimatedSection className="lg:w-1/2 mt-8 lg:mt-0" direction="right" delay={0.3}>
            <div className="grid grid-cols-12 gap-2">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="col-span-7"
              >
                <div className="h-full">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    src="https://images.pexels.com/photos/3259629/pexels-photo-3259629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="About"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </div>
              </motion.div>
              <div className="col-span-5 flex flex-col gap-2">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    src="https://images.pexels.com/photos/2324837/pexels-photo-2324837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="About"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.8 }}
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    src="https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="About"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </motion.div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
