"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AnimatedSection from "../Animation/AnimatedSection"
import { tabs } from "../../Data/tabs"

const WhyChooseUs = () => {
  const [activeTab, setActiveTab] = useState("mission")

  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <AnimatedSection className="lg:w-1/2 order-2 lg:order-1" direction="left">
            <div className="max-w-lg">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Hospital</h2>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-6">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-4 font-medium text-sm focus:outline-none relative ${
                      activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    {tab.title}
                    {activeTab === tab.id && (
                      <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" layoutId="underline" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="py-4 min-h-[200px]">
                <AnimatePresence mode="wait">
                  {tabs.map(
                    (tab) =>
                      activeTab === tab.id && (
                        <motion.div
                          key={tab.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-gray-600 mb-4">{tab.content}</p>
                          <p className="text-gray-600 mb-6">{tab.additionalContent}</p>
                          <motion.a
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                            whileTap={{ scale: 0.95 }}
                            href={tab.buttonLink}
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Learn More
                          </motion.a>
                        </motion.div>
                      ),
                  )}
                </AnimatePresence>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="lg:w-1/2 order-1 lg:order-2 mb-8 lg:mb-0" direction="right">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <img src="https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Doctor" className="max-w-full h-auto mx-auto" />
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <p className="font-bold text-xl">25+ Years</p>
                <p>of Experience</p>
              </motion.div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
