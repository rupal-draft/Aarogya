"use client"

import { services } from "../../Data/services"
import AnimatedSection from "../Animation/AnimatedSection"
import { motion } from "framer-motion"

const ServiceSection = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Departments</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt uttom labore et
            dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AnimatedSection key={index} delay={index * 0.1} direction="up" className="h-full">
              <motion.div
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="bg-white rounded-lg shadow-lg p-6 h-full transition-all duration-300"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="text-blue-600 text-4xl mb-4"
                >
                  {service.icon}
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    <a
                      href={service.url}
                      className="text-gray-800 hover:text-blue-600 transition-colors inline-block relative group"
                    >
                      {service.title}
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServiceSection
